/**
 * ToggleField — Componente riusabile per campi booleani (Sì / No).
 *
 * Usato in Step 2 per: elevator, terrace, box, garden.
 * Stile: due pill "Sì" / "No" affiancate, stessa palette brand degli altri componenti.
 *
 * Componente puramente presentazionale: zero accesso allo store.
 */
import React from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';

interface ToggleFieldProps {
  /** ID univoco per accessibilità */
  id: string;
  /** Label visibile sopra le pill */
  label: string;
  /** Icona associata alla label */
  icon?: React.ComponentType<{ className?: string }>;
  /** Valore corrente (null = non ancora selezionato) */
  value: boolean | null | undefined;
  /** Callback chiamata al click */
  onChange: (value: boolean) => void;
}

export const ToggleField: React.FC<ToggleFieldProps> = ({ id, label, icon: Icon, value, onChange }) => {
  const options: { label: string; boolValue: boolean }[] = [
    { label: 'Sì', boolValue: true },
    { label: 'No', boolValue: false },
  ];

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

      {/* Pill Sì / No */}
      <div
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        className="flex gap-2"
      >
        {options.map((option) => {
          const isSelected = value === option.boolValue;
          return (
            <button
              key={option.label}
              type="button"
              role="radio"
              aria-checked={isSelected}
              id={`${id}-${option.label.toLowerCase()}`}
              onClick={() => onChange(option.boolValue)}
              className={[
                // Layout
                'relative flex items-center justify-center gap-1.5',
                'min-h-[40px] h-auto w-20 rounded-xl px-4',
                'cursor-pointer select-none',
                'font-sans font-semibold text-sm',
                // Stato
                isSelected
                  ? 'border-2 border-brand-border-focus bg-brand-field text-brand-border-focus shadow-sm'
                  : 'border border-brand-border bg-brand-field text-brand-dark hover:border-brand-border-focus hover:text-brand-border-focus',
              ].join(' ')}
            >
              {isSelected && (
                <BsCheckCircleFill
                  className="w-3 h-3 text-brand-border-focus shrink-0"
                  aria-hidden="true"
                />
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
