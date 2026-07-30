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
import { useEffect } from 'react';
import { useValuationStore } from '../store/useValuationStore';
import type { ValuationPayload } from '../types/valuation';
import { isIvreaZone } from '../utils/zoneUtils';

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
  const zona = useValuationStore((state) => state.zona);
  const setFormField = useValuationStore((state) => state.setFormField);

  const isIvrea = isIvreaZone(zona);

  const options = isIvrea
    ? PROPERTY_TYPE_OPTIONS
    : PROPERTY_TYPE_OPTIONS.filter(
        (opt) => opt.value !== 'Ufficio' && opt.value !== 'Negozio',
      );

  // Se la zona non è Ivrea e nello store c'è una tipologia commerciale selezionata, resettala
  useEffect(() => {
    if (!isIvrea && (propertyType === 'Ufficio' || propertyType === 'Negozio')) {
      setFormField('property_type', undefined);
    }
  }, [isIvrea, propertyType, setFormField]);

  const selectPropertyType = (type: PropertyType) => {
    setFormField('property_type', type);
  };

  const isValid =
    propertyType !== undefined &&
    propertyType !== null &&
    options.some((o) => o.value === propertyType);

  return {
    selectedType: propertyType ?? null,
    selectPropertyType,
    options,
    isValid,
  };
};

