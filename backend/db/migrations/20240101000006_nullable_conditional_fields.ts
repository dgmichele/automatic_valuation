import type { Knex } from 'knex';

/**
 * Migration 006 — Colonne condizionali nullable in `valuations`
 *
 * Alcuni campi non sono applicabili a tutte le tipologie di immobile:
 * - floor, elevator: non rilevanti per Villa, Casa ind., Negozio
 * - balconies: non rilevante per Negozio
 * - terrace, garden, box: non rilevanti per Ufficio e Negozio
 * - bathrooms: non rilevante per Negozio
 *
 * Il frontend non raccoglie questi campi per le tipologie non pertinenti,
 * quindi il backend deve accettare NULL come valore valido.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('valuations', (table) => {
    table.string('floor', 10).nullable().alter();
    table.boolean('elevator').nullable().alter();
    table.string('balconies', 10).nullable().alter();
    table.boolean('terrace').nullable().alter();
    table.boolean('box').nullable().alter();
    table.boolean('garden').nullable().alter();
    table.string('bathrooms', 10).nullable().alter();
  });

  console.log('[MIGRATION] ✅ Colonne condizionali rese nullable in valuations');
}

export async function down(knex: Knex): Promise<void> {
  // Ripristina NOT NULL — attenzione: fallirà se ci sono già righe con NULL
  await knex.schema.alterTable('valuations', (table) => {
    table.string('floor', 10).notNullable().alter();
    table.boolean('elevator').notNullable().alter();
    table.string('balconies', 10).notNullable().alter();
    table.boolean('terrace').notNullable().alter();
    table.boolean('box').notNullable().alter();
    table.boolean('garden').notNullable().alter();
    table.string('bathrooms', 10).notNullable().alter();
  });

  console.log('[MIGRATION] ↩️  Colonne condizionali riportate a NOT NULL in valuations');
}
