/**
 * geo.schema.ts — Schema Zod per la risposta di GET /api/geo/lookup.
 *
 * Allineato con GeoZone (backend/types/shared.ts).
 * Usato per validare la risposta prima di salvarla nello store.
 */
import { z } from 'zod';

/** Schema che corrisponde a GeoZone di backend/types/shared.ts */
export const geoZoneSchema = z.object({
  id_zona: z.string().min(1),
  comune: z.string().min(1),
  fascia: z.string().min(1),
  descrizione: z.string().min(1),
});

export type GeoZoneSchema = z.infer<typeof geoZoneSchema>;
