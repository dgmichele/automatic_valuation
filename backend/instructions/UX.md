# SCENARIO DI ESEMPIO: utente vuole valutare un appartamento in Via Palestro 3, Ivrea.

## STEP 1 — Landing page: input indirizzo

L'utente digita "Via Palestro 3, Ivrea" nell'input della landing page Wordpress. Nominatim restituisce i suggerimenti, l'utente seleziona quello corretto. Il browser ha ora:
lat: 45.4654, lon: 7.8732, address: "Via Palestro 3, Ivrea"
Click su "Valuta" → redirect a:
valutazione.bichimmobiliare.it?lat=45.4654&lon=7.8732&address=Via Palestro 3, Ivrea

## STEP 2 — Backend: lookup geografico immediato

All'arrivo della request, Express legge i parametri e Turf.js esegue booleanPointInPolygon sulle 19 zone del GeoJSON. Trova che le coordinate cadono nella zona E379/B1. Questo viene salvato in sessione:
javascriptsession.zona = "E379/B1"
session.address = "Via Palestro 3, Ivrea"
L'utente vede il primo step del form, salvo errori.

## STEP 3 — Multi-step form: raccolta dati

Il form raccoglie in sequenza. Le scelte dell'utente in questo esempio:

Destinazione → Residenziale
Tipologia → Appartamento
Superficie → 80 mq
Piano → 3° piano
Ascensore → Assente
Box → Presente
Giardino → Assente
Terrazzo → Assente
Balcone → 1
Bagno → 1
Stato conservativo → In buono stato

Poiché la tipologia è Appartamento, il frontend mostra tutti i campi pertinenti. Al termine dell'ultimo step, il frontend invia al backend un payload JSON:
json{
"destinazione": "Residenziale",
"tipologia": "Appartamento",
"mq": 80,
"parametri": {
"Ascensore": "Assente > 2°piano",
"Box": "Presente",
"Giardino": "Assente",
"Terrazzo": "Assente",
"Balcone": "1",
"Bagno": "1",
"Stato": "In buono stato"
}
}

## STEP 4 — Backend: query al database

Il backend esegue due query tramite Knex.js.
Prima query — Tabella Zone OMI: recupera il valore base al mq.
javascriptconst valoreBase = await knex('zone_omi')
.where({ id_zona: 'E379/B1', destinazione: 'Residenziale', tipologia: 'Appartamento' })
.first()

// Risultato: { min_mq: 1300, max_mq: 1400 }
Seconda query — Tabella Coefficienti: recupera tutti i coefficienti applicabili a questa tipologia, filtrati per i parametri che l'utente ha dichiarato.
javascriptconst coefficienti = await knex('coefficienti')
.where({ destinazione: 'Residenziale' })
.whereIn('tipologia', ['Appartamento', 'ALL'])
.whereIn('parametro', Object.values(payload.parametri))
Il database restituisce esattamente queste righe:
CategoriaParametroCoefficienteAscensoreAssente > 2°piano0.85BoxPresente1.00GiardinoAssente1.00TerrazzoAssente1.00Balcone11.00Bagno11.00StatoIn buono stato1.00

## STEP 5 — Backend: calcolo

Il backend moltiplica tutti i coefficienti tra loro per ottenere il moltiplicatore complessivo:
javascriptconst moltiplicatore = coefficienti.reduce((acc, c) => acc _ c.coefficiente, 1)
// 0.85 × 1.00 × 1.00 × 1.00 × 1.00 × 1.00 × 1.00 = 0.85
Poi applica il moltiplicatore ai valori base e alla superficie:
javascriptconst prezzoMin = valoreBase.min_mq _ mq _ moltiplicatore
const prezzoMax = valoreBase.max_mq _ mq \* moltiplicatore
// prezzoMin = 1250 × 80 × 0.85 = 85.000€
// prezzoMax = 1350 × 80 × 0.85 = 91.800€
Il backend restituisce al frontend:
json{
"min": 85000,
"max": 91800,
"zona": "E379/B1",
"descrizione": "Centro Storico - Ivrea"
}

STEP 6 — Frontend: output
Il frontend mostra il risultato:

"Il valore stimato del tuo appartamento in Via Palestro 3, Ivrea è tra 85.000€ e 91.800€"

Seguito dalla CTA: richiesta di contatto, invio a MailerLite, eventuale download PDF.

Il flusso è completo, coerente e senza buchi. Siamo pronti per sviluppare. Da dove partiamo?

## EDGE CASE - box auto in centro (solo a Ivrea)

Verra così gestito direttamente nel codice, non ha senso complicare la logica database driven:

```javascript
let bonus = 0;
if (zone === "E379/B1" && params.Box === "Presente") {
  bonus = 15000;
}

const minPrice = baseValue.min_mq * mq * multiplier + bonus;
const maxPrice = baseValue.max_mq * mq * multiplier + bonus;
```

## PAGINA DI FALLBACK

L'idea è avere una Pagina di fallback unica; in pratica quando l'utente atterra direttamente su valutazione.bichimmobiliare.it senza parametri URL validi (niente lat/lon, oppure coordinate che non matchano nessuna zona OMI), si mostra una pagina così composta:

- Titolo: "Inizia la tua valutazione"
- Sottotitolo: "Per continuare, inserisci un indirizzo"
- Input indirizzo con autocomplete Nominatim (identico a quello della landing page)
- Pulsante "Valuta"

Essenzialmente è una duplicazione dell'input della landing page, ma integrata nell'app. Così qualunque utente che arrivi direttamente in app, che torni dalla cronologia, che reinserisca dopo "Modifica indirizzo" vede sempre la stessa interfaccia coerente per partire. Il backend, al ricevimento del click "Valuta", fa il lookup geografico e se la zona viene trovata, procede naturalmente al primo step del form. Se la zona non esiste, mostra un toast di errore e fa rimanere l'utente sulla pagina di input.
