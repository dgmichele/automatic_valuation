import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as geoService from '../services/geo.service';
import * as valuationService from '../services/valuation.service';
import * as emailService from '../services/email.service';
import * as crmService from '../services/crm.service';
import { logInfo, logError } from '../services/logger.service';
import db from '../config/db';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../types/shared';
import { ValuationResult } from '../types/valuation';

/**
 * Schema di validazione per la richiesta di valutazione
 */
const valuationSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  address: z.string(),
  property_type: z.enum(['Appartamento', 'Villa / Indipendente', 'Casa semi-indipendente', 'Ufficio', 'Negozio']),
  sqm: z.number().positive(),
  condition: z.enum(['Nuova costruzione', 'Ristrutturato', 'In buono stato', 'Non ristrutturato']),
  rooms: z.string(),
  bathrooms: z.enum(['1', '2', '3', '3+']),
  floor: z.string(),
  build_year: z.number().optional().nullable().transform(val => val === null ? undefined : val),
  energy_class: z.string(),
  heating: z.enum(['Autonomo', 'Centralizzato', 'Assente']),
  elevator: z.boolean(),
  balconies: z.enum(['0', '1', '2+']),
  terrace: z.boolean(),
  box: z.boolean(),
  garden: z.boolean(),
  windows: z.enum(['No', 'Sì / 1', 'Sì / 2']).optional(), // Solo per Negozio
  intent: z.string(),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string()
});

/**
 * POST /api/valuations
 * 
 * Endpoint principale: valida, identifica zona, calcola valore, salva su DB,
 * invia email e sincronizza CRM.
 */
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logInfo(`[VALUATION_CONTROLLER] Ricevuta nuova richiesta di valutazione per ${req.body.email}`);

    // 1. Validazione Zod
    const validatedData = valuationSchema.parse(req.body);

    // 2. Identificazione Zona
    const zone = await geoService.identifyZone(validatedData.lat, validatedData.lon);
    logInfo(`[VALUATION_CONTROLLER] Zona identificata: ${zone.id_zona} (${zone.comune})`);

    // 3. Calcolo Valutazione
    const result = await valuationService.calculateValuation(zone.id_zona, validatedData);

    // 4. Inserimento nel Database
    // Mappatura per il database (alcuni campi potrebbero avere nomi leggermente diversi o richiedere trasformazioni)
    const [valuationId] = await db('valuations').insert({
      lat: validatedData.lat,
      lon: validatedData.lon,
      address: validatedData.address,
      id_zona: zone.id_zona,
      property_type: validatedData.property_type,
      sqm: validatedData.sqm,
      condition: validatedData.condition,
      rooms: validatedData.rooms,
      bathrooms: validatedData.bathrooms,
      floor: validatedData.floor,
      build_year: validatedData.build_year,
      energy_class: validatedData.energy_class,
      heating: validatedData.heating,
      elevator: validatedData.elevator,
      balconies: validatedData.balconies,
      terrace: validatedData.terrace,
      box: validatedData.box,
      garden: validatedData.garden,
      min_value: result.min_value,
      max_value: result.max_value,
      avg_value: result.avg_value,
      first_name: validatedData.first_name,
      last_name: validatedData.last_name,
      email: validatedData.email,
      phone: validatedData.phone,
      intent: validatedData.intent,
      created_at: new Date()
    }).returning('id');

    logInfo(`[VALUATION_CONTROLLER] Valutazione salvata con ID: ${valuationId.id || valuationId}`);

    // 5. Email e CRM (non bloccanti)
    // Usiamo Promise.allSettled per gestire i fallimenti indipendentemente
    Promise.allSettled([
      emailService.sendValuationEmail(validatedData.email, { ...validatedData, ...result }),
      crmService.syncToCRM(validatedData, result)
    ]).then(async (results) => {
      const emailResult = results[0];
      const crmResult = results[1];

      const updates: any = {};
      if (emailResult.status === 'fulfilled') {
        updates.email_sent = true;
        logInfo(`[VALUATION_CONTROLLER] Email inviata con successo per valutazione ${valuationId.id || valuationId}`);
      } else {
        logError(`[VALUATION_CONTROLLER] Fallimento invio email per valutazione ${valuationId.id || valuationId}`, emailResult.reason);
      }

      if (crmResult.status === 'fulfilled') {
        updates.crm_synced = true;
        logInfo(`[VALUATION_CONTROLLER] Sincronizzazione CRM completata per valutazione ${valuationId.id || valuationId}`);
      } else {
        logError(`[VALUATION_CONTROLLER] Fallimento sincronizzazione CRM per valutazione ${valuationId.id || valuationId}`, crmResult.reason);
      }

      if (Object.keys(updates).length > 0) {
        await db('valuations').where({ id: valuationId.id || valuationId }).update(updates);
      }
    });

    // 6. Risposta al client
    const response: ApiResponse<ValuationResult> = {
      success: true,
      data: result
    };

    return res.status(201).json(response);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(400, 'VALIDATION_ERROR', 'Dati del form non validi', error.issues));
    }
    next(error);
  }
};
