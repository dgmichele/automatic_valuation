import { Router } from 'express';
import * as valuationController from '../controllers/valuation.controller';
import { valuationLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

/**
 * @route   POST /api/valuations
 * @desc    Crea una nuova valutazione e salva il lead
 * @access  Public
 */
router.post('/', valuationLimiter, valuationController.create);

export default router;
