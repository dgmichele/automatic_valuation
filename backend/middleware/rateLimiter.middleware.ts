import rateLimit from 'express-rate-limit';

/**
 * rateLimiter.middleware.ts — Rate limiting differenziato per endpoint.
 *
 * geo lookup: 30 richieste / 15 min per IP (chiamata leggera, senza DB write)
 * valuations: 10 richieste / 15 min per IP (endpoint principale con calcolo + email + CRM)
 */

/** Rate limiter per GET /api/geo/lookup */
export const geoLookupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Troppe richieste. Riprova tra qualche minuto.',
    }
  },
});

/** Rate limiter per POST /api/valuations */
export const valuationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Troppe richieste di valutazione. Riprova tra qualche minuto.',
    }
  },
});
