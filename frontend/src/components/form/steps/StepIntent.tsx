import React from 'react';
import {
  BsLightningCharge,
  BsClockHistory,
  BsHourglassSplit,
  BsSearch,
  BsBriefcase,
  BsCheckCircleFill,
} from 'react-icons/bs';
import { INTENT_OPTIONS } from '../../../constants/fieldOptions';

// ── Mappa icone per ciascun intent ────────────────────────────────────────────
const INTENT_ICONS: Record<string, React.ElementType> = {
  'Voglio vendere il mio immobile in questo momento': BsLightningCharge,
  'Voglio vendere il mio immobile nei prossimi mesi': BsClockHistory,
  'Voglio vendere il mio immobile entro 1 anno': BsHourglassSplit,
  'Voglio solo conoscere il valore del mio immobile': BsSearch,
  'Sono un addetto ai lavori del settore immobiliare': BsBriefcase,
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface StepIntentProps {
  /** Valore attualmente selezionato (null = nessuno) */
  selectedIntent: string | null;
  /** Callback per aggiornare la selezione */
  onSelect: (intent: string) => void;
}

// ── Componente ────────────────────────────────────────────────────────────────
export const StepIntent: React.FC<StepIntentProps> = ({
  selectedIntent,
  onSelect,
}) => {
  return (
    <div className="w-full">
      {/* Intestazione step */}
      <div className="mb-6 text-center">
        <h2 className="font-serif font-black text-2xl text-brand-dark leading-tight">
          Perché stai facendo questa valutazione?
        </h2>
        <p className="mt-2 font-sans text-sm text-brand-paragraph">
          Seleziona l'opzione che descrive meglio il tuo obiettivo attuale:
        </p>
      </div>

      {/* Lista delle card */}
      <div
        className="flex flex-col gap-3 max-w-xl mx-auto"
        role="radiogroup"
        aria-label="Motivo della valutazione"
      >
        {INTENT_OPTIONS.map(({ value, label }) => {
          const Icon = INTENT_ICONS[value] || BsSearch;
          const isSelected = selectedIntent === value;

          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={label}
              id={`intent-${value.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => onSelect(value)}
              className={[
                // Layout base e allineamento
                'flex items-center gap-4 p-4 md:p-5 rounded-2xl text-left border cursor-pointer select-none w-full',
                // Stato selezionato vs non selezionato
                isSelected
                  ? 'border-2 border-brand-border-focus bg-brand-popup-bg shadow-sm text-brand-dark'
                  : 'border-brand-border bg-brand-field text-brand-dark hover:border-brand-border-focus hover:shadow-sm',
              ].join(' ')}
            >
              {/* Contenitore Icona a sinistra */}
              <div
                className={[
                  'flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors duration-300',
                  isSelected ? 'bg-brand-border-focus/10 text-brand-border-focus' : 'bg-brand-border/40 text-brand-paragraph',
                ].join(' ')}
                aria-hidden="true"
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Contenuto testuale centrale */}
              <div className="flex-1 flex flex-col min-w-0">
                <span
                  className={[
                    'font-sans font-semibold text-sm md:text-base leading-tight transition-colors duration-300',
                    isSelected ? 'text-brand-border-focus' : 'text-brand-dark',
                  ].join(' ')}
                >
                  {label}
                </span>
              </div>

              {/* Indicatore radio/check a destra */}
              <div className="shrink-0 ml-2" aria-hidden="true">
                {isSelected ? (
                  <BsCheckCircleFill className="w-5 h-5 text-brand-border-focus transition-all duration-300 scale-100" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-brand-border bg-white transition-all duration-300 scale-90" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Spaziatura inferiore per evitare che l'ultimo campo finisca sotto la StickyFormNav */}
      <div className="h-6" aria-hidden="true" />
    </div>
  );
};
