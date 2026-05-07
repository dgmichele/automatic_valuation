import type { Knex } from 'knex';

/**
 * Migration 001 — Tabella `zones`
 *
 * Anagrafica delle zone OMI del Canavese.
 * È la tabella "padre" — deve esistere prima di omi_values e correction_coefficients.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('zones', (table) => {
    // Codice zona OMI (es. "E379/B1") — Primary Key naturale
    table.string('id_zona', 12).primary();
    table.string('comune', 100).notNullable();
    // Fascia: Centrale | Semicentrale | Periferica | Suburbana | Rurale
    table.string('fascia', 20).notNullable();
    table.text('descrizione').nullable();
    table.timestamps(true, true); // created_at, updated_at
  });

  console.log('[MIGRATION] ✅ Tabella zones creata');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('zones');
  console.log('[MIGRATION] ↩️  Tabella zones rimossa');
}
