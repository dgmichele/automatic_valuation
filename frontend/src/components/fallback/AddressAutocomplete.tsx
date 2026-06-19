/**
 * AddressAutocomplete.tsx — Componente autocomplete indirizzo via Nominatim.
 *
 * Funzionalità:
 * - Input con suggerimenti Nominatim (debounce 400ms, via useNominatim)
 * - Solo suggerimenti con house_number selezionabili per il submit
 * - Avviso inline se selezionato indirizzo senza civico
 * - Pulsante "Valuta" disabilitato finché non c'è un indirizzo valido selezionato
 * - Emette onValidSelect con { lat, lon, displayName } quando la selezione è valida
 */
import { useRef, useEffect } from 'react';
import { MdSearch, MdLocationOn, MdClose } from 'react-icons/md';
import clsx from 'clsx';
import { useNominatim, type SelectedAddress } from '../../hooks/useNominatim';

interface AddressAutocompleteProps {
  /** Callback invocato quando l'utente ha selezionato un indirizzo valido e clicca "Valuta" */
  onValidSelect: (address: SelectedAddress) => void;
  /** Stato di caricamento esterno (geo lookup in corso dopo click "Valuta") */
  isSubmitting?: boolean;
}

const AddressAutocomplete = ({
  onValidSelect,
  isSubmitting = false,
}: AddressAutocompleteProps) => {
  const {
    query,
    setQuery,
    suggestions,
    selected,
    isLoading,
    missingHouseNumber,
    handleSelect,
    reset,
  } = useNominatim();

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Chiudi la dropdown al click fuori dal componente
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        listRef.current &&
        !listRef.current.contains(target)
      ) {
        // Chiudi i suggerimenti senza resettare il query
        // (l'utente potrebbe aver cliccato altrove dopo aver digitato)
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /** Pulsante "Valuta": attivo solo se c'è un selected valido e non sta già caricando */
  const isValutaDisabled = !selected || isSubmitting;

  const handleValutaClick = () => {
    if (selected && selected.hasHouseNumber) {
      onValidSelect(selected);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* ── Campo input con icona ricerca ── */}
      <div className="relative">
        <div className="relative flex items-center">
          {/* Icona lente */}
          <MdSearch
            className="pointer-events-none absolute left-4 h-5 w-5 text-brand-placeholder"
            aria-hidden="true"
          />

          <input
            ref={inputRef}
            id="address-autocomplete-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Es. Via Palestro 3, Ivrea"
            autoComplete="off"
            disabled={isSubmitting}
            aria-label="Inserisci indirizzo"
            aria-autocomplete="list"
            aria-controls="address-suggestions-list"
            aria-expanded={suggestions.length > 0}
            className={clsx(
              'w-full rounded-xl border bg-brand-field py-3.5 pl-11 pr-10',
              'font-sans text-sm text-brand-dark placeholder:text-brand-placeholder',
              'transition duration-300',
              'focus:border-brand-border-focus focus:outline-none focus:ring-2 focus:ring-brand-border-focus/30',
              'disabled:cursor-not-allowed disabled:opacity-60',
              missingHouseNumber
                ? 'border-amber-400'
                : 'border-brand-border',
            )}
          />

          {/* Pulsante clear — visibile solo se c'è testo */}
          {query.length > 0 && !isSubmitting && (
            <button
              type="button"
              onClick={reset}
              aria-label="Cancella indirizzo"
              className="absolute right-3 p-1 text-brand-placeholder transition duration-300 hover:text-brand-dark"
            >
              <MdClose className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ── Dropdown suggerimenti ── */}
        {suggestions.length > 0 && (
          <ul
            ref={listRef}
            id="address-suggestions-list"
            role="listbox"
            aria-label="Suggerimenti indirizzo"
            className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-brand-border bg-brand-field shadow-lg"
          >
            {suggestions.map((suggestion) => {
              const hasHouseNumber = Boolean(suggestion.address.house_number);
              return (
                <li
                  key={suggestion.place_id}
                  role="option"
                  aria-selected={false}
                  onClick={() => handleSelect(suggestion)}
                  className={clsx(
                    'flex cursor-pointer items-start gap-3 px-4 py-3',
                    'transition duration-200 hover:bg-brand-border/30',
                    'border-b border-brand-border last:border-0',
                  )}
                >
                  <MdLocationOn
                    className={clsx(
                      'mt-0.5 h-4 w-4 shrink-0',
                      hasHouseNumber ? 'text-brand-primary' : 'text-brand-placeholder',
                    )}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm text-brand-dark leading-snug truncate">
                      {suggestion.display_name}
                    </p>
                    {!hasHouseNumber && (
                      <p className="font-sans text-xs text-brand-placeholder mt-0.5">
                        Aggiungi il numero civico
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Indicatore di caricamento suggerimenti */}
        {isLoading && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-border border-t-brand-primary" />
          </div>
        )}
      </div>

      {/* ── Avviso civico mancante ── */}
      {missingHouseNumber && (
        <p
          role="alert"
          className="mt-2 font-sans text-xs text-amber-600"
        >
          Devi selezionare un indirizzo comprensivo di numero civico.
        </p>
      )}

      {/* ── Avviso ricerca attiva senza selezione ── */}
      {query.length >= 3 && !isLoading && suggestions.length === 0 && !selected && !missingHouseNumber && (
        <p className="mt-2 font-sans text-xs text-brand-placeholder">
          Nessun risultato trovato. Prova a essere più specifico.
        </p>
      )}

      {/* ── Pulsante "Valuta" ── */}
      <button
        id="address-autocomplete-submit-btn"
        type="button"
        onClick={handleValutaClick}
        disabled={isValutaDisabled}
        className={clsx(
          'mt-4 w-full rounded-xl py-3.5 font-sans text-sm font-semibold',
          'transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
          isValutaDisabled
            ? 'cursor-not-allowed bg-brand-border text-brand-placeholder'
            : 'bg-brand-primary text-brand-field hover:bg-brand-dark',
        )}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-field/40 border-t-brand-field" />
            Ricerca in corso…
          </span>
        ) : (
          'Valuta'
        )}
      </button>
    </div>
  );
};

export default AddressAutocomplete;
