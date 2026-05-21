import dotenv from 'dotenv';
import path from 'path';

// ============= CARICAMENTO VARIABILI D'AMBIENTE =============
// In produzione su Netsons/cPanel le variabili sono iniettate dal sistema.
// In sviluppo e test, carichiamo .env.dev dalla root del progetto.
if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(__dirname, '.env.dev');
  dotenv.config({ path: envPath });
  console.log('[SERVER] 🔧 Loaded local env file from:', envPath);
} else {
  console.log('[SERVER] 🚀 Production mode: Using system environment variables (cPanel).');
}
// ==================================================================

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logInfo, logError } from './services/logger.service';
import { errorHandler } from './middleware/errorHandler.middleware';

// ============= VALIDAZIONE VARIABILI D'AMBIENTE =============
const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'CORS_ORIGIN',
];

const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  logError('[SERVER] ❌ Variabili d\'ambiente mancanti:', new Error(missingEnvVars.join(', ')));
  process.exit(1);
}

logInfo('[SERVER] ✅ Variabili d\'ambiente caricate e validate');
logInfo('[SERVER] Ambiente: ' + (process.env.NODE_ENV || 'development'));

// ============= INIZIALIZZAZIONE APP =============
const app: Application = express();

// Trust proxy su cPanel/Netsons per ricevere l'IP reale del client
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  logInfo('[SERVER] 🔒 Trust proxy abilitato per la produzione');
}

import { loadPolygons } from './services/geo.service';
// Carica i poligoni OMI in memoria all'avvio
loadPolygons();

// ============= MIDDLEWARE GLOBALI =============

// Security headers
app.use(helmet());
logInfo('[SERVER] ✅ Helmet configurato');

// CORS — accetta richieste solo dall'origine configurata
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
logInfo('[SERVER] ✅ CORS configurato per: ' + process.env.CORS_ORIGIN);

// Body parser JSON e form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
logInfo('[SERVER] ✅ Body parser configurato');

// ============= HEALTH CHECK =============
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ============= ROTTA BASE =============
app.get('/', (_req, res) => {
  res.send('🏠 Automatic Valuation API — server pronto');
});

// ============= ROUTES API =============
import geoRoutes from './routes/geo.routes';
import valuationRoutes from './routes/valuation.routes';

app.use('/api/geo', geoRoutes);
app.use('/api/valuations', valuationRoutes);

// ============= 404 HANDLER =============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: `Endpoint non trovato: ${req.method} ${req.url}`,
  });
});

// ============= ERROR HANDLER GLOBALE =============
app.use(errorHandler);

// ============= AVVIO SERVER =============
if (process.env.NODE_ENV !== 'test') {
  // Su cPanel la porta è una "named pipe" (stringa), non un numero
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    logInfo(`[SERVER] 🚀 Server avviato in ambiente: ${process.env.NODE_ENV}`);
    if (process.env.NODE_ENV !== 'production') {
      logInfo(`[SERVER] 🌐 URL: http://localhost:${PORT}`);
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logInfo('[SERVER] SIGTERM ricevuto, chiusura graceful...');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logInfo('[SERVER] SIGINT ricevuto, chiusura graceful...');
    process.exit(0);
  });
}

export default app;
