/**
 * StepPropertyType — Step 1 del multi-step form.
 *
 * Componente puramente presentazionale: riceve tutto tramite props
 * (derivate da useStepPropertyType nel parent che lo monta).
 *
 * Layout:
 *   - Desktop/Tablet (md+): grid 3 colonne → 2 righe × 3 card
 *   - Mobile:               grid 2 colonne → 3 righe × 2 card
 *
 * Stile:
 *   - Card non selezionata: bordo brand-border, icona/testo brand-paragraph
 *   - Card selezionata:     bordo brand-border-focus (2px), icona/testo brand-primary,
 *                           bg brand-popup-bg, checkmark in alto a destra
 *   - Hover:               bordo brand-border-focus, leggera ombra
 *   - Transizioni:         duration-300 ease su tutti gli stati
 */
import React from 'react';
import {
  BsHouse,
  BsHouseHeart,
  BsHouses,
  BsBuildingGear ,
  BsShop ,
  BsBuilding,
  BsCheckCircleFill,
} from 'react-icons/bs';
import type { PropertyType } from '../../../hooks/useStepPropertyType';
import { PROPERTY_TYPE_OPTIONS } from '../../../hooks/useStepPropertyType';

// ── Mappa icone per tipologia ─────────────────────────────────────────────────
const PROPERTY_ICONS: Record<PropertyType, React.ElementType> = {
  Appartamento: BsBuilding,
  Villa: BsHouseHeart,
  'Casa indipendente': BsHouse,
  'Casa semi-indipendente': BsHouses,
  Ufficio: BsBuildingGear,
  Negozio: BsShop,
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface StepPropertyTypeProps {
  /** Tipologia attualmente selezionata (null = nessuna) */
  selectedType: PropertyType | null;
  /** Callback per aggiornare la selezione */
  onSelect: (type: PropertyType) => void;
}

// ── Componente ────────────────────────────────────────────────────────────────
export const StepPropertyType: React.FC<StepPropertyTypeProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <div className="w-full">
      {/* Intestazione step */}
      <div className="mb-6 text-center">
        <h2 className="font-serif font-black text-2xl text-brand-dark leading-tight">
          Cosa vuoi valutare?
        </h2>
        <p className="mt-2 font-sans text-sm text-brand-paragraph">
          Seleziona la tipologia più affine al tuo immobile:
        </p>
      </div>

      {/* Griglia card */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
        role="radiogroup"
        aria-label="Tipologia immobile"
      >
        {PROPERTY_TYPE_OPTIONS.map(({ value, label }) => {
          const Icon = PROPERTY_ICONS[value];
          const isSelected = selectedType === value;

          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={label}
              id={`property-type-${value.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => onSelect(value)}
              className={[
                // Base layout
                'relative flex flex-col items-center justify-center gap-3',
                'h-full rounded-2xl p-5 md:p-6',
                'cursor-pointer select-none',
                // Bordo e ombra
                isSelected
                  ? 'border-3 border-brand-border-focus shadow-md bg-brand-field'
                  : 'border border-brand-border bg-brand-field hover:border-brand-border-focus hover:shadow-sm',
              ].join(' ')}
            >
              {/* Checkmark selezione — in alto a destra */}
              <span
                className={[
                  'absolute top-2.5 right-2.5 flex items-center justify-center',
                  'w-5 h-5 rounded-full',
                  'transition-all duration-300 ease',
                  isSelected
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-75',
                ].join(' ')}
                aria-hidden="true"
              >
                <BsCheckCircleFill className="w-5 h-5 text-brand-border-focus" />
              </span>

              {/* Icona */}
              <Icon
                className={[
                  'w-10 h-10 md:w-12 md:h-12 transition-colors duration-300',
                  isSelected ? 'text-brand-border-focus' : 'text-brand-paragraph',
                ].join(' ')}
                aria-hidden="true"
              />

              {/* Label — altezza riservata per 2 righe, così tutte le card restano allineate */}
              <span
                className={[
                  'flex items-center justify-center',
                  'min-h-10 md:min-h-11',
                  'font-sans font-semibold text-sm md:text-base text-center leading-tight',
                  'transition-colors duration-300',
                  isSelected ? 'text-brand-border-focus' : 'text-brand-dark',
                ].join(' ')}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};