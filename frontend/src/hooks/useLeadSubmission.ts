import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { submitValuation } from '../api/valuation.api';
import { useValuationStore } from '../store/useValuationStore';
import { valuationPayloadSchema } from '../schemas/valuation.schema';
import type { LeadFormData } from '../schemas/valuation.schema';
import { TOAST_MESSAGES } from '../types/feedback';
import type { ValuationPayload } from '../types/valuation';

interface UseLeadSubmissionParams {
  onSuccess?: () => void;
}

export const useLeadSubmission = ({ onSuccess }: UseLeadSubmissionParams = {}) => {
  const store = useValuationStore();
  const setResult = useValuationStore((s) => s.setResult);

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
      toast.success(
        `${TOAST_MESSAGES.VALUATION_SUCCESS.title} ${TOAST_MESSAGES.VALUATION_SUCCESS.message}`,
      );
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      const code = error?.code || error?.response?.data?.error?.code;
      const message = error?.message || error?.response?.data?.error?.message;

      if (code === 'VALIDATION_ERROR') {
        toast.error(`Errore validazione: ${message || 'Dati del form non validi'}`);
      } else if (code === 'OUTSIDE_AREA') {
        toast.error(
          `${TOAST_MESSAGES.GEO_OUTSIDE_AREA.title}: ${TOAST_MESSAGES.GEO_OUTSIDE_AREA.message}`,
        );
      } else {
        toast.error(
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
