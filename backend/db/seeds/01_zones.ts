import type { Knex } from 'knex';

/**
 * Seed 01 — Anagrafica zone OMI del Canavese.
 *
 * Dati estratti da TABLES.md (sezione "Anagrafica").
 * Deve essere eseguito PER PRIMO (è referenziato da omi_values e correction_coefficients).
 */
export async function seed(knex: Knex): Promise<void> {
  // Pulizia tabella prima di ri-inserire (evita duplicati in caso di re-seed)
  await knex('zones').del();

  await knex('zones').insert([
    // ===== IVREA =====
    { id_zona: 'E379/B1', comune: 'Ivrea', fascia: 'Centrale',     descrizione: 'CENTRO STORICO - V.PALESTRO - V.ARDUINO - BORGHETTO' },
    { id_zona: 'E379/B2', comune: 'Ivrea', fascia: 'Centrale',     descrizione: "CENTRO - C.SO MASSIMO D'AZEGLIO - C.SO NIZZA" },
    { id_zona: 'E379/C1', comune: 'Ivrea', fascia: 'Semicentrale', descrizione: 'S.GRATO - STR.TORINO' },
    { id_zona: 'E379/C2', comune: 'Ivrea', fascia: 'Semicentrale', descrizione: 'FIORANA - C.SO VERCELLI' },
    { id_zona: 'E379/D1', comune: 'Ivrea', fascia: 'Periferica',   descrizione: 'CRIST - S.PIETRO - PERIFERICA NORD' },
    { id_zona: 'E379/D2', comune: 'Ivrea', fascia: 'Periferica',   descrizione: 'BELLAVISTA - S.BERNARDO' },
    { id_zona: 'E379/D3', comune: 'Ivrea', fascia: 'Periferica',   descrizione: 'S.GIOVANNI - VIALE FRIULI - CORSO VERCELLI - VIA BUROLO' },
    { id_zona: 'E379/D6', comune: 'Ivrea', fascia: 'Periferica',   descrizione: 'ZONA RESIDENZIALE DI PREGIO NORD E NORD-EST' },
    { id_zona: 'E379/E1', comune: 'Ivrea', fascia: 'Suburbana',    descrizione: 'TORRE BALFREDO - VIA MAESTRA' },
    { id_zona: 'E379/R1', comune: 'Ivrea', fascia: 'Rurale',       descrizione: 'OVEST' },
    { id_zona: 'E379/R3', comune: 'Ivrea', fascia: 'Rurale',       descrizione: 'EST' },
    { id_zona: 'E379/R4', comune: 'Ivrea', fascia: 'Rurale',       descrizione: 'SUD' },
    // ===== ALBIANO D'IVREA =====
    { id_zona: 'A157/B1', comune: "Albiano d'Ivrea", fascia: 'Centrale', descrizione: 'CENTRO STORICO E RESIDENZIALE STRADA DEL BOSSONE STRADA ALBIANO AZEGLIO' },
    { id_zona: 'A157/R1', comune: "Albiano d'Ivrea", fascia: 'Rurale',   descrizione: 'NORD-EST-SUD-OVEST' },
    // ===== BANCHETTE =====
    { id_zona: 'A607/B1', comune: 'Banchette', fascia: 'Centrale', descrizione: 'CENTRO STORICO STRADA TORRETTA' },
    { id_zona: 'A607/R1', comune: 'Banchette', fascia: 'Rurale',   descrizione: 'NORD' },
    // ===== BOLLENGO =====
    { id_zona: 'A941/B1', comune: 'Bollengo', fascia: 'Centrale', descrizione: 'INTERO TERRITORIO COMUNALE' },
    { id_zona: 'A941/R1', comune: 'Bollengo', fascia: 'Rurale',   descrizione: 'EST' },
    // ===== BORGOFRANCO D'IVREA =====
    { id_zona: 'B015/B1', comune: "Borgofranco d'Ivrea", fascia: 'Centrale', descrizione: 'INTERO TERRITORIO COMUNALE' },
    { id_zona: 'B015/E1', comune: "Borgofranco d'Ivrea", fascia: 'Centrale', descrizione: 'BAIO DORA' },
    { id_zona: 'B015/R1', comune: "Borgofranco d'Ivrea", fascia: 'Rurale',   descrizione: 'NORD-EST-SUD-OVEST' },
    // ===== BUROLO =====
    { id_zona: 'B279/B1', comune: 'Burolo', fascia: 'Centrale',   descrizione: 'INTERO TERRITORIO COMUNALE' },
    { id_zona: 'B279/D1', comune: 'Burolo', fascia: 'Periferica', descrizione: 'ZONA INDUSTRIALE STRADA PROVINCIALE IVREA VERCELLI' },
    { id_zona: 'B279/R1', comune: 'Burolo', fascia: 'Rurale',     descrizione: 'NORD-OVEST' },
    // ===== CASCINETTE D'IVREA =====
    { id_zona: 'B953/B1', comune: "Cascinette d'Ivrea", fascia: 'Centrale', descrizione: 'RESIDENZIALE STRADA PER IVREA' },
    { id_zona: 'B953/R1', comune: "Cascinette d'Ivrea", fascia: 'Rurale',   descrizione: 'NORD-EST-SUD' },
    // ===== CHIAVERANO =====
    { id_zona: 'C624/B1', comune: 'Chiaverano', fascia: 'Centrale',   descrizione: 'CENTRO STORICO CORSO CENTRALE, VIA IVREA' },
    { id_zona: 'C624/D1', comune: 'Chiaverano', fascia: 'Periferica', descrizione: 'RESIDENZIALE STR.COM. DI MONTALTO DORA, STR.COM.DA CHIAVERANO A BORGOFRANCO' },
    { id_zona: 'C624/R1', comune: 'Chiaverano', fascia: 'Rurale',     descrizione: 'NORD-EST-SUD-OVEST' },
    // ===== COLLERETTO GIACOSA =====
    { id_zona: 'C868/B1', comune: 'Colleretto Giacosa', fascia: 'Centrale', descrizione: 'INTERO TERRITORIO COMUNALE' },
    { id_zona: 'C868/R1', comune: 'Colleretto Giacosa', fascia: 'Rurale',   descrizione: 'NORD-EST-SUD' },
    // ===== FIORANO CANAVESE =====
    { id_zona: 'D608/B1', comune: 'Fiorano Canavese', fascia: 'Centrale', descrizione: 'INTERO TERRITORIO COMUNALE' },
    { id_zona: 'D608/R1', comune: 'Fiorano Canavese', fascia: 'Rurale',   descrizione: 'NORD-EST-SUD-OVEST' },
    // ===== LESSOLO =====
    { id_zona: 'E551/B1', comune: 'Lessolo', fascia: 'Centrale',     descrizione: 'CENTRO STORICO VIA ROVETO, VIA DELLE FORNACI' },
    { id_zona: 'E551/C1', comune: 'Lessolo', fascia: 'Semicentrale', descrizione: 'RESIDENZIALE S.COM.DI PASQUERE, VIA MONGINEVRO, S.COM.DA ALICE SUPERIORE A LESSOLO' },
    { id_zona: 'E551/R1', comune: 'Lessolo', fascia: 'Rurale',       descrizione: 'NORD-EST-SUD-OVEST' },
    // ===== LORANZÈ =====
    { id_zona: 'E683/B1', comune: 'Loranzè', fascia: 'Centrale',   descrizione: 'CENTRALE VIA MAESTRA, VIA ALLA CHIESA, S.COM.DI RONCALLA' },
    { id_zona: 'E683/D1', comune: 'Loranzè', fascia: 'Periferica', descrizione: 'S.COM SCAROLA, S.COM DELLE CASCINE, S.COM DI FIORANO E INDUSTRIALE S.PER IVREA' },
    { id_zona: 'E683/R1', comune: 'Loranzè', fascia: 'Rurale',     descrizione: 'NORD-EST-OVEST' },
    // ===== MONTALTO =====
    { id_zona: 'F420/B1', comune: 'Montalto', fascia: 'Centrale',   descrizione: 'CENTRO STORICO C.SO VITTORIO EMANUELE, VIA RE UMBERTO' },
    { id_zona: 'F420/D1', comune: 'Montalto', fascia: 'Periferica', descrizione: 'STAZIONE, S.P. IVREA-AOSTA, V. CERNAIA, STR. COM. DI BASSA, STR. COM. DI POLISEN' },
    { id_zona: 'F420/R1', comune: 'Montalto', fascia: 'Rurale',     descrizione: 'NORD-EST-OVEST' },
    // ===== PALAZZO CANAVESE =====
    { id_zona: 'G262/B1', comune: 'Palazzo Canavese', fascia: 'Centrale', descrizione: 'STRADA IVREA SANTHIA, VIA BREDDA, VIA QUILICO, VIA TRIESTE' },
    { id_zona: 'G262/R1', comune: 'Palazzo Canavese', fascia: 'Rurale',   descrizione: 'NORD-EST-SUD-OVEST' },
    // ===== PAVONE CANAVESE =====
    { id_zona: 'G392/B1', comune: 'Pavone Canavese', fascia: 'Centrale',   descrizione: 'CENTRO STORICO VIA BREDDA, VIA QUILICO, VIA TRIESTE' },
    { id_zona: 'G392/D1', comune: 'Pavone Canavese', fascia: 'Periferica', descrizione: 'STRADA AL CASTELLO VERSO IVREA' },
    { id_zona: 'G392/R1', comune: 'Pavone Canavese', fascia: 'Rurale',     descrizione: 'EST-SUD-OVEST' },
    // ===== ROMANO CANAVESE =====
    { id_zona: 'H511/B1', comune: 'Romano Canavese', fascia: 'Centrale', descrizione: 'ABITATO DI ROMANO - VIA V.EMANUELE, VIA CENTRALE' },
    { id_zona: 'H511/R1', comune: 'Romano Canavese', fascia: 'Rurale',   descrizione: 'NORD-EST-OVEST' },
    { id_zona: 'H511/R2', comune: 'Romano Canavese', fascia: 'Rurale',   descrizione: 'SUD' },
    // ===== SALERANO CANAVESE =====
    { id_zona: 'H702/B1', comune: 'Salerano Canavese', fascia: 'Centrale', descrizione: 'INTERO TERRITORIO COMUNALE' },
    { id_zona: 'H702/R1', comune: 'Salerano Canavese', fascia: 'Rurale',   descrizione: 'NORD' },
    { id_zona: 'H702/R2', comune: 'Salerano Canavese', fascia: 'Rurale',   descrizione: 'OVEST' },
    // ===== SAMONE =====
    { id_zona: 'H753/B1', comune: 'Samone', fascia: 'Centrale', descrizione: 'STRADA PROVINCIALE DA CASTELLAMONTE A IVREA, VIA S.ROCCO' },
    { id_zona: 'H753/R1', comune: 'Samone', fascia: 'Rurale',   descrizione: 'NORD-SUD-OVEST' },
    // ===== STRAMBINO =====
    { id_zona: 'I970/B1', comune: 'Strambino', fascia: 'Centrale',     descrizione: 'CENTRO STORICO C.SO VITTORIO EMANUELE, VIA UMBERTO I, VIA CAVOUR' },
    { id_zona: 'I970/C1', comune: 'Strambino', fascia: 'Semicentrale', descrizione: 'STRADA COMUNALE DI CROTTE' },
    { id_zona: 'I970/D1', comune: 'Strambino', fascia: 'Periferica',   descrizione: 'FRAZIONE CROTTE' },
    { id_zona: 'I970/D2', comune: 'Strambino', fascia: 'Periferica',   descrizione: 'FRAZIONE CERONE REALIZIO' },
    { id_zona: 'I970/E1', comune: 'Strambino', fascia: 'Suburbana',    descrizione: 'STRADA COMUNALE DELLA CHIUSELLA' },
    { id_zona: 'I970/E2', comune: 'Strambino', fascia: 'Suburbana',    descrizione: 'FRAZIONE CARRONE' },
    { id_zona: 'I970/R1', comune: 'Strambino', fascia: 'Rurale',       descrizione: 'NORD-EST-SUD' },
  ]);

  console.log('[SEED] ✅ 01_zones — inserite 57 zone OMI');
}
