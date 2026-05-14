/**
 * AppError — Classe di errore personalizzata per l'applicazione.
 *
 * Permette di distinguere gli errori "attesi" (4xx) dai crash imprevisti (5xx)
 * e di propagarli in modo uniforme all'errorHandler middleware.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  public readonly details: any;

  constructor(statusCode: number, code: string, message?: string, details?: any) {
    super(message || code);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    // Gli errori operazionali sono quelli previsti (es. OUTSIDE_AREA, NOT_FOUND)
    // Gli errori non operazionali sono bug inattesi (statusCode 500)
    this.isOperational = statusCode < 500;
    // Mantiene lo stack trace corretto in Node.js
    Error.captureStackTrace(this, this.constructor);
  }
}
