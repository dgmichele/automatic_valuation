/**
 * EditAddressModal.tsx — Modal per la modifica dell'indirizzo nel multi-step form.
 *
 * Utilizza Headless UI Dialog per un'interfaccia accessibile e fluida.
 * Tutta la logica di geocoding, lookup e stato è delegata all'hook useEditAddress.
 */
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { MdClose, MdSearch, MdLocationOn } from 'react-icons/md';
import { FaMapMarkerAlt } from 'react-icons/fa';
import clsx from 'clsx';
import { useEditAddress } from '../../hooks/useEditAddress';

interface EditAddressModalProps {
  /** Stato di apertura del modal */
  isOpen: boolean;
  /** Callback per chiudere il modal */
  onClose: () => void;
}

export const EditAddressModal = ({ isOpen, onClose }: EditAddressModalProps) => {
  const {
    currentAddress,
    query,
    setQuery,
    suggestions,
    selected,
    isSearching,
    resetNominatim,
    handleSelect,
    manualHouseNumber,
    setManualHouseNumber,
    isSaving,
    error,
    isSaveDisabled,
    handleSave,
    inputRef,
    listRef,
  } = useEditAddress({ isOpen, onClose });

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Overlay scuro con effetto blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 data-closed:opacity-0"
        aria-hidden="true"
      />

      {/* Container per centrare il modal */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className={clsx(
            'w-full max-w-lg transform overflow-hidden rounded-2xl bg-brand-popup-bg p-6 text-left align-middle shadow-xl border border-brand-border',
            'duration-300 ease-out data-closed:scale-95 data-closed:opacity-0',
          )}
        >
          {/* Header del Modal */}
          <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-4">
            <DialogTitle
              as="h3"
              className="text-lg font-serif font-black text-brand-dark"
            >
              Modifica Indirizzo
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              className="text-brand-placeholder hover:text-brand-primary transition-colors cursor-pointer duration-200 focus:outline-none"
              aria-label="Chiudi modal"
            >
              <MdClose className="h-6 w-6" />
            </button>
          </div>

          {/* Visualizzazione dell'indirizzo corrente */}
          {currentAddress && (
            <div className="mb-4 p-3 bg-brand-primary/5 border border-brand-border/40 rounded-xl flex items-start gap-2.5">
              <FaMapMarkerAlt
                className="text-brand-primary shrink-0 w-4 h-4 mt-0.5"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-brand-paragraph block mb-0.5 uppercase tracking-wider">
                  Indirizzo attuale:
                </span>
                <span className="text-sm font-medium text-brand-dark wrap-break-word">
                  {currentAddress}
                </span>
              </div>
            </div>
          )}

          {/* Input per cercare il nuovo indirizzo */}
          <div className="space-y-4">
            <div className="relative">
              <label
                htmlFor="new-address-input"
                className="block font-sans text-xs font-semibold text-brand-paragraph mb-1.5"
              >
                Cerca il nuovo indirizzo
              </label>
              <div className="relative flex items-center">
                <MdSearch
                  className="pointer-events-none absolute left-4 h-5 w-5 text-brand-placeholder"
                  aria-hidden="true"
                />
                <input
                  ref={inputRef}
                  id="new-address-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Es. Via Palestro, Ivrea"
                  autoComplete="off"
                  disabled={isSaving}
                  aria-autocomplete="list"
                  aria-controls="modal-suggestions-list"
                  aria-expanded={suggestions.length > 0}
                  className={clsx(
                    'w-full rounded-xl border bg-brand-field py-3 pl-11 pr-10',
                    'font-sans text-sm text-brand-dark placeholder:text-brand-placeholder',
                    'transition duration-300',
                    'focus:border-brand-border-focus focus:outline-none focus:ring-2 focus:ring-brand-border-focus/30',
                    'disabled:cursor-not-allowed disabled:opacity-60 border-brand-border',
                  )}
                />

                {/* Pulsante per ripulire l'input */}
                {query.length > 0 && !isSaving && (
                  <button
                    type="button"
                    onClick={resetNominatim}
                    aria-label="Pulisci ricerca"
                    className="absolute right-3 p-1 text-brand-placeholder hover:text-brand-dark transition-colors duration-200"
                  >
                    <MdClose className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Indicatore di caricamento della ricerca */}
              {isSearching && (
                <div className="absolute right-10 top-[38px] -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-border border-t-brand-primary" />
                </div>
              )}

              {/* Dropdown dei suggerimenti Nominatim */}
              {suggestions.length > 0 && (
                <ul
                  ref={listRef}
                  id="modal-suggestions-list"
                  role="listbox"
                  className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-brand-border bg-brand-field shadow-lg"
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
            </div>

            {/* Input per numero civico se mancante */}
            {selected && !selected.hasHouseNumber && (
              <div className="transition duration-300 ease-out animate-fadeIn">
                <label
                  htmlFor="modal-manual-house-number"
                  className="block font-sans text-xs font-semibold text-brand-paragraph mb-1.5"
                >
                  Numero civico (obbligatorio)
                </label>
                <input
                  id="modal-manual-house-number"
                  type="text"
                  value={manualHouseNumber}
                  onChange={(e) => setManualHouseNumber(e.target.value)}
                  placeholder="Es. 20 o 20/A"
                  disabled={isSaving}
                  className={clsx(
                    'w-full rounded-xl border bg-brand-field py-2.5 px-4',
                    'font-sans text-sm text-brand-dark placeholder:text-brand-placeholder',
                    'transition duration-300',
                    'focus:border-brand-border-focus focus:outline-none focus:ring-2 focus:ring-brand-border-focus/30',
                    'disabled:cursor-not-allowed disabled:opacity-60 border-brand-border',
                  )}
                />
              </div>
            )}

            {/* Visualizzazione dell'errore (fuori area, fallimento) */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium animate-fadeIn">
                {error}
              </div>
            )}
          </div>

          {/* Pulsanti di Azione */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-brand-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className={clsx(
                'px-4 py-2 rounded-xl font-sans text-sm font-semibold transition-all duration-300 cursor-pointer',
                'bg-transparent text-brand-primary hover:text-brand-dark focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              Annulla
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaveDisabled}
              className={clsx(
                'px-5 py-2.5 rounded-xl font-sans text-sm font-semibold transition-all duration-300 flex items-center gap-2 focus:outline-none',
                isSaveDisabled
                  ? 'bg-brand-border text-brand-placeholder cursor-not-allowed'
                  : 'bg-brand-primary text-brand-field hover:bg-brand-dark cursor-pointer',
              )}
            >
              {isSaving && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-field/40 border-t-brand-field" />
              )}
              {isSaving ? 'Verifica in corso…' : 'Salva'}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default EditAddressModal;
