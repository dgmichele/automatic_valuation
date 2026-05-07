import winston from 'winston';
import path from 'path';

/**
 * logger.service.ts — Configurazione Winston per logging centralizzato.
 *
 * Dev: output colorato su console + file.
 * Prod: solo file (combined.log + error.log).
 */

const logsDir = path.resolve(__dirname, '..', 'logs');

// Formato condiviso per i log su file
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Formato colorato per la console in sviluppo
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const extra = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `[${timestamp}] ${level}: ${message} ${extra}`;
  })
);

const transports: winston.transport[] = [
  // Log di tutti i livelli (info, warn, error, ecc.)
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    format: fileFormat,
  }),
  // Log solo degli errori
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    format: fileFormat,
  }),
];

// In sviluppo, aggiungi output colorato su console
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({ format: consoleFormat })
  );
}

const logger = winston.createLogger({
  level: 'info',
  transports,
  // Non uscire dal processo in caso di errori del logger stesso
  exitOnError: false,
});

// ===== Helper functions esportate =====

/** Log livello INFO */
export const logInfo = (message: string, meta?: object): void => {
  logger.info(message, meta);
};

/** Log livello WARN */
export const logWarn = (message: string, meta?: object): void => {
  logger.warn(message, meta);
};

/** Log livello ERROR */
export const logError = (message: string, error?: unknown): void => {
  if (error instanceof Error) {
    logger.error(message, { error: error.message, stack: error.stack });
  } else {
    logger.error(message, { error });
  }
};

export default logger;
