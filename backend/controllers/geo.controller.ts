import { Request, Response, NextFunction } from 'express';
import * as geoService from '../services/geo.service';
import { logInfo } from '../services/logger.service';
import { AppError } from '../utils/AppError';

/**
 * GET /api/geo/lookup
 * 
 * Riceve lat e lon, restituisce i dati della zona OMI se trovata.
 */
export const lookup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      throw new AppError(400, 'BAD_REQUEST', 'Latitudine e longitudine sono obbligatorie');
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new AppError(400, 'BAD_REQUEST', 'Latitudine e longitudine devono essere numeri validi');
    }

    logInfo(`[GEO_CONTROLLER] Lookup per lat: ${latitude}, lon: ${longitude}`);

    const zone = await geoService.identifyZone(latitude, longitude);

    return res.status(200).json({
      success: true,
      data: zone
    });
  } catch (error) {
    next(error);
  }
};
