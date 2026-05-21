import fetch from 'node-fetch';
import { logInfo, logError } from './logger.service';

// ---- Costanti API Mailerlite ----
const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api/subscribers';

/**
 * Converte un booleano nel testo leggibile da Mailerlite.
 */
const boolToSiNo = (val: boolean): string => (val ? 'Sì' : 'No');

/**
 * Formatta un valore numerico come valuta italiana per il CRM.
 * Esempio: 88400 → "€ 88.400"
 */
const formatEuroCRM = (val: number): string =>
  `€ ${val.toLocaleString('it-IT')}`;

/**
 * Dati del lead provenienti dal payload validato.
 */
export interface LeadData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  property_type: string;
  sqm: number;
  condition: string;
  rooms: string;
  bathrooms: string;
  floor: string;
  energy_class: string;
  heating: string;
  elevator: boolean;
  balconies: string;
  terrace: boolean;
  box: boolean;
  garden: boolean;
  windows?: string; // Presente solo per Negozio
  intent: string;
}

/**
 * Dati della valutazione calcolata.
 */
export interface ValuationData {
  min_value: number;
  max_value: number;
  avg_value: number;
}

/**
 * Sincronizza il lead su Mailerlite nel gruppo "Valutazione automatica".
 * Se il subscriber esiste già (stessa email), Mailerlite aggiorna i campi.
 *
 * @param leadData      - Dati anagrafici e tecnici dell'immobile
 * @param valuationData - Valori calcolati (min, max, avg)
 * @returns             - Oggetto con success e ID subscriber Mailerlite
 * @throws              - Lancia un errore se la chiamata API fallisce
 */
export const syncToCRM = async (
  leadData: LeadData,
  valuationData: ValuationData
): Promise<{ success: boolean; subscriberId?: string }> => {
  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;

  logInfo(`[CRM_SERVICE] 🚀 Sincronizzazione Mailerlite per: ${leadData.email}`);

  // ---- Costruzione mappa campi personalizzati ----
  // Seguendo la mappatura in MAILERLITE_FIELDS.md
  const fields: Record<string, string> = {
    last_name: leadData.last_name,
    phone: leadData.phone,
    via: leadData.address,
    tipologia_immobile: leadData.property_type,
    metri_quadrati: String(leadData.sqm),
    stato_immobile: leadData.condition,
    locali: leadData.rooms,
    bagni: leadData.bathrooms,
    piano: leadData.floor,
    classe_energetica: leadData.energy_class,
    riscaldamento: leadData.heating,
    // Booleani convertiti in "Sì" / "No" (come richiesto nelle note di MAILERLITE_FIELDS.md)
    ascensore: boolToSiNo(leadData.elevator),
    balconi: leadData.balconies,
    terrazzo: boolToSiNo(leadData.terrace),
    garage: boolToSiNo(leadData.box),
    giardino: boolToSiNo(leadData.garden),
    richieste_per: leadData.intent,
    // Valore medio formattato come stringa leggibile
    valutazione_media: formatEuroCRM(valuationData.avg_value),
  };

  // Vetrine: campo presente solo per la tipologia Negozio
  if (leadData.windows) {
    fields.vetrine = leadData.windows;
  }

  // ---- Body della richiesta API Mailerlite v2 ----
  // L'email è l'identificatore principale e non va in "fields"
  const body = {
    email: leadData.email,
    fields: {
      name: leadData.first_name, // $name = first_name
      ...fields,
    },
    groups: [groupId],
  };

  // ---- Chiamata HTTP a Mailerlite ----
  const response = await fetch(MAILERLITE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  // ---- Gestione errori HTTP ----
  if (!response.ok) {
    const errorText = await response.text();
    logError(
      `[CRM_SERVICE] ❌ Mailerlite API error ${response.status} per ${leadData.email}:`,
      errorText
    );
    throw new Error(`Mailerlite API error ${response.status}: ${errorText}`);
  }

  // ---- Successo ----
  const result = await response.json() as { data?: { id?: string } };
  const subscriberId = result?.data?.id;

  logInfo(
    `[CRM_SERVICE] ✅ Subscriber sincronizzato su Mailerlite. ID: ${subscriberId} | Email: ${leadData.email}`
  );
  return { success: true, subscriberId };
};
