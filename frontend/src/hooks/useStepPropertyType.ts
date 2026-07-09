/**
 * useStepPropertyType — Hook di business logic per lo Step 1 del form.
 *
 * Responsabilità:
 * - Legge il valore corrente di `property_type` dallo store Zustand
 * - Espone l'azione per aggiornarlo
 * - Espone un flag `isValid` che indica se lo step è completato
 *   (valore selezionato e non undefined/null)
 *
 * Il componente presentazionale `StepPropertyType` non tocca mai lo store
 * direttamente: usa solo i valori e le callback restituiti da questo hook.
 */
import { useValuationStore } from '../store/useValuationStore';
import type { ValuationPayload } from '../types/valuation';

/** Tipo allineato al backend — stringhe esatte usate nell'API */
export type PropertyType = ValuationPayload['property_type'];

export const PROPERTY_TYPE_OPTIONS: {
  value: PropertyType;
  label: string;
}[] = [
  { value: 'Appartamento', label: 'Appartamento' },
  { value: 'Villa', label: 'Villa' },
  { value: 'Casa indipendente', label: 'Casa indipendente' },
  { value: 'Casa semi-indipendente', label: 'Casa semi-indipendente' },
  { value: 'Ufficio', label: 'Ufficio' },
  { value: 'Negozio', label: 'Negozio' },
];

export const useStepPropertyType = () => {
  const propertyType = useValuationStore(
    (state) => state.property_type,
  ) as PropertyType | undefined;
  const setFormField = useValuationStore((state) => state.setFormField);

  const selectPropertyType = (type: PropertyType) => {
    setFormField('property_type', type);
  };

  const isValid = propertyType !== undefined && propertyType !== null;

  return {
    selectedType: propertyType ?? null,
    selectPropertyType,
    isValid,
  };
};
