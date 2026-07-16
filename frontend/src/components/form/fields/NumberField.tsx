/**
 * NumberField — Componente riusabile per input numerici.
 *
 * Usato in Step 2 per: sqm (mq), build_year (anno di costruzione).
 * Supporta un testo disclaimer opzionale sotto il campo
 * (usato per build_year: "Non è un problema se non lo sai").
 *
 * Componente puramente presentazionale: zero accesso allo store.
 */
import React from 'react';

interface NumberFieldProps {
  /** ID univoco per il campo */
  id: string;
  /** Label visibile sopra l'input */
  label: string;
  /** Icona associata alla label */
  icon?: React.ComponentType<{ className?: string }>;
  /** Valore corrente (undefined/null = campo vuoto) */
  value: number | null | undefined;
  /** Callback al cambio di valore (undefined = campo svuotato) */
  onChange: (value: number | undefined) => void;
  /** Testo disclaimer mostrato sotto il campo (opzionale) */
  disclaimer?: string;
  /** Valore minimo accettato */
  min?: number;
  /** Valore massimo accettato */
  max?: number;
  /** Placeholder testuale */
  placeholder?: string;
  /** Unità di misura mostrata a destra dell'input (es. "mq") */
  unit?: string;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  disclaimer,
  min,
  max,
  placeholder = 'Inserisci un numero',
  unit,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '' || raw === null) {
      onChange(undefined);
    } else {
      const parsed = Number(raw);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

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

      {/* Input con unità opzionale */}
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={value ?? ''}
          onChange={handleChange}
          min={min}
          max={max}
          placeholder={placeholder}
          className={[
            'w-full',
            'bg-brand-field',
            'font-sans text-sm text-brand-dark',
            'h-10 rounded-xl',
            // Padding destro più largo se c'è l'unità
            unit ? 'px-3 pr-14' : 'px-3',
            // Bordo brand
            'border border-brand-border',
            'focus:outline-none focus:border-2 focus:border-brand-border-focus',
            'placeholder:text-brand-placeholder',
            // Nasconde frecce native del browser
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          ].join(' ')}
        />

        {/* Unità di misura a destra */}
        {unit && (
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-sans text-sm text-brand-placeholder"
            aria-hidden="true"
          >
            {unit}
          </span>
        )}
      </div>

      {/* Disclaimer — stile "note" leggero, colore brand-placeholder */}
      {disclaimer && (
        <p className="mt-1.5 font-sans text-xs text-brand-placeholder leading-snug">
          {disclaimer}
        </p>
      )}
    </div>
  );
};
