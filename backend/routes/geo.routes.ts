import { Router } from 'express';
import * as geoController from '../controllers/geo.controller';
import { geoLookupLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

/**
 * @route   GET /api/geo/lookup
 * @desc    Lookup zona OMI da coordinate lat/lon
 * @access  Public
 */
router.get('/lookup', geoLookupLimiter, geoController.lookup);

export default router;
