/**
 * useStepIntent — Hook di business logic per lo Step 3 del form.
 *
 * Responsabilità:
 *   - Legge il campo `intent` dallo store Zustand globale
 *   - Espone `setIntent(value)` per scrivere nello store
 *   - Calcola `isValid` con stepThreeSchema.safeParse()
 *
 * Il componente presentazionale StepIntent non tocca mai lo store
 * direttamente: usa solo i valori e le callback restituiti da questo hook.
 *
 * Pattern identico a useStepPropertyType e useStepFeatures per coerenza.
 */
import { useCallback } from 'react';
import { useValuationStore } from '../store/useValuationStore';
import { stepThreeSchema } from '../schemas/valuation.schema';

export const useStepIntent = () => {
  // ── Lettura store ───────────────────────────────────────────────────────────
  const intent = useValuationStore((s) => s.intent);
  const setFormField = useValuationStore((s) => s.setFormField);

  // ── Setter tipizzato ────────────────────────────────────────────────────────
  const setIntent = useCallback(
    (value: string) => {
      setFormField('intent', value);
    },
    [setFormField],
  );

  // ── Validazione step ────────────────────────────────────────────────────────
  const isValid: boolean = stepThreeSchema.safeParse({ intent: intent ?? '' }).success;

  return {
    // Valore corrente (per il binding UI)
    intent: intent ?? null,

    // Setter
    setIntent,

    // Stato validità
    isValid,
  };
};
