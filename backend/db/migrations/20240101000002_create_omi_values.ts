import type { Knex } from 'knex';

/**
 * Migration 002 — Tabella `omi_values`
 *
 * Valori OMI per zona, destinazione e tipologia immobile.
 * FK verso zones(id_zona).
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('omi_values', (table) => {
    table.increments('id').primary();
    table
      .string('id_zona', 12)
      .notNullable()
      .references('id_zona')
      .inTable('zones')
      .onDelete('CASCADE');
    // Residenziale | Commerciale
    table.string('destinazione', 20).notNullable();
    // Appartamento | Villa / Indipendente | Casa semi indipendente | Ufficio | Negozio / Vetrinato
    table.string('tipologia', 50).notNullable();
    table.decimal('min_price', 10, 2).notNullable();
    table.decimal('max_price', 10, 2).notNullable();
    table.timestamps(true, true);
  });

  console.log('[MIGRATION] ✅ Tabella omi_values creata');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('omi_values');
  console.log('[MIGRATION] ↩️  Tabella omi_values rimossa');
}
