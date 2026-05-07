import type { Knex } from 'knex';

/**
 * Migration 003 — Tabella `correction_coefficients`
 *
 * Coefficienti di correzione per categoria e parametro.
 * Usati da valuation.service per calcolare la forbice finale.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('correction_coefficients', (table) => {
    table.increments('id').primary();
    // Residenziale | Commerciale
    table.string('destinazione', 20).notNullable();
    // Appartamento | Villa / Indipendente | Casa semi indipendente | Ufficio | Negozio | ALL
    table.string('tipologia', 50).notNullable();
    // Ascensore | Box | Giardino | Terrazzo | Balcone | Bagno | Stato | Vetrine
    table.string('categoria', 30).notNullable();
    // es. "Presente", "Assente > 2°piano", "Nuova costruzione", "1", "2+", ecc.
    table.string('parametro', 50).notNullable();
    table.decimal('coefficiente', 5, 3).notNullable();
    table.timestamps(true, true);
  });

  console.log('[MIGRATION] ✅ Tabella correction_coefficients creata');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('correction_coefficients');
  console.log('[MIGRATION] ↩️  Tabella correction_coefficients rimossa');
}
