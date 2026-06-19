/**
 * geo.api.ts — Chiamate API relative alla geolocalizzazione.
 *
 * Espone:
 * - lookupZone: GET /api/geo/lookup?lat=&lon=
 *   Restituisce i dati della zona OMI se le coordinate sono nell'area di competenza.
 *   Lancia errore Axios (con code=OUTSIDE_AREA) se fuori zona.
 */
import apiClient from './axiosClient';
import type { ApiResponse, GeoZoneResponse } from '../types/shared';

/**
 * Recupera la zona OMI corrispondente alle coordinate fornite.
 *
 * @param lat - Latitudine (numero)
 * @param lon - Longitudine (numero)
 * @returns Promise<GeoZoneResponse> — dati della zona (id_zona, comune, fascia, descrizione)
 * @throws AxiosError con code=OUTSIDE_AREA se le coordinate non appartengono ad alcuna zona
 */
export const lookupZone = async (
  lat: number,
  lon: number,
): Promise<GeoZoneResponse> => {
  const { data } = await apiClient.get<ApiResponse<GeoZoneResponse>>(
    '/geo/lookup',
    {
      params: { lat, lon },
    },
  );

  // Il backend restituisce { success: true, data: GeoZone }
  // L'interceptor di axiosClient gestisce già gli errori strutturati
  return data.data!;
};
