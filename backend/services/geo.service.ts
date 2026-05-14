import fs from 'fs';
import path from 'path';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { AppError } from '../utils/AppError';
import { logInfo, logError } from './logger.service';
import db from '../config/db';
import { GeoZone } from '../types/shared';

let polygonsData: any = null;

/**
 * Carica in memoria i poligoni delle zone OMI all'avvio del server
 */
export const loadPolygons = () => {
  try {
    const filePath = path.join(__dirname, '../data/polygons.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    polygonsData = JSON.parse(rawData);
    logInfo(`[GEO_SERVICE] ✅ Loaded ${polygonsData.features?.length || 0} polygons into memory.`);
  } catch (error) {
    logError('[GEO_SERVICE] ❌ Failed to load polygons.json', error as Error);
    throw new Error('Impossibile caricare i poligoni geografici in memoria');
  }
};

/**
 * Identifica la zona OMI corrispondente alle coordinate date.
 * Usa Turf.js per verificare l'appartenenza del punto ai poligoni caricati in memoria.
 * 
 * @param lat Latitudine
 * @param lon Longitudine
 * @returns I dati della zona OMI dal database
 */
export const identifyZone = async (lat: number, lon: number): Promise<GeoZone> => {
  if (!polygonsData || !polygonsData.features) {
    throw new AppError(500, 'SERVER_ERROR', 'I dati geografici non sono ancora caricati');
  }

  // Turf.js richiede [longitudine, latitudine]
  const pt = [lon, lat];
  let idZona = null;

  logInfo(`[GEO_SERVICE] Lookup per le coordinate [${lat}, ${lon}]...`);

  for (const feature of polygonsData.features) {
    // Controllo se il punto è all'interno del poligono o multi-poligono
    if (booleanPointInPolygon(pt, feature)) {
      const codCom = feature.properties?.CODCOM;
      const codZona = feature.properties?.CODZONA;
      
      if (codCom && codZona) {
        idZona = `${codCom}/${codZona}`;
        break;
      }
    }
  }

  if (!idZona) {
    throw new AppError(404, 'OUTSIDE_AREA', 'Coordinate fuori dall\'area coperta dalle nostre zone OMI');
  }

  // Recupera i dati della zona dal database
  const zona = await db('zones').where({ id_zona: idZona }).first();

  if (!zona) {
    throw new AppError(404, 'OUTSIDE_AREA', `Zona identificata (${idZona}) non presente nel database anagrafica`);
  }

  return zona;
};
