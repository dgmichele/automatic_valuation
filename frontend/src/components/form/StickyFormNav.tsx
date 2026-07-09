import React from 'react';
import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';

interface StickyFormNavProps {
  /** Callback chiamata al click su Avanti / Invia */
  onNext: () => void;
  /** Callback chiamata al click su Indietro */
  onBack: () => void;
  /** Flag per nascondere il pulsante Indietro (es. al primo step) */
  showBack?: boolean;
  /** Disabilita il pulsante Avanti/Invia se lo step corrente non è valido */
  isNextDisabled?: boolean;
  /** Identifica se siamo all'ultimo step per mostrare "Calcola Valutazione" */
  isLastStep?: boolean;
  /** Mostra lo stato di caricamento/invio sul pulsante principale */
  isLoading?: boolean;
}

/**
 * StickyFormNav — Barra di navigazione inferiore sticky (Avanti/Indietro).
 * Implementa la logica di visualizzazione con layout responsive e
 * stile premium (vetromorfismo, bordi sfumati e ombre morbide).
 */
export const StickyFormNav: React.FC<StickyFormNavProps> = ({
  onNext,
  onBack,
  showBack = true,
  isNextDisabled = false,
  isLastStep = false,
  isLoading = false,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-brand-field/85 backdrop-blur-md border-t border-brand-border/60 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] py-4 transition-all duration-300">
      <div className="max-w-2xl mx-auto px-6 w-full flex items-center justify-between gap-4">
        {/* Pulsante Indietro */}
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center gap-2 text-brand-paragraph hover:text-brand-primary font-sans text-sm font-semibold bg-white/50 hover:bg-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Indietro</span>
          </button>
        ) : (
          // Spacer per spingere il pulsante "Avanti" a destra quando "Indietro" è nascosto
          <div className="w-0" />
        )}

        {/* Pulsante Avanti / Calcola Valutazione */}
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled || isLoading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-dark text-white font-sans text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              {/* Spinner animato */}
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Elaborazione...</span>
            </>
          ) : isLastStep ? (
            <>
              <span>Valuta</span>
              <FiCheck className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Avanti</span>
              <FiArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
