/**
 * Copia identica di backend/types/shared.ts
 * Aggiornare manualmente ad ogni modifica backend.
 */

export interface GeoZone {
  id_zona: string;
  comune: string;
  fascia: string;
  descrizione: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/** Risposta specifica di GET /api/geo/lookup */
export type GeoZoneResponse = GeoZone;
