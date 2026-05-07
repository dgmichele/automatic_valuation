import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logWarn, logError } from '../services/logger.service';

/**
 * errorHandler.middleware.ts — Middleware globale di gestione errori.
 *
 * Gestisce AppError (errori operazionali) e qualsiasi altro errore non previsto.
 * In produzione non espone mai lo stack trace al client.
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Errore operazionale noto (AppError)
  if (err instanceof AppError) {
    // 4xx → warning, 5xx → error
    if (err.statusCode < 500) {
      logWarn(`[ERROR_HANDLER] ${err.statusCode} ${err.code}: ${err.message}`, {
        url: req.url,
        method: req.method,
      });
    } else {
      logError(`[ERROR_HANDLER] ${err.statusCode} ${err.code}: ${err.message}`, err);
    }

    res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    });
    return;
  }

  // Errore non gestito (bug imprevisto)
  logError('[ERROR_HANDLER] Errore non gestito:', err);

  res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Si è verificato un errore interno. Riprova più tardi.'
        : err.message,
  });
};
