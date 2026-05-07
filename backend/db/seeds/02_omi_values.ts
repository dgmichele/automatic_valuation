import type { Knex } from "knex";

/**
 * Seed 02 — Valori OMI per zona e tipologia.
 *
 * Dati estratti da TABLES.md (sezione "Zone OMI").
 * Dipende dal seed 01_zones per le FK.
 */
export async function seed(knex: Knex): Promise<void> {
  // Pulizia tabella
  await knex("omi_values").del();

  await knex("omi_values").insert([
    // ===== IVREA (E379) =====
    { id_zona: "E379/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 1250, max_price: 1350 },
    { id_zona: "E379/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 1350, max_price: 1450 },
    { id_zona: "E379/B1", destinazione: "Commerciale", tipologia: "Ufficio", min_price: 850, max_price: 950 },
    { id_zona: "E379/B1", destinazione: "Commerciale", tipologia: "Negozio / Vetrinato", min_price: 1050, max_price: 1150 },

    { id_zona: "E379/D1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 1250, max_price: 1350 },
    { id_zona: "E379/D1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 1250, max_price: 1350 },
    { id_zona: "E379/D1", destinazione: "Commerciale", tipologia: "Ufficio", min_price: 850, max_price: 950 },
    { id_zona: "E379/D1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 1350, max_price: 1450 },

    { id_zona: "E379/B2", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 1050, max_price: 1150 },
    { id_zona: "E379/B2", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 1350, max_price: 1450 },
    { id_zona: "E379/B2", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 1150, max_price: 1250 },
    { id_zona: "E379/B2", destinazione: "Commerciale", tipologia: "Ufficio", min_price: 850, max_price: 950 },
    { id_zona: "E379/B2", destinazione: "Commerciale", tipologia: "Negozio / Vetrinato", min_price: 1050, max_price: 1150 },

    { id_zona: "E379/C2", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 1050, max_price: 1150 },
    { id_zona: "E379/C2", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 1350, max_price: 1450 },
    { id_zona: "E379/C2", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 1150, max_price: 1250 },
    { id_zona: "E379/C2", destinazione: "Commerciale", tipologia: "Ufficio", min_price: 850, max_price: 950 },
    { id_zona: "E379/C2", destinazione: "Commerciale", tipologia: "Negozio / Vetrinato", min_price: 1050, max_price: 1150 },

    { id_zona: "E379/C1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "E379/C1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 850, max_price: 950 },
    { id_zona: "E379/C1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 750, max_price: 850 },
    { id_zona: "E379/C1", destinazione: "Commerciale", tipologia: "Ufficio", min_price: 500, max_price: 600 },
    { id_zona: "E379/C1", destinazione: "Commerciale", tipologia: "Negozio / Vetrinato", min_price: 600, max_price: 700 },

    { id_zona: "E379/D2", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "E379/D2", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 850, max_price: 950 },
    { id_zona: "E379/D2", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 750, max_price: 850 },
    { id_zona: "E379/D2", destinazione: "Commerciale", tipologia: "Ufficio", min_price: 500, max_price: 600 },
    { id_zona: "E379/D2", destinazione: "Commerciale", tipologia: "Negozio / Vetrinato", min_price: 600, max_price: 700 },

    { id_zona: "E379/R4", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "E379/R4", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 750, max_price: 850 },
    { id_zona: "E379/R4", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 650, max_price: 750 },

    { id_zona: "E379/R3", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "E379/R3", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 750, max_price: 850 },
    { id_zona: "E379/R3", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 650, max_price: 750 },

    { id_zona: "E379/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "E379/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 750, max_price: 850 },
    { id_zona: "E379/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 650, max_price: 750 },

    { id_zona: "E379/D3", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 550 },
    { id_zona: "E379/D3", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 750, max_price: 850 },
    { id_zona: "E379/D3", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 650, max_price: 750 },

    { id_zona: "E379/D6", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 1250, max_price: 1350 },
    { id_zona: "E379/D6", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 1250, max_price: 1350 },
    { id_zona: "E379/D6", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 1350, max_price: 1450 },

    { id_zona: "E379/E1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 550 },
    { id_zona: "E379/E1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 750, max_price: 850 },
    { id_zona: "E379/E1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 650, max_price: 750 },

    // ===== ALBIANO D'IVREA (A157) =====
    { id_zona: "A157/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 600, max_price: 700 },
    { id_zona: "A157/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 800, max_price: 900 },
    { id_zona: "A157/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 1050, max_price: 1150 },
    { id_zona: "A157/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 450, max_price: 550 },
    { id_zona: "A157/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 650, max_price: 750 },
    { id_zona: "A157/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 850, max_price: 1000 },

    // ===== BANCHETTE (A607) =====
    { id_zona: "A607/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 550, max_price: 650 },
    { id_zona: "A607/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 800, max_price: 900 },
    { id_zona: "A607/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 900, max_price: 1000 },
    { id_zona: "A607/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 450, max_price: 550 },
    { id_zona: "A607/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 650, max_price: 750 },
    { id_zona: "A607/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 850, max_price: 1000 },

    // ===== BOLLENGO (A941) =====
    { id_zona: "A941/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 550, max_price: 650 },
    { id_zona: "A941/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 900, max_price: 1000 },
    { id_zona: "A941/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 1000, max_price: 1100 },
    { id_zona: "A941/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 450, max_price: 550 },
    { id_zona: "A941/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 650, max_price: 750 },
    { id_zona: "A941/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 850, max_price: 1000 },

    // ===== BORGOFRANCO D'IVREA (B015) =====
    { id_zona: "B015/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "B015/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 1000, max_price: 1100 },
    { id_zona: "B015/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 1150, max_price: 1250 },
    { id_zona: "B015/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "B015/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "B015/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 800, max_price: 900 },
    { id_zona: "B015/E1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "B015/E1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "B015/E1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 700, max_price: 800 },

    // ===== BUROLO (B279) =====
    { id_zona: "B279/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "B279/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 1000, max_price: 1100 },
    { id_zona: "B279/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 1150, max_price: 1250 },
    { id_zona: "B279/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "B279/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "B279/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 800, max_price: 900 },
    { id_zona: "B279/D1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "B279/D1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "B279/D1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 800, max_price: 900 },

    // ===== CASCINETTE D'IVREA (B953) =====
    { id_zona: "B953/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 700, max_price: 800 },
    { id_zona: "B953/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 1000, max_price: 1100 },
    { id_zona: "B953/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 1150, max_price: 1250 },
    { id_zona: "B953/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "B953/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 700, max_price: 800 },
    { id_zona: "B953/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 900, max_price: 1000 },

    // ===== CHIAVERANO (C624) =====
    { id_zona: "C624/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "C624/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 700, max_price: 800 },
    { id_zona: "C624/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 1050, max_price: 1150 },
    { id_zona: "C624/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "C624/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 700, max_price: 800 },
    { id_zona: "C624/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 900, max_price: 1000 },
    { id_zona: "C624/D1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "C624/D1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "C624/D1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 800, max_price: 900 },

    // ===== COLLERETTO GIACOSA (C868) =====
    { id_zona: "C868/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "C868/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "C868/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 800, max_price: 900 },
    { id_zona: "C868/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "C868/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "C868/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 800, max_price: 900 },

    // ===== FIORANO CANAVESE (D608) =====
    { id_zona: "D608/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "D608/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "D608/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 700, max_price: 800 },
    { id_zona: "D608/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 300, max_price: 400 },
    { id_zona: "D608/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 500, max_price: 600 },
    { id_zona: "D608/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 600, max_price: 700 },

    // ===== LESSOLO (E551) =====
    { id_zona: "E551/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "E551/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "E551/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 700, max_price: 800 },
    { id_zona: "E551/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 300, max_price: 400 },
    { id_zona: "E551/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 500, max_price: 600 },
    { id_zona: "E551/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 600, max_price: 700 },
    { id_zona: "E551/C1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "E551/C1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "E551/C1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 700, max_price: 800 },

    // ===== LORANZÈ (E683) =====
    { id_zona: "E683/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "E683/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "E683/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 800, max_price: 900 },
    { id_zona: "E683/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "E683/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "E683/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 800, max_price: 900 },
    { id_zona: "E683/D1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "E683/D1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "E683/D1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 800, max_price: 900 },

    // ===== MONTALTO (F420) =====
    { id_zona: "F420/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 600, max_price: 700 },
    { id_zona: "F420/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 1000, max_price: 1100 },
    { id_zona: "F420/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 1150, max_price: 1250 },
    { id_zona: "F420/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "F420/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 700, max_price: 800 },
    { id_zona: "F420/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 800, max_price: 900 },
    { id_zona: "F420/D1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "F420/D1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 700, max_price: 800 },
    { id_zona: "F420/D1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 800, max_price: 900 },

    // ===== PALAZZO CANAVESE (G262) =====
    { id_zona: "G262/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "G262/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "G262/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 700, max_price: 800 },
    { id_zona: "G262/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "G262/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "G262/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 700, max_price: 800 },

    // ===== PAVONE CANAVESE (G392) =====
    { id_zona: "G392/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 600, max_price: 700 },
    { id_zona: "G392/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 900, max_price: 1000 },
    { id_zona: "G392/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 1000, max_price: 1100 },
    { id_zona: "G392/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "G392/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "G392/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 700, max_price: 800 },
    { id_zona: "G392/D1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "G392/D1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 700, max_price: 800 },
    { id_zona: "G392/D1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 800, max_price: 900 },

    // ===== ROMANO CANAVESE (H511) =====
    { id_zona: "H511/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 550, max_price: 650 },
    { id_zona: "H511/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 800, max_price: 900 },
    { id_zona: "H511/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 900, max_price: 1000 },
    { id_zona: "H511/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "H511/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "H511/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 800, max_price: 900 },
    { id_zona: "H511/R2", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "H511/R2", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "H511/R2", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 800, max_price: 900 },

    // ===== SALERANO CANAVESE (H702) =====
    { id_zona: "H702/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "H702/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "H702/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 800, max_price: 900 },
    { id_zona: "H702/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "H702/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 500, max_price: 600 },
    { id_zona: "H702/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 600, max_price: 700 },
    { id_zona: "H702/R2", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "H702/R2", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 500, max_price: 600 },
    { id_zona: "H702/R2", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 600, max_price: 700 },

    // ===== SAMONE (H753) =====
    { id_zona: "H753/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 600, max_price: 700 },
    { id_zona: "H753/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 900, max_price: 1000 },
    { id_zona: "H753/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 1000, max_price: 1100 },
    { id_zona: "H753/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "H753/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "H753/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 700, max_price: 800 },

    // ===== STRAMBINO (I970) =====
    { id_zona: "I970/B1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 700, max_price: 800 },
    { id_zona: "I970/B1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 800, max_price: 900 },
    { id_zona: "I970/B1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 1000, max_price: 1100 },
    { id_zona: "I970/R1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 300, max_price: 400 },
    { id_zona: "I970/R1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 400, max_price: 500 },
    { id_zona: "I970/R1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 600, max_price: 700 },
    { id_zona: "I970/C1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 500, max_price: 600 },
    { id_zona: "I970/C1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "I970/C1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 700, max_price: 800 },
    { id_zona: "I970/D1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "I970/D1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "I970/D1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 700, max_price: 800 },
    { id_zona: "I970/D2", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "I970/D2", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "I970/D2", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 700, max_price: 800 },
    { id_zona: "I970/E1", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "I970/E1", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "I970/E1", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 700, max_price: 800 },
    { id_zona: "I970/E2", destinazione: "Residenziale", tipologia: "Appartamento", min_price: 400, max_price: 500 },
    { id_zona: "I970/E2", destinazione: "Residenziale", tipologia: "Casa semi indipendente", min_price: 600, max_price: 700 },
    { id_zona: "I970/E2", destinazione: "Residenziale", tipologia: "Villa / Indipendente", min_price: 700, max_price: 800 },
  ]);

  console.log("[SEED] ✅ 02_omi_values — inseriti i valori OMI");
}
