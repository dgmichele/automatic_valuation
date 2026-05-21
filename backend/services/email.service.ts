import { Resend } from 'resend';
import * as React from 'react';
import { render } from '@react-email/render';
import { ValuationEmail, ValuationEmailProps } from '../emails/ValuationEmail';
import { logInfo, logError } from './logger.service';

// ---- Inizializzazione client Resend ----
// La chiave API viene letta dalle variabili d'ambiente
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Dati necessari per la generazione e l'invio dell'email di valutazione.
 * Corrisponde alle props del template ValuationEmail.
 */
export interface ValuationEmailData extends ValuationEmailProps {}

/**
 * Invia l'email di valutazione all'utente tramite Resend.
 *
 * @param to      - Indirizzo email del destinatario
 * @param data    - Dati della valutazione (nome, indirizzo, valori min/max/avg)
 * @returns       - Oggetto con success e ID messaggio Resend
 * @throws        - Lancia un errore se Resend restituisce un errore
 */
export const sendValuationEmail = async (
  to: string,
  data: ValuationEmailData
): Promise<{ success: boolean; id?: string }> => {
  logInfo(`[EMAIL_SERVICE] 📧 Rendering template per: ${to} | Immobile: ${data.address}`);

  // 1. Renderizza il componente React in stringa HTML
  const html = await render(
    React.createElement(ValuationEmail, data)
  );

  logInfo(`[EMAIL_SERVICE] Template renderizzato. Invio in corso via Resend...`);

  const fromName = process.env.RESEND_FROM_NAME || 'Bich Immobiliare';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'valutazioni@bichimmobiliare.it';

  // 2. Invia tramite Resend
  const { data: resendData, error } = await resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: [to],
    subject: `✅ Ecco la tua valutazione!`,
    html,
  });

  // 3. Gestione errori Resend
  if (error) {
    logError(`[EMAIL_SERVICE] ❌ Errore Resend per ${to}:`, error);
    throw new Error(`Resend error: ${error.message}`);
  }

  logInfo(`[EMAIL_SERVICE] ✅ Email inviata con successo a ${to}. ID Resend: ${resendData?.id}`);
  return { success: true, id: resendData?.id };
};
