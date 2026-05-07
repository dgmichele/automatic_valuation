import type { Knex } from "knex";

/**
 * Seed 03 — Coefficienti di correzione.
 *
 * Dati estratti da TABLES.md (sezione "Coefficienti di correzione").
 * Questi coefficienti vengono moltiplicati tra loro per aggiustare il valore base OMI.
 */
export async function seed(knex: Knex): Promise<void> {
  // Pulizia tabella
  await knex("correction_coefficients").del();

  await knex("correction_coefficients").insert([
    // ===== RESIDENZIALE - APPARTAMENTO =====
    { destinazione: "Residenziale", tipologia: "Appartamento", categoria: "Ascensore", parametro: "Assente > 2°piano", coefficiente: 0.85 },
    { destinazione: "Residenziale", tipologia: "Appartamento", categoria: "Ascensore", parametro: "Assente > 1°piano", coefficiente: 0.95 },
    { destinazione: "Residenziale", tipologia: "Appartamento", categoria: "Ascensore", parametro: "Presente", coefficiente: 1.00 },
    { destinazione: "Residenziale", tipologia: "Appartamento", categoria: "Box", parametro: "Presente", coefficiente: 1.00 },
    { destinazione: "Residenziale", tipologia: "Appartamento", categoria: "Box", parametro: "Assente", coefficiente: 0.95 },
    { destinazione: "Residenziale", tipologia: "Appartamento", categoria: "Giardino", parametro: "Presente", coefficiente: 1.10 },
    { destinazione: "Residenziale", tipologia: "Appartamento", categoria: "Giardino", parametro: "Assente", coefficiente: 1.00 },
    { destinazione: "Residenziale", tipologia: "Appartamento", categoria: "Terrazzo", parametro: "Presente", coefficiente: 1.10 },
    { destinazione: "Residenziale", tipologia: "Appartamento", categoria: "Terrazzo", parametro: "Assente", coefficiente: 1.00 },
    { destinazione: "Residenziale", tipologia: "Appartamento", categoria: "Balcone", parametro: "Assente - piano terra", coefficiente: 1.00 },
    { destinazione: "Residenziale", tipologia: "Appartamento", categoria: "Balcone", parametro: "Assente - altri piani", coefficiente: 0.85 },
    { destinazione: "Residenziale", tipologia: "Appartamento", categoria: "Balcone", parametro: "1", coefficiente: 1.00 },
    { destinazione: "Residenziale", tipologia: "Appartamento", categoria: "Balcone", parametro: "2+", coefficiente: 1.05 },
    { destinazione: "Residenziale", tipologia: "Appartamento", categoria: "Bagno", parametro: "1", coefficiente: 1.00 },
    { destinazione: "Residenziale", tipologia: "Appartamento", categoria: "Bagno", parametro: "2+", coefficiente: 1.05 },

    // ===== RESIDENZIALE - VILLA / INDIPENDENTE =====
    { destinazione: "Residenziale", tipologia: "Villa / indipendente", categoria: "Giardino", parametro: "Presente", coefficiente: 1.10 },
    { destinazione: "Residenziale", tipologia: "Villa / indipendente", categoria: "Giardino", parametro: "Assente", coefficiente: 1.00 },
    { destinazione: "Residenziale", tipologia: "Villa / indipendente", categoria: "Terrazzo", parametro: "Presente", coefficiente: 1.10 },
    { destinazione: "Residenziale", tipologia: "Villa / indipendente", categoria: "Terrazzo", parametro: "Assente", coefficiente: 1.00 },
    { destinazione: "Residenziale", tipologia: "Villa / indipendente", categoria: "Balcone", parametro: "Assente", coefficiente: 1.00 },
    { destinazione: "Residenziale", tipologia: "Villa / indipendente", categoria: "Balcone", parametro: "1", coefficiente: 1.00 },
    { destinazione: "Residenziale", tipologia: "Villa / indipendente", categoria: "Balcone", parametro: "2+", coefficiente: 1.05 },
    { destinazione: "Residenziale", tipologia: "Villa / indipendente", categoria: "Bagno", parametro: "1", coefficiente: 1.00 },
    { destinazione: "Residenziale", tipologia: "Villa / indipendente", categoria: "Bagno", parametro: "2+", coefficiente: 1.05 },

    // ===== RESIDENZIALE - CASA SEMI INDIPENDENTE =====
    { destinazione: "Residenziale", tipologia: "Casa semi indipendente", categoria: "Giardino", parametro: "Presente", coefficiente: 1.10 },
    { destinazione: "Residenziale", tipologia: "Casa semi indipendente", categoria: "Giardino", parametro: "Assente", coefficiente: 1.00 },
    { destinazione: "Residenziale", tipologia: "Casa semi indipendente", categoria: "Terrazzo", parametro: "Presente", coefficiente: 1.10 },
    { destinazione: "Residenziale", tipologia: "Casa semi indipendente", categoria: "Terrazzo", parametro: "Assente", coefficiente: 1.00 },
    { destinazione: "Residenziale", tipologia: "Casa semi indipendente", categoria: "Balcone", parametro: "Assente", coefficiente: 1.00 },
    { destinazione: "Residenziale", tipologia: "Casa semi indipendente", categoria: "Balcone", parametro: "1", coefficiente: 1.00 },
    { destinazione: "Residenziale", tipologia: "Casa semi indipendente", categoria: "Balcone", parametro: "2+", coefficiente: 1.05 },
    { destinazione: "Residenziale", tipologia: "Casa semi indipendente", categoria: "Bagno", parametro: "1", coefficiente: 1.00 },
    { destinazione: "Residenziale", tipologia: "Casa semi indipendente", categoria: "Bagno", parametro: "2+", coefficiente: 1.05 },

    // ===== RESIDENZIALE - STATO (ALL) =====
    { destinazione: "Residenziale", tipologia: "ALL", categoria: "Stato", parametro: "Nuova costruzione", coefficiente: 1.80 },
    { destinazione: "Residenziale", tipologia: "ALL", categoria: "Stato", parametro: "Ristrutturato", coefficiente: 1.20 },
    { destinazione: "Residenziale", tipologia: "ALL", categoria: "Stato", parametro: "Non ristrutturato", coefficiente: 0.80 },
    { destinazione: "Residenziale", tipologia: "ALL", categoria: "Stato", parametro: "In buono stato", coefficiente: 1.00 },

    // ===== COMMERCIALE - NEGOZIO =====
    { destinazione: "Commerciale", tipologia: "Negozio", categoria: "Vetrine", parametro: "No", coefficiente: 0.80 },
    { destinazione: "Commerciale", tipologia: "Negozio", categoria: "Vetrine", parametro: "Sì / 1", coefficiente: 1.00 },
    { destinazione: "Commerciale", tipologia: "Negozio", categoria: "Vetrine", parametro: "Sì / 2", coefficiente: 1.05 },

    // ===== COMMERCIALE - UFFICIO =====
    { destinazione: "Commerciale", tipologia: "Ufficio", categoria: "Ascensore", parametro: "Assente > 2°piano", coefficiente: 0.85 },
    { destinazione: "Commerciale", tipologia: "Ufficio", categoria: "Ascensore", parametro: "Assente > 1°piano", coefficiente: 0.95 },
    { destinazione: "Commerciale", tipologia: "Ufficio", categoria: "Ascensore", parametro: "Presente", coefficiente: 1.00 },
    { destinazione: "Commerciale", tipologia: "Ufficio", categoria: "Box", parametro: "Presente", coefficiente: 1.00 },
    { destinazione: "Commerciale", tipologia: "Ufficio", categoria: "Box", parametro: "Assente", coefficiente: 0.95 },
    { destinazione: "Commerciale", tipologia: "Ufficio", categoria: "Balcone", parametro: "Assente", coefficiente: 0.95 },
    { destinazione: "Commerciale", tipologia: "Ufficio", categoria: "Balcone", parametro: "1", coefficiente: 1.00 },
    { destinazione: "Commerciale", tipologia: "Ufficio", categoria: "Balcone", parametro: "2+", coefficiente: 1.05 },
    { destinazione: "Commerciale", tipologia: "Ufficio", categoria: "Bagno", parametro: "1", coefficiente: 1.00 },
    { destinazione: "Commerciale", tipologia: "Ufficio", categoria: "Bagno", parametro: "2+", coefficiente: 1.05 },

    // ===== COMMERCIALE - STATO (ALL) =====
    { destinazione: "Commerciale", tipologia: "ALL", categoria: "Stato", parametro: "Nuova costruzione", coefficiente: 1.80 },
    { destinazione: "Commerciale", tipologia: "ALL", categoria: "Stato", parametro: "Ristrutturato", coefficiente: 1.20 },
    { destinazione: "Commerciale", tipologia: "ALL", categoria: "Stato", parametro: "Non ristrutturato", coefficiente: 0.80 },
    { destinazione: "Commerciale", tipologia: "ALL", categoria: "Stato", parametro: "In buono stato", coefficiente: 1.00 },
  ]);

  console.log("[SEED] ✅ 03_coefficients — inseriti i coefficienti di correzione");
}
