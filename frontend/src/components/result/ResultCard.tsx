import React from 'react';
import { FaLock, FaCheckCircle, FaMapMarkerAlt, FaUnlock } from 'react-icons/fa';
import { useValuationStore } from '../../store/useValuationStore';

interface ResultCardProps {
  onUnlockClick: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ onUnlockClick }) => {
  const address = useValuationStore((s) => s.address);
  const property_type = useValuationStore((s) => s.property_type);
  const sqm = useValuationStore((s) => s.sqm);

  return (
    <div className="w-full max-w-xl mx-auto bg-brand-field border border-brand-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
      {/* Intestazione */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-popup-bg text-brand-primary mb-1">
          <FaCheckCircle className="text-2xl" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-brand-dark">
          La tua valutazione è pronta!
        </h2>
        {address && (
          <p className="font-sans text-sm text-brand-paragraph flex items-center justify-center gap-1.5">
            <FaMapMarkerAlt className="text-brand-primary shrink-0" />
            <span className="truncate max-w-md">{address}</span>
          </p>
        )}
      </div>

      {/* Card Criptata con CTA */}
      <div className="bg-linear-to-br from-brand-popup-bg to-white border border-brand-border rounded-xl p-6 sm:p-8 text-center space-y-6 shadow-inner relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-semibold tracking-wide uppercase">
          <FaLock className="text-xs" />
          <span>Stima Valore Riservata</span>
        </div>

        {/* Valore Oscurato */}
        <div className="py-2 space-y-3">
          <div className="select-none font-serif text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-widest blur-[6px] opacity-75">
            € ••••••
          </div>
          <div className="mt-6 text-xs sm:text-sm text-brand-paragraph font-sans font-medium">
            Valore stimato per {property_type || 'Immobile'} {sqm ? `di ${sqm} mq` : ''}
          </div>
        </div>

        {/* Pulsante Sblocca */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onUnlockClick}
            className="w-full py-4 px-6 bg-brand-primary text-brand-field font-sans font-bold text-base sm:text-lg rounded-xl hover:bg-brand-dark transition duration-300 shadow-md flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
          >
            <FaUnlock className="text-base" />
            <span>Sblocca la mia valutazione</span>
          </button>
          <p className="text-[11px] text-brand-paragraph font-sans mt-2.5">
            Riceverai immediatamente la stima del valore del tuo immobile via email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
