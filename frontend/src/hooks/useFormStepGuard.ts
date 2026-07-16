/**
 * useFormStepGuard — Routing guard per il multi-step form.
 *
 * Responsabilità:
 *   - Viene chiamato all'inizio di ogni step del form.
 *   - Verifica che gli step precedenti siano completati (dati validi nello store).
 *   - Se lo step corrente richiede dati di step precedenti non ancora compilati,
 *     esegue un redirect automatico allo step corretto.
 *
 * Esempio: se l'utente carica /form/step-3 direttamente ma non ha compilato lo
 * step 1 (property_type assente), verrà reindirizzato a /form/step-1.
 *
 * Non mostra nessun toast o UI: il redirect è silenzioso e immediato.
 * Il componente che monta questo hook si occuperà di non renderizzare nulla
 * fino a quando la guardia non ha terminato la sua valutazione (isGuardReady).
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useValuationStore } from '../store/useValuationStore';
import { stepTwoSchema } from '../schemas/valuation.schema';

export const useFormStepGuard = (currentStep: 1 | 2 | 3) => {
  const navigate = useNavigate();
  const [isGuardReady, setIsGuardReady] = useState(false);

  const propertyType = useValuationStore((s) => s.property_type);

  // Calcola se lo Step 2 è valido (necessario per accedere allo step 3)
  const step2IsValid = (() => {
    if (!propertyType) return false;
    const schema = stepTwoSchema(propertyType);
    const result = schema.safeParse({
      sqm: useValuationStore.getState().sqm,
      condition: useValuationStore.getState().condition,
      rooms: useValuationStore.getState().rooms,
      bathrooms: useValuationStore.getState().bathrooms ?? null,
      floor: useValuationStore.getState().floor ?? null,
      build_year: useValuationStore.getState().build_year ?? null,
      energy_class: useValuationStore.getState().energy_class,
      heating: useValuationStore.getState().heating,
      elevator: useValuationStore.getState().elevator ?? null,
      balconies: useValuationStore.getState().balconies ?? null,
      terrace: useValuationStore.getState().terrace ?? null,
      box: useValuationStore.getState().box ?? null,
      garden: useValuationStore.getState().garden ?? null,
      windows: useValuationStore.getState().windows ?? null,
    });
    return result.success;
  })();

  useEffect(() => {
    // Step 1: nessun guard — è sempre accessibile
    if (currentStep === 1) {
      setIsGuardReady(true);
      return;
    }

    // Step 2: richiede property_type nello store
    if (currentStep === 2) {
      if (!propertyType) {
        navigate('/form/step-1', { replace: true });
        return;
      }
      setIsGuardReady(true);
      return;
    }

    // Step 3: richiede step 1 valido E step 2 valido
    if (currentStep === 3) {
      if (!propertyType) {
        navigate('/form/step-1', { replace: true });
        return;
      }
      if (!step2IsValid) {
        navigate('/form/step-2', { replace: true });
        return;
      }
      setIsGuardReady(true);
      return;
    }
  }, [currentStep, propertyType, step2IsValid, navigate]);

  return { isGuardReady };
};
