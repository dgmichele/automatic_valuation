/**
 * fieldVisibility.ts — Mappa visibilità dei campi Step 2 per tipologia immobile.
 *
 * Definisce quali campi del form devono essere renderizzati (e quindi required
 * nella validazione Zod) per ogni tipologia selezionata nello Step 1.
 *
 * Fonte di verità: §6 di ISTRUZIONI_FRONTEND.md e logica del backend
 * (valuation.service.ts e valuation.controller.ts).
 *
 * Regole chiave:
 *   - floor, elevator          → null per Villa / Casa ind. / Casa semi-ind. / Negozio
 *   - bathrooms                → null per Negozio
 *   - terrace, garden          → null per Ufficio e Negozio
 *   - windows                  → visibile SOLO per Negozio
 *   - heating "Centralizzato"  → escluso per Villa / Casa ind. / Casa semi-ind.
 *                                 (gestito in fieldOptions.ts, non qui)
 */
import type { ValuationPayload } from '../types/valuation';

export type PropertyType = ValuationPayload['property_type'];

/** Unione di tutti i campi dello Step 2 (esclude geo e lead) */
export type Step2Field =
  | 'sqm'
  | 'condition'
  | 'rooms'
  | 'bathrooms'
  | 'floor'
  | 'build_year'
  | 'energy_class'
  | 'heating'
  | 'elevator'
  | 'balconies'
  | 'terrace'
  | 'box'
  | 'garden'
  | 'windows';

/** Tutti i campi dello Step 2, usati come base comune */
const ALL_STEP2_FIELDS: Step2Field[] = [
  'sqm',
  'condition',
  'rooms',
  'bathrooms',
  'floor',
  'build_year',
  'energy_class',
  'heating',
  'elevator',
  'balconies',
  'terrace',
  'box',
  'garden',
  'windows',
];

/**
 * Mappa tipologia → Set dei campi visibili (e required) nello Step 2.
 * I campi NON presenti nel Set devono essere forzati a null prima del submit.
 */
export const FIELD_VISIBILITY: Record<PropertyType, Set<Step2Field>> = {
  Appartamento: new Set([
    'sqm', 'condition', 'rooms', 'bathrooms', 'floor',
    'build_year', 'energy_class', 'heating',
    'elevator', 'balconies', 'terrace', 'box', 'garden',
    // 'windows' → null (non è un Negozio)
  ]),

  Villa: new Set([
    'sqm', 'condition', 'rooms', 'bathrooms',
    // 'floor' → null (edificio indipendente)
    'build_year', 'energy_class', 'heating',
    // 'elevator' → null (edificio indipendente)
    'balconies', 'terrace', 'box', 'garden',
    // 'windows' → null
  ]),

  'Casa indipendente': new Set([
    'sqm', 'condition', 'rooms', 'bathrooms',
    // 'floor' → null
    'build_year', 'energy_class', 'heating',
    // 'elevator' → null
    'balconies', 'terrace', 'box', 'garden',
    // 'windows' → null
  ]),

  'Casa semi-indipendente': new Set([
    'sqm', 'condition', 'rooms', 'bathrooms',
    // 'floor' → null
    'build_year', 'energy_class', 'heating',
    // 'elevator' → null
    'balconies', 'terrace', 'box', 'garden',
    // 'windows' → null
  ]),

  Ufficio: new Set([
    'sqm', 'condition', 'rooms', 'bathrooms', 'floor',
    'build_year', 'energy_class', 'heating',
    'elevator', 'balconies', 'box',
    // 'terrace' → null (solo residenziale/negozi)
    // 'garden' → null (solo residenziale)
    // 'windows' → null
  ]),

  Negozio: new Set([
    'sqm', 'condition', 'rooms',
    // 'bathrooms' → null
    // 'floor' → null
    'build_year', 'energy_class', 'heating',
    // 'elevator' → null
    // 'balconies' → null
    // 'terrace' → null
    'box',
    // 'garden' → null
    'windows', // solo Negozio
  ]),
};

/**
 * Restituisce true se il campo dato è visibile per la tipologia specificata.
 */
export const isFieldVisible = (field: Step2Field, propertyType: PropertyType): boolean =>
  FIELD_VISIBILITY[propertyType].has(field);

/**
 * Restituisce un oggetto con i campi NON visibili per la tipologia impostati a null.
 * Usato da useStepFeatures per pulire lo store al cambio di tipologia.
 */
export const getNullifiedFields = (propertyType: PropertyType): Partial<Record<Step2Field, null>> => {
  const result: Partial<Record<Step2Field, null>> = {};
  for (const field of ALL_STEP2_FIELDS) {
    if (!FIELD_VISIBILITY[propertyType].has(field)) {
      result[field] = null;
    }
  }
  return result;
};
