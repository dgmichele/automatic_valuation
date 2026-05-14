import dotenv from 'dotenv';
import path from 'path';

/**
 * Setup globale per i test.
 * Carica le variabili d'ambiente di test (o sviluppo) prima di avviare Jest.
 */
export default async () => {
  const envPath = path.resolve(__dirname, '../../.env.dev');
  dotenv.config({ path: envPath });
  console.log('[TEST SETUP] 🔧 Environment variables loaded for testing.');
};
