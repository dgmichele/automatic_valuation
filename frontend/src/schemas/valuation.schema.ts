/**
 * valuation.schema.ts — Schemi Zod per la validazione del form di valutazione.
 *
 * NOTA: usa la sintassi Zod v4 (la proprietà dei params è `error`, non
 * `errorMap`/`invalid_type_error`/`required_error` che erano in Zod v3).
 *
 * Struttura:
 *   - stepOneSchema        → validazione Step 1 (tipologia)
 *   - stepTwoSchema(type)  → validazione Step 2, dinamica per tipologia
 *   - valuationPayloadSchema → schema completo, ultima rete di sicurezza pre-submit
 *
 * Regola critica: la logica .optional().nullable() deve ricalcare ESATTAMENTE
 * quella del controller backend (valuation.controller.ts righe 25-54).
 * Aggiornare manualmente ad ogni modifica backend.
 */
import { z } from 'zod';
import type { PropertyType } from '../constants/fieldVisibility';
import { isFieldVisible } from '../constants/fieldVisibility';

// ── Step 1 — Tipologia ────────────────────────────────────────────────────────
export const stepOneSchema = z.object({
  property_type: z.enum([
    'Appartamento',
    'Villa',
    'Casa indipendente',
    'Casa semi-indipendente',
    'Ufficio',
    'Negozio',
  ]),
});

// ── Step 2 — Caratteristiche (dinamico per tipologia) ─────────────────────────
/**
 * Genera lo schema Zod per lo Step 2 in base alla tipologia selezionata.
 * I campi non visibili per la tipologia sono marcati come optional/nullable
 * e non vengono validati come required.
 */
export const stepTwoSchema = (propertyType: PropertyType) => {
  const visible = (field: Parameters<typeof isFieldVisible>[0]) =>
    isFieldVisible(field, propertyType);

  return z.object({
    // sqm — sempre obbligatorio (✅ tutte le tipologie)
    sqm: z
      .number({ error: 'Inserisci i metri quadri' })
      .positive('I mq devono essere maggiori di zero'),

    // condition — sempre obbligatorio
    condition: z.enum(
      ['Nuova costruzione', 'Ristrutturato', 'In buono stato', 'Non ristrutturato'],
      { error: 'Seleziona lo stato conservativo' },
    ),

    // rooms — sempre obbligatorio (string, non number)
    rooms: z.string().min(1, 'Seleziona il numero di locali'),

    // bathrooms — obbligatorio tranne Negozio
    bathrooms: visible('bathrooms')
      ? z.enum(['1', '2', '3', '3+'], { error: 'Seleziona il numero di bagni' })
      : z.enum(['1', '2', '3', '3+']).optional().nullable(),

    // floor — obbligatorio per Appartamento e Ufficio, null per il resto
    floor: visible('floor')
      ? z.string().min(1, 'Seleziona il piano')
      : z.string().optional().nullable(),

    // build_year — sempre opzionale (può non saperlo)
    build_year: z
      .number()
      .int()
      .min(1800, 'Anno non valido')
      .max(new Date().getFullYear(), 'Anno non valido')
      .optional()
      .nullable(),

    // energy_class — sempre obbligatorio
    energy_class: z.string().min(1, 'Seleziona la classe energetica'),

    // heating — sempre obbligatorio (opzioni filtrate per tipologia in UI)
    heating: z.enum(['Autonomo', 'Centralizzato', 'Assente'], {
      error: 'Seleziona il tipo di riscaldamento',
    }),

    // elevator — obbligatorio per Appartamento e Ufficio, null per il resto
    elevator: visible('elevator')
      ? z.boolean()
      : z.boolean().optional().nullable(),

    // balconies — obbligatorio tranne Negozio
    balconies: visible('balconies')
      ? z.enum(['No', '1', '2+'], { error: 'Seleziona il numero di balconi' })
      : z.enum(['No', '1', '2+']).optional().nullable(),

    // terrace — obbligatorio solo per Appartamento, Villa, Casa ind., Casa semi-ind.
    terrace: visible('terrace')
      ? z.boolean()
      : z.boolean().optional().nullable(),

    // box — obbligatorio tranne Negozio (che ha box visibile ma non garden/terrace)
    box: visible('box')
      ? z.boolean()
      : z.boolean().optional().nullable(),

    // garden — obbligatorio per tutte tranne Ufficio e Negozio
    garden: visible('garden')
      ? z.boolean()
      : z.boolean().optional().nullable(),

    // windows — obbligatorio SOLO per Negozio
    windows: visible('windows')
      ? z.enum(['No', '1', '2+'], { error: 'Seleziona il numero di vetrine' })
      : z.enum(['No', '1', '2+']).optional().nullable(),
  });
};

// ── Step 3 — Scopo valutazione ────────────────────────────────────────────────
export const stepThreeSchema = z.object({
  intent: z.string().min(1, 'Seleziona il tuo scopo'),
});

// ── Schema completo payload — ultima rete di sicurezza pre-submit ──────────────
export const valuationPayloadSchema = z.object({
  // Geo (da store)
  lat: z.number(),
  lon: z.number(),
  address: z.string().min(1),

  // Step 1
  property_type: z.enum([
    'Appartamento', 'Villa', 'Casa indipendente',
    'Casa semi-indipendente', 'Ufficio', 'Negozio',
  ]),

  // Step 2 (tutti optional/nullable a livello di schema completo —
  //  la validazione per-step garantisce i campi required a runtime)
  sqm: z.number().positive(),
  condition: z.enum(['Nuova costruzione', 'Ristrutturato', 'In buono stato', 'Non ristrutturato']),
  rooms: z.string().min(1),
  bathrooms: z.enum(['1', '2', '3', '3+']).optional().nullable(),
  floor: z.string().optional().nullable(),
  build_year: z.number().int().min(1800).max(new Date().getFullYear()).optional().nullable(),
  energy_class: z.string().min(1),
  heating: z.enum(['Autonomo', 'Centralizzato', 'Assente']),
  elevator: z.boolean().optional().nullable(),
  balconies: z.enum(['No', '1', '2+']).optional().nullable(),
  terrace: z.boolean().optional().nullable(),
  box: z.boolean().optional().nullable(),
  garden: z.boolean().optional().nullable(),
  windows: z.enum(['No', '1', '2+']).optional().nullable(),

  // Step 3
  intent: z.string().min(1),

  // Lead (da ResultPage)
  first_name: z.string().min(2, 'Il nome deve contenere almeno 2 caratteri'),
  last_name: z.string().min(2, 'Il cognome deve contenere almeno 2 caratteri'),
  email: z.string().email('Inserisci un indirizzo email valido'),
  phone: z.string().min(6, 'Inserisci un numero di telefono valido'),
});

export const leadSchema = z.object({
  first_name: z.string().min(2, 'Il nome deve contenere almeno 2 caratteri'),
  last_name: z.string().min(2, 'Il cognome deve contenere almeno 2 caratteri'),
  email: z.string().email('Inserisci un indirizzo email valido'),
  phone: z.string().min(6, 'Inserisci un numero di telefono valido'),
  privacy: z.boolean().refine((val) => val === true, {
    message: 'Devi accettare l\'informativa sulla privacy per proseguire',
  }),
});

export type LeadFormData = z.infer<typeof leadSchema>;

