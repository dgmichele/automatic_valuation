/**
 * ProgressBar.tsx
 * 
 * Barra di progresso dinamica per il multi-step form (Fase 3).
 * Visualizza i 3 step principali, indica lo stato (completato, attivo, futuro)
 * e applica un leggero effetto neon/glow color brand sulla linea e sul nodo attivo.
 */
import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { useValuationStore } from '../../store/useValuationStore';

// Definizione degli step del form
const steps = [
  { id: 1, label: 'Tipologia', description: 'Tipo immobile' },
  { id: 2, label: 'Caratteristiche', description: 'Dettagli e interni' },
  { id: 3, label: 'Scopo', description: 'Dati di invio' },
];

export const ProgressBar: React.FC = () => {
  const currentStep = useValuationStore((state) => state.currentStep);

  // Calcola la percentuale di riempimento della barra
  // Step 1 -> 0%
  // Step 2 -> 50%
  // Step 3 -> 100%
  const fillPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6" aria-label="Avanzamento modulo">
      {/* Contenitore barra e nodi */}
      <div className="relative flex items-center justify-between">
        
        {/* Linea di sfondo (grigia) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[3px] bg-brand-border/40 rounded-full -z-10" />

        {/* Linea attiva (brand primary) con effetto Neon Glow e transizione smooth */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-brand-primary rounded-full transition-all duration-500 ease-in-out -z-10"
          style={{
            width: `${fillPercentage}%`,
            boxShadow: '0 0 10px rgba(180, 28, 60, 0.7), 0 0 4px rgba(180, 28, 60, 0.4)',
          }}
        />

        {/* Nodi degli step */}
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div key={step.id} className="relative flex flex-col items-center">
              {/* Bottone/Indicatore del nodo */}
              <div
                className={`
                  relative z-10 flex items-center justify-center w-10 h-10 rounded-full font-sans text-sm font-bold
                  transition-all duration-500 ease-in-out border-2
                  ${
                    isCompleted
                      ? 'bg-brand-primary border-brand-primary text-white'
                      : isActive
                      ? 'bg-brand-field border-brand-primary text-brand-primary'
                      : 'bg-white border-brand-border text-brand-placeholder'
                  }
                `}
                style={
                  isActive
                    ? {
                        boxShadow: '0 0 12px rgba(180, 28, 60, 0.6)',
                      }
                    : undefined
                }
              >
                {/* Effetto pulsante neon aggiuntivo solo per lo step attivo — solo bordo esterno rallentato a 3s */}
                {isActive && (
                  <span 
                    className="absolute inset-[-2px] rounded-full animate-ping border-2 border-brand-primary/40 bg-transparent -z-10" 
                    style={{ animationDuration: '4s' }}
                  />
                )}

                {/* Contenuto del nodo: checkmark per completati, numero per gli altri */}
                {isCompleted ? (
                  <FaCheck className="w-4 h-4 text-white" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>

              {/* Etichetta testuale */}
              <div className="absolute mt-12 flex flex-col items-center text-center w-32">
                <span
                  className={`
                    text-xs sm:text-sm font-semibold tracking-wide transition-colors duration-300 mt-1
                    ${
                      isActive
                        ? 'text-brand-primary font-bold'
                        : isCompleted
                        ? 'text-brand-dark'
                        : 'text-brand-placeholder'
                    }
                  `}
                >
                  {step.label}
                </span>
                
                {/* Descrizione aggiuntiva visibile solo su schermi non estremamente compatti */}
                <span
                  className={`
                    hidden sm:inline text-[10px] tracking-normal transition-colors duration-300
                    ${isActive ? 'text-brand-primary/80' : 'text-brand-placeholder'}
                  `}
                >
                  {step.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Spazio inferiore di sicurezza per le etichette absolute posizionate sotto la barra */}
      <div className="h-10" aria-hidden="true" />
    </div>
  );
};
export default ProgressBar;
