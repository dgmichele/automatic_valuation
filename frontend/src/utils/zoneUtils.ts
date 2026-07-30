import type { GeoZone } from '../types/shared';

/**
 * Verifica se una zona OMI appartiene al comune di Ivrea (codice E379).
 * Solo la zona E379 (Ivrea) supporta la valutazione di immobili commerciali (Ufficio e Negozio).
 *
 * @param zona Oggetto GeoZone memorizzato nello store
 * @returns true se la zona appartiene ad Ivrea (E379), false altrimenti
 */
export const isIvreaZone = (zona?: GeoZone | null): boolean => {
  if (!zona) return false;
  const isE379Code = Boolean(zona.id_zona && zona.id_zona.toUpperCase().startsWith('E379'));
  const isIvreaComune = Boolean(zona.comune && zona.comune.trim().toLowerCase() === 'ivrea');
  return isE379Code || isIvreaComune;
};
