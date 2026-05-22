import type { Knex } from 'knex';

/**
 * Migration 005 — Aggiunta colonna `windows` a `valuations`
 *
 * Il campo vetrine (windows) è previsto nel tipo ValuationPayload per la tipologia
 * "Negozio" ma era assente nella tabella. Viene aggiunto come colonna nullable.
 * Valori ammessi: 'No' | 'Sì / 1' | 'Sì / 2'
 */
export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('valuations', 'windows');
  
  if (!hasColumn) {
    await knex.schema.alterTable('valuations', (table) => {
      // Solo Negozio: No | Sì / 1 | Sì / 2
      table.string('windows', 10).nullable().after('garden');
    });
    console.log('[MIGRATION] ✅ Colonna windows aggiunta a valuations');
  } else {
    console.log('[MIGRATION] ⚡ Colonna windows già presente, salto l\'operazione');
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('valuations', 'windows');
  
  if (hasColumn) {
    await knex.schema.alterTable('valuations', (table) => {
      table.dropColumn('windows');
    });
    console.log('[MIGRATION] ↩️  Colonna windows rimossa da valuations');
  } else {
    console.log('[MIGRATION] ⚡ Colonna windows non presente, salto la rimozione');
  }
}
