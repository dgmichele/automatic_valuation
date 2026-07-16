/**
 * StepFeatures — Step 2 del multi-step form.
 *
 * Componente puramente presentazionale: riceve tutto tramite props
 * (derivate da useStepFeatures nel parent che lo monta).
 *
 * Layout a 3 sezioni semantiche:
 *   1. Dimensioni e stato  → sqm, condition, rooms, bathrooms, floor
 *   2. Dettagli costruttivi → build_year, energy_class, heating
 *   3. Dotazioni            → elevator, balconies, terrace, box, garden, windows
 *
 * I campi non pertinenti alla tipologia corrente semplicemente non vengono
 * renderizzati (isVisible restituisce false).
 */
import React from 'react';
import {
  BsGrid3X3Gap,
  BsWrenchAdjustableCircle,
  BsDoorOpen,
  BsDroplet,
  BsLayers,
  BsCalendar4Event,
  BsLightningCharge,
  BsThermometerHalf,
  BsArrowDownUp,
  BsWind,
  BsSun,
  BsCarFront,
  BsTree,
  BsFront,
} from 'react-icons/bs';
import { RadioCardGroup } from '../fields/RadioCardGroup';
import { ToggleField } from '../fields/ToggleField';
import { SelectField } from '../fields/SelectField';
import { NumberField } from '../fields/NumberField';
import {
  CONDITION_OPTIONS,
  ROOMS_OPTIONS,
  BATHROOMS_OPTIONS,
  FLOOR_OPTIONS,
  ENERGY_CLASS_OPTIONS,
  getHeatingOptionsFor,
  BALCONIES_OPTIONS,
  WINDOWS_OPTIONS,
} from '../../../constants/fieldOptions';
import type { useStepFeatures } from '../../../hooks/useStepFeatures';
import type { ValuationPayload } from '../../../types/valuation';

// ── Tipo Props ─────────────────────────────────────────────────────────────────
// Usa il tipo di ritorno dell'hook per garantire la coerenza automatica
type StepFeaturesProps = ReturnType<typeof useStepFeatures> & {
  /** Setter tipizzato esposto dall'hook */
  setField: (key: keyof Pick<ValuationPayload,
    'sqm' | 'condition' | 'rooms' | 'bathrooms' | 'floor' |
    'build_year' | 'energy_class' | 'heating' | 'elevator' |
    'balconies' | 'terrace' | 'box' | 'garden' | 'windows'
  >, value: string | number | boolean | null | undefined) => void;
};

// ── Sub-componente: micro-header di sezione ───────────────────────────────────
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center gap-3 mt-12 mb-4">
    <span className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-placeholder whitespace-nowrap">
      {title}
    </span>
    <div className="flex-1 h-px bg-brand-border" aria-hidden="true" />
  </div>
);

// ── Componente principale ─────────────────────────────────────────────────────
export const StepFeatures: React.FC<StepFeaturesProps> = ({
  propertyType,
  sqm,
  condition,
  rooms,
  bathrooms,
  floor,
  buildYear,
  energyClass,
  heating,
  elevator,
  balconies,
  terrace,
  box,
  garden,
  windows,
  isVisible,
  setField,
}) => {
  // Opzioni riscaldamento filtrate per tipologia corrente
  const heatingOptions = propertyType ? getHeatingOptionsFor(propertyType) : [];

  return (
    <div className="w-full">
      {/* ── Intestazione step ─────────────────────────────────────────────── */}
      <div className="mb-6 text-center">
        <h2 className="font-serif font-black text-2xl text-brand-dark leading-tight">
          Raccontaci dell'immobile
        </h2>
        <p className="mt-2 mb-[-20px] font-sans text-sm text-brand-paragraph">
          Compila i campi per ottenere una stima accurata:
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SEZIONE 1 — Dimensioni e stato
      ══════════════════════════════════════════════════════════════════ */}
      <SectionHeader title="Dimensioni e stato" />

      {/* mq — sempre visibile */}
      <div className="mb-4">
        <NumberField
          id="sqm"
          label="Superficie:"
          icon={BsGrid3X3Gap}
          value={sqm}
          onChange={(v) => setField('sqm', v)}
          unit="mq"
          placeholder="es. 85"
          min={1}
          max={9999}
        />
      </div>


      {/* stato conservativo — sempre visibile */}
      <div className="mb-4">
        <SelectField
          id="condition"
          label="Stato conservativo:"
          icon={BsWrenchAdjustableCircle}
          options={CONDITION_OPTIONS}
          value={condition}
          onChange={(v) => setField('condition', v)}
          placeholder="Seleziona lo stato…"
        />
      </div>

      {/* locali — sempre visibile */}
      <div className="mb-4">
        <RadioCardGroup
          id="rooms"
          label="Locali:"
          icon={BsDoorOpen}
          options={ROOMS_OPTIONS}
          value={rooms}
          onChange={(v) => setField('rooms', v)}
          columns={7}
        />
      </div>

      {/* bagni — nascosto per Negozio */}
      {isVisible('bathrooms') && (
        <div className="mb-4">
          <RadioCardGroup
            id="bathrooms"
            label="Bagni:"
            icon={BsDroplet}
            options={BATHROOMS_OPTIONS}
            value={bathrooms}
            onChange={(v) => setField('bathrooms', v)}
            columns={4}
          />
        </div>
      )}

      {/* piano — nascosto per Villa, Casa ind., Casa semi-ind., Negozio */}
      {isVisible('floor') && (
        <div className="mb-4">
          <RadioCardGroup
            id="floor"
            label="Piano:"
            icon={BsLayers}
            options={FLOOR_OPTIONS}
            value={floor}
            onChange={(v) => setField('floor', v)}
            columns={5}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SEZIONE 2 — Dettagli costruttivi
      ══════════════════════════════════════════════════════════════════ */}
      <SectionHeader title="Dettagli costruttivi" />

      {/* anno di costruzione — sempre opzionale, sempre visibile */}
      <div className="mb-4">
        <NumberField
          id="build_year"
          label="Anno di costruzione:"
          icon={BsCalendar4Event}
          value={buildYear}
          onChange={(v) => setField('build_year', v ?? null)}
          placeholder="es. 1985"
          min={1800}
          max={new Date().getFullYear()}
          disclaimer="Se non lo sai, lascia pure vuoto."
        />
      </div>

      {/* classe energetica — sempre visibile */}
      <div className="mb-4">
        <SelectField
          id="energy_class"
          label="Classe energetica:"
          icon={BsLightningCharge}
          options={ENERGY_CLASS_OPTIONS}
          value={energyClass}
          onChange={(v) => setField('energy_class', v)}
          placeholder="Seleziona la classe…"
        />
      </div>

      {/* riscaldamento — sempre visibile (opzioni filtrate per tipologia) */}
      <div className="mb-4">
        <RadioCardGroup
          id="heating"
          label="Riscaldamento:"
          icon={BsThermometerHalf}
          options={heatingOptions}
          value={heating}
          onChange={(v) => setField('heating', v)}
          columns={heatingOptions.length as 2 | 3}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SEZIONE 3 — Dotazioni
      ══════════════════════════════════════════════════════════════════ */}
      <SectionHeader title="Dotazioni" />

      {/* ascensore — nascosto per Villa, Casa ind., Casa semi-ind., Negozio */}
      {isVisible('elevator') && (
        <div className="mb-4">
          <ToggleField
            id="elevator"
            label="Ascensore:"
            icon={BsArrowDownUp}
            value={elevator}
            onChange={(v) => setField('elevator', v)}
          />
        </div>
      )}


      {/* balcone — nascosto per Negozio */}
      {isVisible('balconies') && (
        <div className="mb-4">
          <RadioCardGroup
            id="balconies"
            label="Balcone:"
            icon={BsWind}
            options={BALCONIES_OPTIONS}
            value={balconies}
            onChange={(v) => setField('balconies', v)}
            columns={3}
          />
        </div>
      )}

      {/* terrazzo — nascosto per Ufficio e Negozio */}
      {isVisible('terrace') && (
        <div className="mb-4">
          <ToggleField
            id="terrace"
            label="Terrazzo:"
            icon={BsSun}
            value={terrace}
            onChange={(v) => setField('terrace', v)}
          />
        </div>
      )}

      {/* box — nascosto per Negozio */}
      {isVisible('box') && (
        <div className="mb-4">
          <ToggleField
            id="box"
            label="Box / Garage:"
            icon={BsCarFront}
            value={box}
            onChange={(v) => setField('box', v)}
          />
        </div>
      )}

      {/* giardino — nascosto per Ufficio e Negozio */}
      {isVisible('garden') && (
        <div className="mb-4">
          <ToggleField
            id="garden"
            label="Giardino:"
            icon={BsTree}
            value={garden}
            onChange={(v) => setField('garden', v)}
          />
        </div>
      )}

      {/* vetrine — SOLO per Negozio */}
      {isVisible('windows') && (
        <div className="mb-4">
          <RadioCardGroup
            id="windows"
            label="Vetrine:"
            icon={BsFront}
            options={WINDOWS_OPTIONS}
            value={windows}
            onChange={(v) => setField('windows', v)}
            columns={3}
          />
        </div>
      )}

      {/* Spaziatura inferiore per evitare che l'ultimo campo finisca sotto la StickyFormNav */}
      <div className="h-4" aria-hidden="true" />
    </div>
  );
};

