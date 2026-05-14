import type { Knex } from 'knex';

/**
 * Migration 004 — Tabella `valuations`
 *
 * Ogni record corrisponde a una valutazione completata dall'utente.
 * Contiene dati immobile + lead + risultati del calcolo + stato email/CRM.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('valuations', (table) => {
    table.increments('id').primary();

    // --- Coordinate e indirizzo ---
    table.decimal('lat', 10, 7).notNullable();
    table.decimal('lon', 10, 7).notNullable();
    table.text('address').notNullable();
    table
      .string('id_zona', 12)
      .notNullable()
      .references('id_zona')
      .inTable('zones')
      .onDelete('RESTRICT');

    // --- Dati immobile ---
    // Appartamento | Villa / Indipendente | Casa semi-indipendente | Ufficio | Negozio
    table.string('property_type', 50).notNullable();
    table.integer('sqm').notNullable();
    // Nuova costruzione | Ristrutturato | In buono stato | Non ristrutturato
    table.string('condition', 30).notNullable();
    table.string('rooms', 10).notNullable();
    table.string('bathrooms', 10).notNullable();
    table.string('floor', 10).notNullable();
    table.integer('build_year').nullable();
    table.string('energy_class', 10).notNullable();
    // Autonomo | Centralizzato | Assente
    table.string('heating', 20).notNullable();
    table.boolean('elevator').notNullable();
    // 0 | 1 | 2+
    table.string('balconies', 10).notNullable();
    table.boolean('terrace').notNullable();
    table.boolean('box').notNullable();
    table.boolean('garden').notNullable();
    // Solo Negozio: No | Sì / 1 | Sì / 2
    table.string('windows', 10).nullable();

    // --- Dati lead ---
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('email', 255).notNullable();
    table.string('phone', 30).notNullable();
    table.string('intent', 100).notNullable();

    // --- Risultati calcolo ---
    table.decimal('min_value', 12, 2).nullable();
    table.decimal('max_value', 12, 2).nullable();
    table.decimal('avg_value', 12, 2).nullable();

    // --- Stato operazioni post-calcolo ---
    table.boolean('email_sent').notNullable().defaultTo(false);
    table.boolean('crm_synced').notNullable().defaultTo(false);

    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  console.log('[MIGRATION] ✅ Tabella valuations creata');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('valuations');
  console.log('[MIGRATION] ↩️  Tabella valuations rimossa');
}
