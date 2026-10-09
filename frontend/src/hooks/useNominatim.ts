import { useState, useEffect, useRef, useCallback } from 'react';

/** Struttura restituita da Nominatim per ogni suggerimento */
export interface NominatimSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  /** Tipo di entità OSM (es. 'city', 'administrative', 'town', 'road') */
  type?: string;
  address: {
    house_number?: string;
    road?: string;
    pedestrian?: string;
    square?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    [key: string]: string | undefined;
  };
  // Campi per la visualizzazione Google-style
  primaryText?: string;
  secondaryText?: string;
}

/** Dati estratti dal suggestion selezionato, pronti per il lookup */
export interface SelectedAddress {
  lat: number;
  lon: number;
  displayName: string;
  hasHouseNumber: boolean;
  road?: string;
}

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';
const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 3;
/** Delay aggiuntivo prima della chiamata out-of-zone per non eccedere 1 req/sec di Nominatim */
const OUT_OF_ZONE_DELAY_MS = 600;
/** Email identificativa per le policy Nominatim (riduce rischio ban permanente) */
const NOMINATIM_EMAIL = import.meta.env.VITE_NOMINATIM_EMAIL ?? 'app@bichimmobiliare.it';

/** Coordinate di riferimento del centro di Ivrea per il calcolo della prossimità */
const IVREA_CENTER = { lat: 45.4667, lon: 7.8767 };

/** Elenco normalizzato dei 19 comuni coperti dall'applicazione (vedi 01_zones.ts) */
const SUPPORTED_MUNICIPALITIES = [
  'ivrea',
  'albiano',
  'banchette',
  'bollengo',
  'borgofranco',
  'burolo',
  'cascinette',
  'chiaverano',
  'colleretto giacosa',
  'colleretto',
  'fiorano',
  'lessolo',
  'loranzè',
  'loranze',
  'montalto',
  'palazzo',
  'pavone',
  'romano',
  'salerano',
  'samone',
  'strambino',
];

/** Parole di stop per la tokenizzazione della query nell'analisi out-of-zone */
const STOP_WORDS = [
  'via', 'viale', 'corso', 'piazza', 'piazzetta', 'vicolo', 'strada',
  'stradella', 'largo', 'localita', 'loc', 'frazione', 'fraz',
  'delle', 'della', 'degli', 'dei', 'del', 'san', 'santa', 'sant',
];

/** Calcola la distanza approssimativa in km dal centro di Ivrea */
const getDistanceFromIvrea = (lat: number, lon: number): number => {
  const dLat = (lat - IVREA_CENTER.lat) * 111.32;
  const dLon = (lon - IVREA_CENTER.lon) * (111.32 * Math.cos(IVREA_CENTER.lat * (Math.PI / 180)));
  return Math.sqrt(dLat * dLat + dLon * dLon);
};

/** Verifica se le coordinate rientrano nella viewbox di riferimento */
const isInViewbox = (lat: number, lon: number, viewbox: string): boolean => {
  // viewbox formato: "minLon,maxLat,maxLon,minLat"  (es. "7.7,45.55,8.0,45.35")
  const [minLon, maxLat, maxLon, minLat] = viewbox.split(',').map(Number);
  return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
};

/** Verifica se il suggerimento appartiene a uno dei 19 comuni supportati */
const isSupportedMunicipality = (s: NominatimSuggestion): boolean => {
  const municipality = extractMunicipality(s).toLowerCase().trim();
  const displayName = (s.display_name || '').toLowerCase();
  return SUPPORTED_MUNICIPALITIES.some(
    (m) => municipality.includes(m) || displayName.includes(m),
  );
};

/** Verifica se l'utente ha menzionato esplicitamente il comune nella query digitata */
const isMunicipalityMentioned = (query: string, municipality: string): boolean => {
  if (!municipality || municipality.length < 3) return false;
  const munClean = municipality.toLowerCase().trim();
  const qClean = query.toLowerCase().trim();
  return (
    qClean.includes(munClean) ||
    qClean.split(/[\s,]+/).some((token) => token.length >= 4 && munClean.includes(token))
  );
};

/**
 * Pulisce la query di ricerca rimuovendo i numeri civici isolati.
 * Mantiene i numeri che fanno parte del nome della via (es: "Via 25 Aprile").
 */
const cleanQueryForSearch = (q: string): string => {
  const streetNamePattern = /\b\d+\b\s*(?:gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre|martiri|giornate|cantoni|alpini|bersaglieri|fanti|pontili|mura)/i;

  return q.replace(/\b\d+\s*([a-zA-Z])?\b/g, (match, _letter, offset, fullString) => {
    const surroundingText = fullString.substring(offset, offset + 30);
    if (streetNamePattern.test(surroundingText)) {
      return match; // Mantiene il numero
    }
    return ''; // Rimuove il numero (civico)
  }).replace(/\s+/g, ' ').trim();
};

/**
 * Estrae il numero civico dalla query originale digitata dall'utente.
 * Esclude i numeri che sono già parte del nome della strada selezionata.
 */
const extractHouseNumber = (originalQuery: string, selectedRoad: string): string | undefined => {
  if (!selectedRoad) return undefined;

  const numberMatches = originalQuery.match(/\b\d+\s*[-/]?\s*[a-zA-Z]?\b/g);
  if (!numberMatches) return undefined;

  const roadLower = selectedRoad.toLowerCase();
  for (const match of numberMatches) {
    const cleanMatch = match.trim();
    const numRegex = new RegExp(`\\b${cleanMatch.replace(/[-\/]/g, '')}\\b`, 'i');
    const roadClean = roadLower.replace(/[-\/]/g, ' ');
    if (!numRegex.test(roadClean)) {
      return cleanMatch.toUpperCase().replace(/\s+/g, '');
    }
  }

  return undefined;
};

/**
 * Estrae il nome del Comune dal suggerimento Nominatim escludendo frazioni/quartieri.
 * Gestisce i casi in cui Nominatim etichetta frazioni come "village" o comuni minori come "village".
 */
export const extractMunicipality = (s: NominatimSuggestion): string => {
  const { address, display_name } = s;

  if (address.city) return address.city;
  if (address.town) return address.town;
  if (address.municipality) return address.municipality;

  if (display_name) {
    const parts = display_name.split(',').map((p) => p.trim()).filter(Boolean);

    const isPostcode = (str: string) => /^\d{5}$/.test(str);
    const isCountry = (str: string) => /^(italia|italy)$/i.test(str);
    const isState = (str: string) =>
      Boolean(address.state && str.toLowerCase() === address.state.toLowerCase());
    const isCounty = (str: string) => {
      const lower = str.toLowerCase();
      const countyLower = address.county?.toLowerCase() ?? '';
      return (
        lower === countyLower ||
        lower.includes('torino') ||
        lower.includes('città metropolitana') ||
        lower.includes('provincia di')
      );
    };

    const localParts = parts.filter(
      (p) => !isCountry(p) && !isPostcode(p) && !isState(p) && !isCounty(p),
    );

    if (localParts.length > 1) {
      return localParts[localParts.length - 1];
    }
    if (localParts.length === 1) {
      return localParts[0];
    }
  }

  return address.village ?? address.hamlet ?? address.suburb ?? address.county ?? '';
};

/** Costruisce il testo principale (via) per il dropdown */
const buildPrimaryText = (s: NominatimSuggestion): string => {
  const { address } = s;
  const road = address.road ?? address.pedestrian ?? address.square;
  if (road) return road;

  const city = extractMunicipality(s);
  if (city) return city;

  return s.display_name.split(',')[0];
};

/** Costruisce il testo secondario (comune e provincia) per il dropdown, escludendo il CAP */
const buildSecondaryText = (s: NominatimSuggestion): string => {
  const { address } = s;
  const parts: string[] = [];

  const city = extractMunicipality(s);
  if (city) {
    let county = address.county;
    if (county) {
      if (county.toLowerCase().includes('torino')) {
        county = 'TO';
      } else {
        county = county
          .replace(/città metropolitana di/i, '')
          .replace(/provincia di/i, '')
          .trim();
      }
      parts.push(`${city} (${county})`);
    } else {
      parts.push(city);
    }
  }

  return parts.length > 0 ? parts.join(' - ') : '';
};

export const useNominatim = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<NominatimSuggestion[]>([]);
  const [selected, setSelected] = useState<SelectedAddress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  /** Messaggio d'errore contestuale (null = nessun errore). Sostituisce il precedente isError booleano. */
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [missingHouseNumber, setMissingHouseNumber] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortController = useRef<AbortController | null>(null);
  const outOfZoneAbort = useRef<AbortController | null>(null);
  const outOfZoneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSelectingRef = useRef(false);
  /** Flag che indica se l'utente ha ripreso a digitare — usato per annullare la chiamata out-of-zone */
  const isTypingRef = useRef(false);

  const viewbox = import.meta.env.VITE_NOMINATIM_VIEWBOX ?? '7.7,45.55,8.0,45.35';

  /** Costruisce una stringa indirizzo compatta dal suggestion Nominatim */
  const buildDisplayName = (s: NominatimSuggestion): string => {
    const { address } = s;
    const parts: string[] = [];

    const road = address.road ?? address.pedestrian ?? address.square;
    if (road) {
      parts.push(address.house_number ? `${road} ${address.house_number}` : road);
    }

    const city = extractMunicipality(s);
    if (city && !parts.includes(city)) {
      parts.push(city);
    }

    return parts.length > 0 ? parts.join(', ') : s.display_name;
  };

  /**
   * Verifica out-of-zone: chiamata Nominatim senza bounded per capire se
   * l'indirizzo cercato esiste ma è fuori dalla zona operativa.
   *
   * Protezioni anti-429:
   * - Viene invocata solo dopo OUT_OF_ZONE_DELAY_MS dal ritorno della chiamata principale
   * - Viene annullata se isTypingRef è true (utente ha ripreso a digitare)
   * - Ha un proprio AbortController separato
   */
  const checkOutOfZone = useCallback(
    async (cleanedQuery: string, originalQuery: string) => {
      // Guard: se l'utente ha già ripreso a digitare, non lanciamo la chiamata
      if (isTypingRef.current) return;

      if (outOfZoneAbort.current) {
        outOfZoneAbort.current.abort();
      }
      outOfZoneAbort.current = new AbortController();

      const params = new URLSearchParams({
        q: cleanedQuery,
        format: 'json',
        addressdetails: '1',
        limit: '5',
        countrycodes: 'it',
        email: NOMINATIM_EMAIL,
      });

      try {
        const res = await fetch(`${NOMINATIM_BASE}?${params.toString()}`, {
          signal: outOfZoneAbort.current.signal,
          headers: { 'Accept-Language': 'it' },
        });
        const results: NominatimSuggestion[] = res.ok ? await res.json() : [];

        // Tokenizza la query escludendo parole di stop
        const queryTokens = originalQuery
          .toLowerCase()
          .split(/[\s,]+/)
          .filter((t) => t.length >= 3 && !STOP_WORDS.includes(t));

        // Parole che seguono un prefisso stradale (es. "milano" da "Via Milano")
        // appartengono al nome della via e non devono essere scambiate per un comune
        const streetPrefixRe = /\b(?:via|viale|corso|piazza|piazzale|piazzetta|vicolo|strada|stradella|largo)\s+([a-zA-Zàèéìòù]+)/gi;
        const wordsAfterStreetPrefix = new Set<string>();
        let m: RegExpExecArray | null;
        while ((m = streetPrefixRe.exec(originalQuery.toLowerCase())) !== null) {
          wordsAfterStreetPrefix.add(m[1]);
        }

        const cityTokens = queryTokens.filter((t) => !wordsAfterStreetPrefix.has(t));
        const hasStreetPrefix = /\b(?:via|viale|corso|piazza|piazzale|piazzetta|vicolo|strada|stradella|largo)\b/i.test(originalQuery);

        if (!results || results.length === 0) {
          if (queryTokens.length >= 2 || /\d+/.test(originalQuery)) {
            setErrorMessage('Nessun indirizzo trovato. Verifica che la via e il comune siano corretti.');
          }
          return;
        }

        const first = results[0];
        const lat = parseFloat(first.lat);
        const lon = parseFloat(first.lon);

        const isOutside = !isInViewbox(lat, lon, viewbox) || !isSupportedMunicipality(first);
        if (!isOutside) {
          // Trovato dentro la zona: nessun errore
          return;
        }

        const addr = first.address;
        const city = (addr.city || addr.town || addr.municipality || '').toLowerCase();
        const village = (addr.village || addr.hamlet || '').toLowerCase();
        const county = (addr.county || '').toLowerCase();

        const placeWords = [
          ...city.split(/[\s,]+/),
          ...village.split(/[\s,]+/),
          ...county.split(/[\s,]+/),
        ].filter((w) => w.length >= 3);

        const userTypedSpecificPlace = cityTokens.some((token) => placeWords.includes(token));
        const isDirectCityQuery =
          !hasStreetPrefix &&
          (first.type === 'city' || first.type === 'administrative' || first.type === 'town') &&
          queryTokens.some((token) => placeWords.includes(token));

        if (userTypedSpecificPlace || isDirectCityQuery) {
          const municipalityName = extractMunicipality(first);
          let displayCity = municipalityName;
          if (
            county &&
            originalQuery.toLowerCase().includes(county) &&
            (!displayCity || !originalQuery.toLowerCase().includes(displayCity.toLowerCase()))
          ) {
            displayCity = addr.county ?? displayCity;
          }
          setErrorMessage(
            displayCity
              ? `Il comune/area di ${displayCity} non rientra nella nostra zona operativa.`
              : "L'indirizzo indicato non rientra nella nostra zona operativa.",
          );
        } else if (queryTokens.length >= 2 || /\d+/.test(originalQuery)) {
          setErrorMessage('Nessun indirizzo trovato. Verifica che la via e il comune siano corretti.');
        }
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          // Errore di rete nella chiamata out-of-zone: ignora silenziosamente
        }
      }
    },
    [viewbox],
  );

  /** Esegue la chiamata principale a Nominatim con bounded=1 */
  const fetchSuggestions = useCallback(
    async (searchQuery: string) => {
      // Annulla qualsiasi out-of-zone pendente prima di una nuova fetch principale
      if (outOfZoneTimer.current) clearTimeout(outOfZoneTimer.current);
      if (outOfZoneAbort.current) outOfZoneAbort.current.abort();

      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();

      setIsLoading(true);
      setErrorMessage(null);

      const timeoutId = setTimeout(() => {
        if (abortController.current) {
          abortController.current.abort();
        }
      }, 8000);

      try {
        const cleanedQuery = cleanQueryForSearch(searchQuery);

        if (cleanedQuery.length < MIN_QUERY_LENGTH) {
          setSuggestions([]);
          setIsLoading(false);
          return;
        }

        const params = new URLSearchParams({
          q: cleanedQuery,
          format: 'json',
          addressdetails: '1',
          limit: '40',
          countrycodes: 'it',
          viewbox,
          bounded: '1',
          email: NOMINATIM_EMAIL,
        });

        const response = await fetch(`${NOMINATIM_BASE}?${params.toString()}`, {
          signal: abortController.current.signal,
          headers: {
            'Accept-Language': 'it',
          },
        });

        if (!response.ok) throw new Error('Nominatim non disponibile');

        const data: NominatimSuggestion[] = await response.json();

        if (!data || data.length === 0) {
          setSuggestions([]);
          // Lancia la verifica out-of-zone con delay anti-429 se l'utente non sta digitando
          outOfZoneTimer.current = setTimeout(() => {
            void checkOutOfZone(cleanedQuery, searchQuery);
          }, OUT_OF_ZONE_DELAY_MS);
          return;
        }

        // ── Filtro strutturale: escludi risultati senza via (es. solo comune) ──
        const formattedData = data
          .filter((s) => Boolean(s.address.road ?? s.address.pedestrian ?? s.address.square))
          .map((s) => {
            const road = s.address.road ?? s.address.pedestrian ?? s.address.square ?? '';
            let primaryText = buildPrimaryText(s);
            const secondaryText = buildSecondaryText(s);

            // Se l'utente ha inserito un civico nella query originale, lo mostriamo nella tendina
            const extractedCivic = extractHouseNumber(searchQuery, road);
            if (extractedCivic) {
              primaryText = `${primaryText} ${extractedCivic}`;
            }

            return {
              ...s,
              primaryText,
              secondaryText,
            };
          });

        // Se dopo il filtro address.road non rimane nulla (es: utente ha cercato solo il comune)
        if (formattedData.length === 0) {
          setSuggestions([]);
          setErrorMessage('Devi inserire una Via oltre al Comune (es: Via Roma 5... ).');
          return;
        }

        // Deduplicazione rigorosa per [Via + Comune]
        const seen = new Set<string>();
        const uniqueData = formattedData.filter((s) => {
          const road = s.address.road ?? s.address.pedestrian ?? s.address.square ?? s.primaryText ?? '';
          const municipality = extractMunicipality(s);
          const key = `${road.toLowerCase().trim()}|${municipality.toLowerCase().trim()}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        // Ordinamento intelligente a 3 criteri
        uniqueData.sort((a, b) => {
          const munA = extractMunicipality(a);
          const munB = extractMunicipality(b);

          const matchA = isMunicipalityMentioned(searchQuery, munA) ? 1 : 0;
          const matchB = isMunicipalityMentioned(searchQuery, munB) ? 1 : 0;
          if (matchA !== matchB) return matchB - matchA;

          const supA = isSupportedMunicipality(a) ? 1 : 0;
          const supB = isSupportedMunicipality(b) ? 1 : 0;
          if (supA !== supB) return supB - supA;

          const distA = getDistanceFromIvrea(parseFloat(a.lat), parseFloat(a.lon));
          const distB = getDistanceFromIvrea(parseFloat(b.lat), parseFloat(b.lon));
          return distA - distB;
        });

        setErrorMessage(null);
        setSuggestions(uniqueData);
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          setSuggestions([]);
          setErrorMessage('Servizio di ricerca indirizzi temporaneamente non disponibile. Riprova tra poco.');
        }
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    },
    [viewbox, checkOutOfZone],
  );

  // Debounce per le modifiche della query
  useEffect(() => {
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    // Segnala che l'utente sta digitando: annulla qualsiasi out-of-zone pendente
    isTypingRef.current = true;
    if (outOfZoneTimer.current) clearTimeout(outOfZoneTimer.current);
    if (outOfZoneAbort.current) outOfZoneAbort.current.abort();

    setSelected(null);
    setMissingHouseNumber(false);
    setErrorMessage(null);

    if (query.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      isTypingRef.current = false;
      void fetchSuggestions(query);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, fetchSuggestions]);

  /**
   * Gestisce la selezione di un suggestion dalla lista.
   * Cerca di estrarre il civico dall'input utente se assente in Nominatim.
   */
  const handleSelect = useCallback((suggestion: NominatimSuggestion) => {
    isSelectingRef.current = true;

    const road = suggestion.address.road ?? suggestion.address.pedestrian ?? suggestion.address.square ?? '';
    let houseNumber = suggestion.address.house_number;
    if (!houseNumber) {
      houseNumber = extractHouseNumber(query, road);
    }

    const updatedSuggestion = {
      ...suggestion,
      address: {
        ...suggestion.address,
        house_number: houseNumber,
      }
    };

    const hasHouseNumber = Boolean(houseNumber);
    const displayName = buildDisplayName(updatedSuggestion);

    setQuery(displayName);
    setSuggestions([]);
    setErrorMessage(null);

    setSelected({
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
      displayName,
      hasHouseNumber,
      road,
    });

    if (!hasHouseNumber) {
      setMissingHouseNumber(true);
    } else {
      setMissingHouseNumber(false);
    }
  }, [query]);

  /** Resetta tutto lo stato del componente */
  const reset = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setSelected(null);
    setIsLoading(false);
    setErrorMessage(null);
    setMissingHouseNumber(false);
    if (outOfZoneTimer.current) clearTimeout(outOfZoneTimer.current);
    if (outOfZoneAbort.current) outOfZoneAbort.current.abort();
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    selected,
    isLoading,
    /** Messaggio d'errore contestuale (null = nessun errore). */
    errorMessage,
    /** @deprecated Usa errorMessage al posto di isError per messaggi granulari. */
    isError: errorMessage !== null,
    missingHouseNumber,
    handleSelect,
    reset,
  };
};
