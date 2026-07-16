/**
 * buildQueryParams.ts
 *
 * Costruisce la query string per i parametri di geolocalizzazione (lat, lon, address).
 * Utilizza URLSearchParams per gestire correttamente la codifica dei caratteri.
 *
 * @param lat Latitudine dell'indirizzo
 * @param lon Longitudine dell'indirizzo
 * @param address Indirizzo testuale completo
 * @returns La stringa dei parametri formattata (es. "?lat=45.4654&lon=7.8732&address=...")
 */
export const buildQueryParams = (
  lat: number,
  lon: number,
  address: string,
): string => {
  const params = new URLSearchParams();
  params.set('lat', lat.toString());
  params.set('lon', lon.toString());
  params.set('address', address);
  return `?${params.toString()}`;
};
