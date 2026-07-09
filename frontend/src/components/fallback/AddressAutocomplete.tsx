/**
 * AddressAutocomplete.tsx — Componente autocomplete indirizzo via Nominatim.
 *
 * Funzionalità:
 * - Visualizzazione Google-Style (Titolo della via in risalto, Sottotitolo con comune/provincia/cap)
 * - Selezionando un indirizzo sprovvisto di civico, mostra un campo aggiuntivo per inserirlo a mano
 * - Pulsante "Valuta" attivo solo quando l'indirizzo ha un civico valido (rilevato o digitato manualmente)
 * - Tutta la logica è delegata all'hook useAddressAutocomplete.
 */
import { MdSearch, MdLocationOn, MdClose } from 'react-icons/md';
import clsx from 'clsx';
import { type SelectedAddress } from '../../hooks/useNominatim';
import { useAddressAutocomplete } from '../../hooks/useAddressAutocomplete';

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
    handleSelect,
    manualHouseNumber,
    setManualHouseNumber,
    inputRef,
    listRef,
    isValutaDisabled,
    handleValutaClick,
    handleReset,
  } = useAddressAutocomplete({ onValidSelect, isSubmitting });

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
            placeholder="Es. Via Palestro, Ivrea"
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
              'border-brand-border',
            )}
          />

          {/* Pulsante clear — visibile solo se c'è testo */}
          {query.length > 0 && !isSubmitting && (
            <button
              type="button"
              onClick={handleReset}
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
            {suggestions.map((suggestion) => (
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
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm font-semibold text-brand-dark leading-snug truncate">
                    {suggestion.primaryText}
                  </p>
                  <p className="font-sans text-xs text-brand-placeholder mt-0.5 leading-normal truncate">
                    {suggestion.secondaryText}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Indicatore di caricamento suggerimenti */}
        {isLoading && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-border border-t-brand-primary" />
          </div>
        )}
      </div>

      {/* ── Campo civico aggiuntivo (mostrato solo se l'indirizzo selezionato non ha il civico) ── */}
      {selected && !selected.hasHouseNumber && (
        <div className="mt-4 transition duration-300 ease-out animate-fadeIn">
          <label
            htmlFor="manual-house-number-input"
            className="block font-sans text-xs font-semibold text-brand-paragraph mb-1.5"
          >
            Numero civico (obbligatorio)
          </label>
          <input
            id="manual-house-number-input"
            type="text"
            value={manualHouseNumber}
            onChange={(e) => setManualHouseNumber(e.target.value)}
            placeholder="Es. 20 o 20/A"
            disabled={isSubmitting}
            className={clsx(
              'w-full rounded-xl border bg-brand-field py-3 px-4',
              'font-sans text-sm text-brand-dark placeholder:text-brand-placeholder',
              'transition duration-300',
              'focus:border-brand-border-focus focus:outline-none focus:ring-2 focus:ring-brand-border-focus/30',
              'disabled:cursor-not-allowed disabled:opacity-60',
              'border-brand-border',
            )}
          />
        </div>
      )}

      {/* ── Avviso ricerca attiva senza selezione ── */}
      {query.length >= 3 &&
        !isLoading &&
        suggestions.length === 0 &&
        !selected && (
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
          'transition duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
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
