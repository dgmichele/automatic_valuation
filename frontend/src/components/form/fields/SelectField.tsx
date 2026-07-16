/**
 * SelectField — Componente riusabile per dropdown stilizzati.
 *
 * Usato in Step 2 per: condition, energy_class, heating.
 * Stile: bordo brand-border, focus brand-border-focus, bg brand-field,
 * freccia custom SVG per coerenza cross-browser.
 *
 * Componente puramente presentazionale: zero accesso allo store.
 */


import type { ComponentType } from 'react';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface SelectFieldProps<T extends string = string> {
  /** ID univoco per il campo (usato anche per htmlFor della label) */
  id: string;
  /** Label visibile sopra il select */
  label: string;
  /** Icona associata alla label */
  icon?: ComponentType<{ className?: string }>;
  /** Opzioni disponibili */
  options: SelectOption<T>[];
  /** Valore attualmente selezionato (stringa vuota = nessuno) */
  value: T | null | undefined;
  /** Callback al cambio di valore */
  onChange: (value: T) => void;
  /** Testo del placeholder (opzione disabilitata di default) */
  placeholder?: string;
}

export function SelectField<T extends string = string>({
  id,
  label,
  icon: Icon,
  options,
  value,
  onChange,
  placeholder = 'Seleziona…',
}: SelectFieldProps<T>) {
  return (
    <div className="w-full">
      {/* Label */}
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 font-sans font-semibold text-sm text-brand-dark mb-2"
      >
        {Icon && <Icon className="w-[18px] h-[18px] text-brand-dark shrink-0" />}
        <span>{label}</span>
      </label>

      {/* Select wrapper (per freccia custom) */}
      <div className="relative">
        <select
          id={id}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value as T)}
          className={[
            'w-full appearance-none',
            'bg-brand-field',
            'font-sans text-sm',
            'h-10 px-3 pr-8 rounded-xl',
            // Bordo brand: default → brand-border, focus → brand-border-focus
            'border border-brand-border',
            'focus:outline-none focus:border-2 focus:border-brand-border-focus',
            // Colore testo: placeholder grigio, valore selezionato scuro
            value ? 'text-brand-dark' : 'text-brand-placeholder',
            'cursor-pointer',
          ].join(' ')}
        >
          {/* Opzione placeholder disabilitata */}
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-brand-dark">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Freccia custom SVG — sovrapposta in posizione assoluta */}
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-paragraph"
          aria-hidden="true"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
