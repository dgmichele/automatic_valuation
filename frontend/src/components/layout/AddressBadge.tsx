/**
 * AddressBadge.tsx
 *
 * Targhetta compatta che mostra l'indirizzo corrente selezionato/validato
 * durante il flusso multi-step form (Fase 3).
 *
 * Posizionata sotto la ProgressBar e sopra il corpo del form,
 * offre all'utente un accesso rapido alla modifica dell'indirizzo.
 *
 * Props:
 *  - onEdit: callback invocato al click del pulsante "Modifica",
 *            che aprirà il futuro EditAddressModal.
 */
import React from 'react';
import { FaMapMarkerAlt, FaPen } from 'react-icons/fa';
import { useValuationStore } from '../../store/useValuationStore';

interface AddressBadgeProps {
  /** Callback invocato quando l'utente clicca su "Modifica" */
  onEdit: () => void;
}

export const AddressBadge: React.FC<AddressBadgeProps> = ({ onEdit }) => {
  const address = useValuationStore((state) => state.address);

  // Non renderizzare nulla se l'indirizzo non è ancora disponibile nello store
  if (!address) return null;

  return (
    <div
      className="flex items-center justify-between w-full max-w-2xl mx-auto px-4 py-3 mb-6 md:mt-3 rounded-full border border-brand-border bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300"
      style={{ boxShadow: '0 2px 12px rgba(180, 28, 60, 0.06)' }}
      role="region"
      aria-label="Indirizzo selezionato"
    >
      {/* Sezione sinistra: icona + testo indirizzo */}
      <div className="flex items-center gap-2.5 overflow-hidden mr-2 min-w-0">
        <FaMapMarkerAlt
          className="text-brand-primary shrink-0 w-4 h-4"
          aria-hidden="true"
        />
        <span
          className="text-xs sm:text-sm font-medium text-brand-dark truncate leading-snug"
          title={address}
        >
          {address}
        </span>
      </div>

      {/* Sezione destra: pulsante Modifica */}
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center gap-1.5 px-3 py-1.5 shrink-0 rounded-full text-xs font-semibold tracking-wide cursor-pointer transition-all duration-200 text-brand-primary bg-brand-primary/10 hover:bg-brand-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-1"
        aria-label="Modifica indirizzo"
      >
        <FaPen className="w-3 h-3" aria-hidden="true" />
        <span>Modifica</span>
      </button>
    </div>
  );
};

export default AddressBadge;
