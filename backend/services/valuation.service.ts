import db from '../config/db';
import { AppError } from '../utils/AppError';
import { ValuationPayload, ValuationResult } from '../types/valuation';
import { logInfo, logError } from './logger.service';

export const calculateValuation = async (id_zona: string, payload: ValuationPayload): Promise<ValuationResult> => {
  logInfo(`[VALUATION_SERVICE] Calcolo valutazione per zona ${id_zona}...`);

  // 1. Mappatura payload property_type verso tipologia DB
  let omiTipologia = payload.property_type as string;
  if (payload.property_type === 'Casa semi-indipendente') omiTipologia = 'Casa semi indipendente';
  if (payload.property_type === 'Negozio') omiTipologia = 'Negozio / Vetrinato';
  
  let coeffTipologia = payload.property_type as string;
  if (payload.property_type === 'Casa semi-indipendente') coeffTipologia = 'Casa semi indipendente';
  if (payload.property_type === 'Villa / Indipendente') coeffTipologia = 'Villa / indipendente';

  let destinazione = 'Residenziale';
  if (payload.property_type === 'Ufficio' || payload.property_type === 'Negozio') {
    destinazione = 'Commerciale';
  }

  // 2. Valore base OMI
  const baseValue = await db('omi_values')
    .where({ id_zona, destinazione, tipologia: omiTipologia })
    .first();

  if (!baseValue) {
    logError(`[VALUATION_SERVICE] Nessun valore OMI trovato per ${id_zona}, ${destinazione}, ${omiTipologia}`);
    throw new AppError(404, 'NOT_FOUND', 'Nessun valore base OMI disponibile per questa tipologia in questa zona');
  }

  // 3. Costruzione parametri
  const requestedCoeffs: { categoria: string, parametro: string }[] = [];

  // Stato (ALL)
  requestedCoeffs.push({ categoria: 'Stato', parametro: payload.condition });

  // Ascensore (solo Appartamento e Ufficio)
  if (payload.property_type === 'Appartamento' || payload.property_type === 'Ufficio') {
    const floorInt = parseInt(payload.floor, 10);
    if (payload.elevator) {
      requestedCoeffs.push({ categoria: 'Ascensore', parametro: 'Presente' });
    } else {
      if (!isNaN(floorInt) && floorInt > 2) {
        requestedCoeffs.push({ categoria: 'Ascensore', parametro: 'Assente > 2°piano' });
      } else if (!isNaN(floorInt) && floorInt > 1) {
        requestedCoeffs.push({ categoria: 'Ascensore', parametro: 'Assente > 1°piano' });
      }
    }
  }

  // Box, Giardino, Terrazzo
  if (payload.property_type !== 'Negozio') {
    if (payload.property_type !== 'Ufficio') {
      requestedCoeffs.push({ categoria: 'Giardino', parametro: payload.garden ? 'Presente' : 'Assente' });
      requestedCoeffs.push({ categoria: 'Terrazzo', parametro: payload.terrace ? 'Presente' : 'Assente' });
    }
    requestedCoeffs.push({ categoria: 'Box', parametro: payload.box ? 'Presente' : 'Assente' });
  }

  // Balcone (tutti tranne Negozio)
  if (payload.property_type !== 'Negozio') {
    let balconeParam = '';
    if (payload.balconies === '0') {
      const isGroundFloor = payload.floor.toLowerCase().includes('terra') || payload.floor === '0';
      balconeParam = isGroundFloor ? 'Assente - piano terra' : 'Assente - altri piani';
      // Fallback a 'Assente' per villa/ufficio
      if (payload.property_type !== 'Appartamento') balconeParam = 'Assente';
    } else {
      balconeParam = payload.balconies; // '1' o '2+'
    }
    requestedCoeffs.push({ categoria: 'Balcone', parametro: balconeParam });
  }

  // Bagno (tutti tranne Negozio)
  if (payload.property_type !== 'Negozio') {
    const bagnoParam = payload.bathrooms === '1' ? '1' : '2+';
    requestedCoeffs.push({ categoria: 'Bagno', parametro: bagnoParam });
  }

  // Vetrine (solo Negozio)
  if (payload.property_type === 'Negozio' && payload.windows) {
    requestedCoeffs.push({ categoria: 'Vetrine', parametro: payload.windows });
  }

  // 4. Recupero e calcolo coefficienti
  const coefficientsDB = await db('correction_coefficients')
    .where({ destinazione })
    .whereIn('tipologia', [coeffTipologia, 'ALL']);

  let multiplier = 1;
  const appliedCoeffs = [];

  for (const req of requestedCoeffs) {
    const coeff = coefficientsDB.find(c => c.categoria === req.categoria && c.parametro === req.parametro);
    if (coeff) {
      multiplier *= Number(coeff.coefficiente);
      appliedCoeffs.push(`${req.categoria}=${req.parametro} (${coeff.coefficiente})`);
    }
  }

  logInfo(`[VALUATION_SERVICE] Coefficienti applicati: ${appliedCoeffs.join(', ')} -> Moltiplicatore: ${multiplier.toFixed(4)}`);

  // 5. Forbice finale + edge case
  let bonus = 0;
  if (id_zona === 'E379/B1' && payload.box === true) {
    bonus = 15000;
    logInfo(`[VALUATION_SERVICE] Applicato bonus box di 15.000€ per zona E379/B1`);
  }

  const minValue = Math.round(Number(baseValue.min_price) * payload.sqm * multiplier + bonus);
  const maxValue = Math.round(Number(baseValue.max_price) * payload.sqm * multiplier + bonus);
  const avgValue = Math.round((minValue + maxValue) / 2);

  logInfo(`[VALUATION_SERVICE] Calcolo completato: min ${minValue}€, avg ${avgValue}€, max ${maxValue}€`);

  return { min_value: minValue, max_value: maxValue, avg_value: avgValue };
};
