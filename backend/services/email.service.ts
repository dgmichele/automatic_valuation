import { logInfo } from './logger.service';

/**
 * Servizio per l'invio delle email di valutazione.
 * Implementazione completa prevista nella Fase 5.
 */
export const sendValuationEmail = async (to: string, data: any) => {
  logInfo(`[EMAIL_SERVICE] 📧 Stub: Invio email a ${to} posticipato alla Fase 5.`);
  return { success: true, message: 'Stub implementation' };
};
