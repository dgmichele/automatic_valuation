import type { Knex } from 'knex';

/**
 * Migration 007 — Colonna energy_class nullable in `valuations`
 *
 * La classe energetica è stata resa facoltativa nella compilazione del form
 * (l'utente può lasciare il campo vuoto se non la conosce).
 * Il backend deve accettare NULL per energy_class.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('valuations', (table) => {
    table.string('energy_class', 10).nullable().alter();
  });

  console.log('[MIGRATION] ✅ Colonna energy_class resa nullable in valuations');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('valuations', (table) => {
    table.string('energy_class', 10).notNullable().alter();
  });

  console.log('[MIGRATION] ↩️  Colonna energy_class riportata a NOT NULL in valuations');
}
