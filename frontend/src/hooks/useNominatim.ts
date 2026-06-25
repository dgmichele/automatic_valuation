import { useState, useEffect, useRef, useCallback } from 'react';

/** Struttura restituita da Nominatim per ogni suggerimento */
export interface NominatimSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
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

/**
 * Pulisce la query di ricerca rimuovendo i numeri civici isolati.
 * Mantiene i numeri che fanno parte del nome della via (es: "Via 25 Aprile").
 */
const cleanQueryForSearch = (q: string): string => {
  // Pattern comuni in cui i numeri fanno parte del nome della via
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

/** Costruisce il testo principale (via) per il dropdown */
const buildPrimaryText = (s: NominatimSuggestion): string => {
  const { address } = s;
  return address.road ?? address.pedestrian ?? address.square ?? s.display_name.split(',')[0];
};

/** Costruisce il testo secondario (comune, provincia e cap) per il dropdown */
const buildSecondaryText = (s: NominatimSuggestion): string => {
  const { address } = s;
  const parts: string[] = [];

  const city = address.city ?? address.town ?? address.village;
  if (city) {
    let county = address.county;
    if (county) {
      if (county.toLowerCase().includes('torino')) {
        county = 'TO';
      } else {
        county = county.replace(/città metropolitana di/i, '').trim();
      }
      parts.push(`${city} (${county})`);
    } else {
      parts.push(city);
    }
  }

  if (address.postcode) {
    parts.push(address.postcode);
  }

  return parts.length > 0 ? parts.join(' - ') : '';
};

export const useNominatim = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<NominatimSuggestion[]>([]);
  const [selected, setSelected] = useState<SelectedAddress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [missingHouseNumber, setMissingHouseNumber] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortController = useRef<AbortController | null>(null);
  const isSelectingRef = useRef(false);

  const viewbox = import.meta.env.VITE_NOMINATIM_VIEWBOX ?? '7.7,45.55,8.0,45.35';

  /** Costruisce una stringa indirizzo compatta dal suggestion Nominatim */
  const buildDisplayName = (s: NominatimSuggestion): string => {
    const { address } = s;
    const parts: string[] = [];

    const road = address.road ?? address.pedestrian ?? address.square;
    if (road) {
      parts.push(address.house_number ? `${road} ${address.house_number}` : road);
    }

    const city = address.city ?? address.town ?? address.village ?? address.county;
    if (city) parts.push(city);

    return parts.length > 0 ? parts.join(', ') : s.display_name;
  };

  /** Esegue la chiamata a Nominatim */
  const fetchSuggestions = useCallback(
    async (searchQuery: string) => {
      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();

      setIsLoading(true);

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
          limit: '5',
          countrycodes: 'it',
          viewbox,
          bounded: '1', // Forza la ricerca a rimanere rigorosamente nella viewbox del Canavese
        });

        const response = await fetch(`${NOMINATIM_BASE}?${params.toString()}`, {
          signal: abortController.current.signal,
          headers: {
            'Accept-Language': 'it',
          },
        });

        if (!response.ok) throw new Error('Nominatim non disponibile');

                const data: NominatimSuggestion[] = await response.json();
        
        // Formattazione testi e de-duplicazione
        const formattedData = data.map(s => {
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

        const seen = new Set<string>();
        const uniqueData = formattedData.filter(s => {
          const key = `${s.primaryText?.toLowerCase()}|${s.secondaryText?.toLowerCase()}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        setSuggestions(uniqueData);
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [viewbox],
  );

  // Debounce per le modifiche della query
  useEffect(() => {
    // Se la query è cambiata a seguito di una selezione, evitiamo il reset e la nuova chiamata API
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    setSelected(null);
    setMissingHouseNumber(false);

    if (query.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
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
      // Estraiamo il civico dal testo originario digitato
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
    setMissingHouseNumber(false);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    selected,
    isLoading,
    missingHouseNumber,
    handleSelect,
    reset,
  };
};
