import type { Knex } from 'knex';

/**
 * Migration 008 — Aggiunta valore OMI per Casa semi indipendente in Ivrea (E379/B1)
 *
 * Dati estratti da TABLES_V3.md.
 * Inserisce la riga per la tipologia residenziale "Casa semi indipendente" nella zona centrale di Ivrea.
 */
export async function up(knex: Knex): Promise<void> {
  const exists = await knex('omi_values')
    .where({
      id_zona: 'E379/B1',
      destinazione: 'Residenziale',
      tipologia: 'Casa semi indipendente',
    })
    .first();

  if (!exists) {
    await knex('omi_values').insert({
      id_zona: 'E379/B1',
      destinazione: 'Residenziale',
      tipologia: 'Casa semi indipendente',
      min_price: 1250,
      max_price: 1350,
    });
    console.log('[MIGRATION] ✅ Valore OMI aggiunto: E379/B1 - Casa semi indipendente (€1250 - €1350)');
  } else {
    console.log('[MIGRATION] ℹ️  Valore OMI per E379/B1 - Casa semi indipendente già presente');
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex('omi_values')
    .where({
      id_zona: 'E379/B1',
      destinazione: 'Residenziale',
      tipologia: 'Casa semi indipendente',
    })
    .del();

  console.log('[MIGRATION] ↩️  Valore OMI rimosso: E379/B1 - Casa semi indipendente');
}
