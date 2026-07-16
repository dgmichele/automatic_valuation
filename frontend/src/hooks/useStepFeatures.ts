/**
 * useStepFeatures — Hook di business logic per lo Step 2 del form.
 *
 * Responsabilità:
 *   - Legge property_type e tutti i campi Step 2 dallo store Zustand
 *   - Calcola visibleFields tramite fieldVisibility.ts
 *   - Espone setField(key, value) per scrivere nello store
 *   - Al cambio di property_type: resetta i campi non più pertinenti a null
 *     (evita di inviare valori stantii coerenti con la vecchia tipologia)
 *   - Calcola isValid con stepTwoSchema(propertyType).safeParse()
 *
 * Il componente presentazionale StepFeatures non tocca mai lo store
 * direttamente: usa solo i valori e le callback restituiti da questo hook.
 */
import { useEffect, useCallback } from 'react';
import { useValuationStore } from '../store/useValuationStore';
import { isFieldVisible, getNullifiedFields, type Step2Field } from '../constants/fieldVisibility';
import { stepTwoSchema } from '../schemas/valuation.schema';

/** Chiave dei campi Step 2 come tipo letterale di stringa */
type Step2Key =
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

/** Tipo per i valori dei campi Step 2 (allineato allo store) */
type Step2Value = string | number | boolean | null | undefined;

export const useStepFeatures = () => {
  // ── Lettura store ───────────────────────────────────────────────────────────
  const propertyType = useValuationStore((s) => s.property_type);
  const sqm = useValuationStore((s) => s.sqm);
  const condition = useValuationStore((s) => s.condition);
  const rooms = useValuationStore((s) => s.rooms);
  const bathrooms = useValuationStore((s) => s.bathrooms);
  const floor = useValuationStore((s) => s.floor);
  const buildYear = useValuationStore((s) => s.build_year);
  const energyClass = useValuationStore((s) => s.energy_class);
  const heating = useValuationStore((s) => s.heating);
  const elevator = useValuationStore((s) => s.elevator);
  const balconies = useValuationStore((s) => s.balconies);
  const terrace = useValuationStore((s) => s.terrace);
  const box = useValuationStore((s) => s.box);
  const garden = useValuationStore((s) => s.garden);
  const windows = useValuationStore((s) => s.windows);
  const setFormField = useValuationStore((s) => s.setFormField);
  const setFormFields = useValuationStore((s) => s.setFormFields);

  // ── Reset campi non pertinenti al cambio di tipologia ─────────────────────
  // Se l'utente torna allo Step 1 e cambia tipologia, i valori dei campi
  // non più visibili vengono azzerati a null per non inviare dati stantii.
  useEffect(() => {
    if (!propertyType) return;
    const nullified = getNullifiedFields(propertyType);
    if (Object.keys(nullified).length > 0) {
      setFormFields(nullified as Parameters<typeof setFormFields>[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyType]);

  // ── Helper visibilità ──────────────────────────────────────────────────────
  const isVisible = useCallback(
    (field: Step2Field): boolean => {
      if (!propertyType) return false;
      return isFieldVisible(field, propertyType);
    },
    [propertyType],
  );

  // ── Setter generico tipizzato ──────────────────────────────────────────────
  // Usa Step2Key come tipo della chiave per evitare il cast su `number`
  // che emergeva con keyof ValuationPayload (che include metodi di string/array).
  const setField = useCallback(
    (key: Step2Key, value: Step2Value) => {
      // setFormField è tipizzato su FormSlice — la chiave è compatibile
      setFormField(key as Parameters<typeof setFormField>[0], value as never);
    },
    [setFormField],
  );

  // ── Validazione step ────────────────────────────────────────────────────────
  const isValid: boolean = (() => {
    if (!propertyType) return false;
    const schema = stepTwoSchema(propertyType);
    const result = schema.safeParse({
      sqm,
      condition,
      rooms,
      bathrooms: bathrooms ?? null,
      floor: floor ?? null,
      build_year: buildYear ?? null,
      energy_class: energyClass,
      heating,
      elevator: elevator ?? null,
      balconies: balconies ?? null,
      terrace: terrace ?? null,
      box: box ?? null,
      garden: garden ?? null,
      windows: windows ?? null,
    });
    return result.success;
  })();

  return {
    // Valori correnti (per il binding UI)
    propertyType: propertyType ?? null,
    sqm: sqm ?? null,
    condition: condition ?? null,
    rooms: rooms ?? null,
    bathrooms: bathrooms ?? null,
    floor: floor ?? null,
    buildYear: buildYear ?? null,
    energyClass: energyClass ?? null,
    heating: heating ?? null,
    elevator: elevator ?? null,
    balconies: balconies ?? null,
    terrace: terrace ?? null,
    box: box ?? null,
    garden: garden ?? null,
    windows: windows ?? null,

    // Helpers
    isVisible,
    setField,
    isValid,
  };
};
