/**
 * RadioCardGroup — Componente riusabile per selezione singola a card compatte.
 *
 * Usato in Step 2 per: rooms, bathrooms, floor, balconies, windows.
 * Stile coerente con StepPropertyType (stesso DNA visivo), ma senza icona:
 * card più compatte, orientate a pill/grid orizzontale.
 *
 * Il componente è puramente presentazionale: zero accesso allo store.
 */

import type { ComponentType } from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';

export interface RadioOption<T extends string = string> {
  value: T;
  label: string;
}

interface RadioCardGroupProps<T extends string = string> {
  /** ID univoco per accessibilità (aria-labelledby) */
  id: string;
  /** Label visibile sopra il gruppo */
  label: string;
  /** Icona associata alla label */
  icon?: ComponentType<{ className?: string }>;
  /** Opzioni disponibili */
  options: RadioOption<T>[];
  /** Valore attualmente selezionato (null = nessuno) */
  value: T | null | undefined;
  /** Callback chiamata al click su un'opzione */
  onChange: (value: T) => void;
  /** Disposizione delle card: automatica per n° opzioni */
  columns?: 2 | 3 | 4 | 5 | 6 | 7 | 10;
  /** Forza una larghezza fissa per ogni bottone se attivo */
  isFixedWidth?: boolean;
}

export function RadioCardGroup<T extends string = string>({
  id,
  label,
  icon: Icon,
  options,
  value,
  onChange,
  columns,
  isFixedWidth = false,
}: RadioCardGroupProps<T>) {
  // Colonne di default basate sul numero di opzioni
  const cols = columns ?? (options.length <= 4 ? options.length : options.length <= 6 ? 3 : 4);

  const gridClass: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-5',
    6: 'grid-cols-3 sm:grid-cols-6',
    7: 'grid-cols-4 sm:grid-cols-7',
    10: 'grid-cols-5 sm:grid-cols-10',
  };

  return (
    <div className="w-full">
      {/* Label campo */}
      <label
        id={`${id}-label`}
        className="flex items-center gap-1.5 font-sans font-semibold text-sm text-brand-dark mb-2"
      >
        {Icon && <Icon className="w-[18px] h-[18px] text-brand-dark shrink-0" />}
        <span>{label}</span>
      </label>

      {/* Griglia card o flex wrapper a larghezza fissa */}
      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        className={
          isFixedWidth
            ? 'flex flex-wrap gap-2'
            : `grid ${gridClass[cols] ?? 'grid-cols-4'} gap-2`
        }
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={option.label}
              id={`${id}-${option.value.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => onChange(option.value as T)}
              className={[
                // Layout base
                'relative flex items-center justify-center',
                'min-h-[40px] h-auto rounded-xl px-2 py-2',
                'cursor-pointer select-none',
                'font-sans font-semibold text-sm text-center leading-tight',
                isFixedWidth ? 'w-20 shrink-0' : '',
                // Stato selezionato vs non selezionato
                isSelected
                  ? 'border-2 border-brand-border-focus bg-brand-field text-brand-border-focus shadow-sm'
                  : 'border border-brand-border bg-brand-field text-brand-dark hover:border-brand-border-focus hover:text-brand-border-focus',
              ].join(' ')}
            >
              {/* Checkmark mini — visibile solo se selezionato */}
              {isSelected && (
                <span
                  className="absolute top-1 right-1 opacity-100 scale-100 transition-all duration-300"
                  aria-hidden="true"
                >
                  <BsCheckCircleFill className="w-2.5 h-2.5 text-brand-border-focus" />
                </span>
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
