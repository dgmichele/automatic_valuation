export interface ValuationPayload {
  lat: number;
  lon: number;
  address: string;
  property_type: 'Appartamento' | 'Villa' | 'Casa indipendente' | 'Casa semi-indipendente' | 'Ufficio' | 'Negozio';
  sqm: number;
  condition: 'Nuova costruzione' | 'Ristrutturato' | 'In buono stato' | 'Non ristrutturato';
  rooms: string;
  bathrooms: '1' | '2' | '3' | '3+';
  floor: string;
  build_year?: number;
  energy_class: string;
  heating: 'Autonomo' | 'Centralizzato' | 'Assente';
  elevator: boolean;
  balconies: 'No' | '1' | '2+';
  terrace: boolean;
  box: boolean;
  garden: boolean;
  windows?: 'No' | '1' | '2+';
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
