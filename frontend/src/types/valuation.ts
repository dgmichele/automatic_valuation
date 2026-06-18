/**
 * Copia identica di backend/types/valuation.ts
 * Aggiornare manualmente ad ogni modifica backend.
 */

export interface ValuationPayload {
  lat: number;
  lon: number;
  address: string;
  property_type:
    | 'Appartamento'
    | 'Villa'
    | 'Casa indipendente'
    | 'Casa semi-indipendente'
    | 'Ufficio'
    | 'Negozio';
  sqm: number;
  condition:
    | 'Nuova costruzione'
    | 'Ristrutturato'
    | 'In buono stato'
    | 'Non ristrutturato';
  rooms: string;
  /** Condizionale: null per Villa, Casa ind., Negozio */
  bathrooms?: '1' | '2' | '3' | '3+' | null;
  /** Condizionale: null per Villa, Casa ind., Negozio */
  floor?: string | null;
  build_year?: number;
  energy_class: string;
  heating: 'Autonomo' | 'Centralizzato' | 'Assente';
  /** Condizionale: null per Villa, Casa ind., Negozio */
  elevator?: boolean | null;
  /** Condizionale: null per Negozio */
  balconies?: 'No' | '1' | '2+' | null;
  /** Condizionale: null per Ufficio e Negozio */
  terrace?: boolean | null;
  /** Condizionale: null per Ufficio e Negozio */
  box?: boolean | null;
  /** Condizionale: null per Ufficio e Negozio */
  garden?: boolean | null;
  /** Solo Negozio */
  windows?: 'No' | '1' | '2+' | null;
  intent: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface ValuationResult {
  min_value: number;
  max_value: number;
  avg_value: number;
}
