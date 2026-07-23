/**
 * fieldOptions.ts — Opzioni statiche per i campi del form Step 2 e Step 3.
 *
 * Ogni array contiene oggetti { value, label } dove:
 *   - value  → stringa esatta inviata al backend (allineata a ValuationPayload)
 *   - label  → testo mostrato all'utente in italiano
 *
 * Le funzioni con suffisso "For" applicano un filtro per tipologia
 * (es. riscaldamento senza "Centralizzato" per ville/case indipendenti).
 */
import type { ValuationPayload } from '../types/valuation';

export type PropertyType = ValuationPayload['property_type'];

// ── Stato conservativo ────────────────────────────────────────────────────────
export const CONDITION_OPTIONS: { value: ValuationPayload['condition']; label: string }[] = [
  { value: 'Nuova costruzione', label: 'Nuova costruzione' },
  { value: 'Ristrutturato', label: 'Ristrutturato' },
  { value: 'In buono stato', label: 'In buono stato' },
  { value: 'Non ristrutturato', label: 'Non ristrutturato' },
];

// ── Locali (rooms) ────────────────────────────────────────────────────────────
export const ROOMS_OPTIONS: { value: string; label: string }[] = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '6+', label: '6+' },
];

// ── Bagni (bathrooms) ─────────────────────────────────────────────────────────
export const BATHROOMS_OPTIONS: { value: NonNullable<ValuationPayload['bathrooms']>; label: string }[] = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '3+', label: '3+' },
];

// ── Piano (floor) ─────────────────────────────────────────────────────────────
export const FLOOR_OPTIONS: { value: string; label: string }[] = [
  { value: 'Terra', label: 'Terra' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9+', label: '9+' },
];

// ── Classe energetica (energy_class) ──────────────────────────────────────────
export const ENERGY_CLASS_OPTIONS: { value: string; label: string }[] = [
  { value: 'A4', label: 'A4' },
  { value: 'A3', label: 'A3' },
  { value: 'A2', label: 'A2' },
  { value: 'A1', label: 'A1' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
  { value: 'E', label: 'E' },
  { value: 'F', label: 'F' },
  { value: 'G', label: 'G' },
  { value: 'Non saprei', label: 'Non saprei' },
];

// ── Riscaldamento (heating) ───────────────────────────────────────────────────
/** Tutte le opzioni — per Appartamento, Ufficio, Negozio */
export const HEATING_OPTIONS_ALL: { value: ValuationPayload['heating']; label: string }[] = [
  { value: 'Autonomo', label: 'Autonomo' },
  { value: 'Centralizzato', label: 'Centralizzato' },
  { value: 'Assente', label: 'Assente' },
];

/** Senza "Centralizzato" — per Villa, Casa indipendente, Casa semi-indipendente */
export const HEATING_OPTIONS_NO_CENTRAL: { value: ValuationPayload['heating']; label: string }[] = [
  { value: 'Autonomo', label: 'Autonomo' },
  { value: 'Assente', label: 'Assente' },
];

/**
 * Restituisce le opzioni di riscaldamento filtrate per tipologia.
 * Per Villa/Casa ind./Casa semi-ind. esclude "Centralizzato"
 * (non applicabile — edifici senza impianto condominiale).
 */
export const getHeatingOptionsFor = (
  propertyType: PropertyType,
): { value: ValuationPayload['heating']; label: string }[] => {
  const noCentralTypes: PropertyType[] = ['Villa', 'Casa indipendente', 'Casa semi-indipendente'];
  return noCentralTypes.includes(propertyType) ? HEATING_OPTIONS_NO_CENTRAL : HEATING_OPTIONS_ALL;
};

// ── Balcone (balconies) ───────────────────────────────────────────────────────
export const BALCONIES_OPTIONS: { value: NonNullable<ValuationPayload['balconies']>; label: string }[] = [
  { value: 'No', label: 'No' },
  { value: '1', label: '1' },
  { value: '2+', label: '2+' },
];

// ── Vetrine (windows — solo Negozio) ─────────────────────────────────────────
export const WINDOWS_OPTIONS: { value: NonNullable<ValuationPayload['windows']>; label: string }[] = [
  { value: 'No', label: 'No' },
  { value: '1', label: '1' },
  { value: '2+', label: '2+' },
];

// ── Scopo valutazione (intent) — Step 3 ─────────────────────────────────────
export const INTENT_OPTIONS: { value: string; label: string }[] = [
  {
    value: `Voglio vendere l'immobile in questo momento`,
    label: `Voglio vendere l'immobile in questo momento`,
  },
  {
    value: `Voglio vendere l'immobile nei prossimi mesi`,
    label: `Voglio vendere l'immobile nei prossimi mesi`,
  },
  {
    value: `Voglio vendere l'immobile entro 1 anno`,
    label: `Voglio vendere l'immobile entro 1 anno`,
  },
  {
    value: `Voglio solo conoscere il valore del mio immobile`,
    label: `Voglio solo conoscere il valore del mio immobile`,
  },
  {
    value: `Sono un addetto ai lavori del settore immobiliare`,
    label: `Sono un addetto ai lavori del settore immobiliare`,
  },
];
