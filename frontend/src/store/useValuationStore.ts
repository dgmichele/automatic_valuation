import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GeoZone } from '../types/shared';
import type { ValuationPayload, ValuationResult } from '../types/valuation';

// ── Slice Geo ─────────────────────────────────────────────────────────────────
// Dati geografici derivati dal query params + risposta di GET /api/geo/lookup
interface GeoSlice {
  lat: number | null;
  lon: number | null;
  address: string | null;
  zona: GeoZone | null;
}

// ── Slice Form ────────────────────────────────────────────────────────────────
// Campi del multi-step form (tutti i campi di ValuationPayload esclusi geo e lead)
type FormSlice = Partial<
  Pick<
    ValuationPayload,
    | 'property_type'
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
    | 'windows'
    | 'intent'
  >
>;

// ── Slice Lead ────────────────────────────────────────────────────────────────
// Dati personali raccolti in ResultPage (LeadForm)
type LeadSlice = Partial<
  Pick<ValuationPayload, 'first_name' | 'last_name' | 'email' | 'phone'>
>;

// ── Slice UI ──────────────────────────────────────────────────────────────────
// Stato di navigazione e risultato valutazione
interface UiSlice {
  currentStep: 1 | 2 | 3;
  result: ValuationResult | null;
}

// ── Store completo ─────────────────────────────────────────────────────────────
interface ValuationStore extends GeoSlice, FormSlice, LeadSlice, UiSlice {
  // Azioni geo
  setGeo: (geo: GeoSlice) => void;

  // Azioni form
  setFormField: <K extends keyof FormSlice>(key: K, value: FormSlice[K]) => void;
  setFormFields: (fields: Partial<FormSlice>) => void;

  // Azioni lead
  setLeadField: <K extends keyof LeadSlice>(key: K, value: LeadSlice[K]) => void;
  setLeadFields: (fields: Partial<LeadSlice>) => void;

  // Azioni UI
  setCurrentStep: (step: 1 | 2 | 3) => void;
  setResult: (result: ValuationResult | null) => void;

  // Reset completo dello store
  resetStore: () => void;
  // Reset solo slice form + lead (mantiene geo — usato dopo modifica indirizzo)
  resetFormAndLead: () => void;
}

// Stato iniziale condiviso (usato anche per il reset)
const INITIAL_GEO: GeoSlice = {
  lat: null,
  lon: null,
  address: null,
  zona: null,
};

const INITIAL_UI: UiSlice = {
  currentStep: 1,
  result: null,
};

export const useValuationStore = create<ValuationStore>()(
  persist(
    (set) => ({
      // Stato iniziale
      ...INITIAL_GEO,
      ...INITIAL_UI,

      // ── Azioni geo ──────────────────────────────────────────────────────────
      setGeo: (geo) => set(geo),

      // ── Azioni form ─────────────────────────────────────────────────────────
      setFormField: (key, value) => set({ [key]: value }),
      setFormFields: (fields) => set(fields),

      // ── Azioni lead ─────────────────────────────────────────────────────────
      setLeadField: (key, value) => set({ [key]: value }),
      setLeadFields: (fields) => set(fields),

      // ── Azioni UI ───────────────────────────────────────────────────────────
      setCurrentStep: (step) => set({ currentStep: step }),
      setResult: (result) => set({ result }),

      // ── Reset ───────────────────────────────────────────────────────────────
      resetStore: () =>
        set({
          ...INITIAL_GEO,
          ...INITIAL_UI,
          // Campi form e lead: reset a undefined
          property_type: undefined,
          sqm: undefined,
          condition: undefined,
          rooms: undefined,
          bathrooms: undefined,
          floor: undefined,
          build_year: undefined,
          energy_class: undefined,
          heating: undefined,
          elevator: undefined,
          balconies: undefined,
          terrace: undefined,
          box: undefined,
          garden: undefined,
          windows: undefined,
          intent: undefined,
          first_name: undefined,
          last_name: undefined,
          email: undefined,
          phone: undefined,
        }),

      resetFormAndLead: () =>
        set({
          ...INITIAL_UI,
          property_type: undefined,
          sqm: undefined,
          condition: undefined,
          rooms: undefined,
          bathrooms: undefined,
          floor: undefined,
          build_year: undefined,
          energy_class: undefined,
          heating: undefined,
          elevator: undefined,
          balconies: undefined,
          terrace: undefined,
          box: undefined,
          garden: undefined,
          windows: undefined,
          intent: undefined,
          first_name: undefined,
          last_name: undefined,
          email: undefined,
          phone: undefined,
        }),
    }),
    {
      name: 'valutazione-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
