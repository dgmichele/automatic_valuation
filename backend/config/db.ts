import knex from 'knex';

/**
 * Istanza Knex per connessione al database PostgreSQL.
 *
 * IMPORTANTE: le variabili d'ambiente vengono caricate da server.ts (o setup.ts nei test),
 * NON caricare dotenv qui per evitare duplicazioni.
 */

console.log(`[DB_CONFIG] NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`[DB_CONFIG] DB_NAME: ${process.env.DB_NAME}`);

/**
 * Istanza Knex configurata in base all'ambiente corrente.
 * Supporta le variabili DB_URL (production su cPanel) oppure i singoli campi host/port/user/password.
 */
const db = knex({
  client: 'pg',
  connection: process.env.DB_URL || {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: {
    min: 2,
    max: 10,
  },
  // Debug SQL disabilitato in produzione
  debug: false,
});

export default db;
