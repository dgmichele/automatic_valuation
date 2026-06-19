/**
 * useNominatim.ts — Hook per il fetch di suggerimenti indirizzo via Nominatim.
 *
 * Responsabilità:
 * - Gestisce lo stato locale dell'input (query)
 * - Esegue la ricerca su Nominatim con debounce di 400ms
 * - Filtra i risultati per viewbox (Canavese/Eporediese) da env
 * - Espone la lista di suggerimenti e il suggestion selezionato
 * - Il suggestion selezionato deve avere house_number per essere "valido"
 */
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
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    [key: string]: string | undefined;
  };
}

/** Dati estratti dal suggestion selezionato, pronti per il lookup */
export interface SelectedAddress {
  lat: number;
  lon: number;
  displayName: string;
  hasHouseNumber: boolean;
}

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';
const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 3;

export const useNominatim = () => {
  // Testo dell'input
  const [query, setQuery] = useState('');
  // Lista suggerimenti Nominatim
  const [suggestions, setSuggestions] = useState<NominatimSuggestion[]>([]);
  // Suggestion selezionato dall'utente
  const [selected, setSelected] = useState<SelectedAddress | null>(null);
  // Flag di caricamento
  const [isLoading, setIsLoading] = useState(false);
  // Testo di avviso per house_number mancante
  const [missingHouseNumber, setMissingHouseNumber] = useState(false);

  // Ref per il timer del debounce
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref per l'AbortController — cancella fetch precedenti
  const abortController = useRef<AbortController | null>(null);

  // Viewbox dal file .env (es. "7.7,45.55,8.0,45.35")
  const viewbox = import.meta.env.VITE_NOMINATIM_VIEWBOX ?? '7.7,45.55,8.0,45.35';

  /** Costruisce una stringa indirizzo compatta dal suggestion Nominatim */
  const buildDisplayName = (s: NominatimSuggestion): string => {
    const { address } = s;
    const parts: string[] = [];

    if (address.road) {
      parts.push(address.house_number ? `${address.road} ${address.house_number}` : address.road);
    }

    const city = address.city ?? address.town ?? address.village ?? address.county;
    if (city) parts.push(city);

    return parts.length > 0 ? parts.join(', ') : s.display_name;
  };

  /** Esegue la chiamata a Nominatim */
  const fetchSuggestions = useCallback(
    async (searchQuery: string) => {
      // Annulla il fetch precedente se ancora in corso
      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();

      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          q: searchQuery,
          format: 'json',
          addressdetails: '1',
          limit: '5',
          countrycodes: 'it',
          viewbox,
          bounded: '0', // Non limitare rigidamente alla viewbox, ma preferirla
        });

        const response = await fetch(`${NOMINATIM_BASE}?${params.toString()}`, {
          signal: abortController.current.signal,
          headers: {
            // Header richiesto da Nominatim per identificare l'applicazione
            'Accept-Language': 'it',
          },
        });

        if (!response.ok) throw new Error('Nominatim non disponibile');

        const data: NominatimSuggestion[] = await response.json();
        setSuggestions(data);
      } catch (err: unknown) {
        // Ignora gli errori di abort (cancellazione intenzionale)
        if ((err as Error)?.name !== 'AbortError') {
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [viewbox],
  );

  // Debounce: esegue fetchSuggestions 400ms dopo l'ultima modifica alla query
  useEffect(() => {
    // Reset del suggestion selezionato quando l'utente modifica la query
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
   * Controlla la presenza di house_number e aggiorna lo stato di conseguenza.
   */
  const handleSelect = useCallback((suggestion: NominatimSuggestion) => {
    const hasHouseNumber = Boolean(suggestion.address.house_number);
    const displayName = buildDisplayName(suggestion);

    // Popola il campo input con il testo del suggestion selezionato
    setQuery(displayName);
    // Chiude la lista dropdown
    setSuggestions([]);

    if (!hasHouseNumber) {
      // Segnala civico mancante — pulsante "Valuta" resterà disabilitato
      setMissingHouseNumber(true);
      setSelected(null);
    } else {
      setMissingHouseNumber(false);
      setSelected({
        lat: parseFloat(suggestion.lat),
        lon: parseFloat(suggestion.lon),
        displayName,
        hasHouseNumber: true,
      });
    }
  }, []);

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
