import { logInfo } from './logger.service';

/**
 * Servizio per la sincronizzazione dei lead con il CRM (Mailerlite).
 * Implementazione completa prevista nella Fase 5.
 */
export const syncToCRM = async (leadData: any, valuationData: any) => {
  logInfo(`[CRM_SERVICE] 🚀 Stub: Sincronizzazione CRM per ${leadData.email} posticipata alla Fase 5.`);
  return { success: true, message: 'Stub implementation' };
};
