import { useMutation } from '@tanstack/react-query';
import { submitValuation } from '../api/valuation.api';
import { useValuationStore } from '../store/useValuationStore';
import { valuationPayloadSchema } from '../schemas/valuation.schema';
import type { LeadFormData } from '../schemas/valuation.schema';
import { useToast } from '../context/ToastContext';
import { TOAST_MESSAGES } from '../types/feedback';
import type { ValuationPayload } from '../types/valuation';

interface UseLeadSubmissionParams {
  onSuccess?: () => void;
}

export const useLeadSubmission = ({ onSuccess }: UseLeadSubmissionParams = {}) => {
  const store = useValuationStore();
  const setResult = useValuationStore((s) => s.setResult);
  const { showError } = useToast();

  const mutation = useMutation({
    mutationFn: async (leadData: LeadFormData) => {
      // 1. Assemblaggio payload da store + lead form
      const rawPayload: ValuationPayload = {
        lat: Number(store.lat),
        lon: Number(store.lon),
        address: store.address || '',
        property_type: store.property_type!,
        sqm: Number(store.sqm),
        condition: store.condition!,
        rooms: String(store.rooms || ''),
        bathrooms: store.bathrooms ?? null,
        floor: store.floor ? String(store.floor).trim() : null,
        build_year: store.build_year ? Number(store.build_year) : undefined,
        energy_class: store.energy_class!,
        heating: store.heating!,
        elevator: store.elevator ?? null,
        balconies: store.balconies ?? null,
        terrace: store.terrace ?? null,
        box: store.box ?? null,
        garden: store.garden ?? null,
        windows: store.windows ?? null,
        intent: store.intent || '',
        first_name: leadData.first_name,
        last_name: leadData.last_name,
        email: leadData.email,
        phone: leadData.phone,
      };

      // 2. Validazione Zod di sicurezza prima dell'invio
      const validatedPayload = valuationPayloadSchema.parse(rawPayload);

      // 3. Invio a backend API
      return await submitValuation(validatedPayload as ValuationPayload);
    },
    onSuccess: (data) => {
      setResult(data);
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      const code = error?.code || error?.response?.data?.error?.code;
      // Il messaggio backend viene mostrato fedelmente, senza riscritture
      const backendMessage = error?.response?.data?.error?.message;
      const message = backendMessage || error?.message;

      if (code === 'VALIDATION_ERROR') {
        // Errore di validazione: mostriamo il messaggio backend preciso + fallback leggibile
        showError(`Dati non validi: ${message || 'controlla i campi del form e riprova.'}`);
      } else if (code === 'OUTSIDE_AREA') {
        // Zona non coperta: messaggio specifico e descrittivo
        showError(
          `${TOAST_MESSAGES.GEO_OUTSIDE_AREA.title}: ${TOAST_MESSAGES.GEO_OUTSIDE_AREA.message}`,
        );
      } else if (message) {
        // Qualsiasi altro messaggio dal backend: lo mostriamo direttamente
        showError(message);
      } else {
        // Fallback finale se non c'è nessun messaggio disponibile
        showError(
          `${TOAST_MESSAGES.GENERIC_ERROR.title}: ${TOAST_MESSAGES.GENERIC_ERROR.message}`,
        );
      }
    },
  });

  return {
    submitLead: mutation.mutate,
    submitLeadAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export default useLeadSubmission;
