# AGENTS.md — Backend Instructions

## 1. Panoramica del Progetto

Backend API RESTful per un sistema di **valutazione automatica immobiliare** nel Canavese. Riceve i dati dell'immobile dal frontend, calcola una forbice di valore tramite le tabelle OMI e i coefficienti di correzione, invia la valutazione via email all'utente (Resend) e registra il lead nel CRM (Mailerlite).

**Obiettivo:** API leggera, sicura e senza autenticazione utente — esposta al pubblico tramite endpoint protetti da rate limiting.

---

## 2. Principi Guida

- **Linguaggio:** TypeScript, ES6+, sempre `async/await`
- **Naming:** Inglese per tutto (variabili, funzioni, file, cartelle)
- **Struttura:** NO cartella `src/`. Il file `server.ts` è nella root del progetto
- **Separazione:** Routes → Controllers → Services → Database
- **HTTP Status:** Coerenti con messaggi esplicativi in ogni risposta
- **Logging:** `console.log()` nei punti critici + Winston su file
- **Environment:** `.env.dev` (localhost + pgAdmin locale) e `.env.production` (Netsons/cPanel)
- **Commenti:** Sempre presenti, in italiano, compatti ma dettagliati
- **Cartella inspiration-files:** Contiene file di esempio e spunti da consultare per facilitare lo sviluppo, non devono essere inclusi nel progetto finale.

---

## 3. Stack Tecnologico

- **Core:** Node.js, Express, TypeScript, PostgreSQL, Knex.js
- **Sicurezza:** CORS, express-rate-limit, Helmet, Zod
- **Geospaziale:** Turf.js (`@turf/boolean-point-in-polygon`), node-fetch
- **Email:** Resend API, React Email
- **CRM:** Mailerlite API (HTTP fetch)
- **Logging:** Winston
- **Dev Tools:** nodemon, ts-node, cross-env, dotenv
- **Testing:** Jest, Supertest

---

## 4. Struttura Progetto

```
backend/
├── __tests__/
│   ├── integration/
│   │   ├── geo.test.ts
│   │   ├── valuation.test.ts
│   │   └── setup.ts
│   └── unit/
│       └── valuation.test.ts
├── config/
│   └── db.ts
├── controllers/
│   ├── geo.controller.ts
│   └── valuation.controller.ts
├── data/
│   └── polygons.json          ← GeoJSON zone OMI, caricato in memoria all'avvio
├── db/
│   ├── migrations/
│   ├── seeds/
│   │   ├── 01_zones.ts        ← dati da TABLES.md
│   │   ├── 02_omi_values.ts   ← dati da TABLES.md
│   │   └── 03_coefficients.ts ← dati da TABLES.md
│   └── knexfile.ts
├── emails/
│   └── ValuationEmail.tsx
├── logs/
├── middleware/
│   ├── errorHandler.middleware.ts
│   └── rateLimiter.middleware.ts
├── routes/
│   ├── geo.routes.ts
│   └── valuation.routes.ts
├── services/
│   ├── geo.service.ts
│   ├── valuation.service.ts
│   ├── email.service.ts
│   ├── crm.service.ts
│   └── logger.service.ts
├── types/
│   ├── valuation.ts
│   └── shared.ts
├── utils/
│   ├── AppError.ts
│   └── errorHandler.ts
├── inspiration-files/
├── .env.dev
├── .env.production
├── jest.config.js
├── package.json
├── server.ts
└── tsconfig.json
```

---

## 5. Database Schema

Configura `knexfile.ts` tramite `npx knex init -x ts`.

I dati per i seed si trovano nel file `TABLES.md` del progetto (zone anagrafica, valori OMI, coefficienti). I seed vanno eseguiti nell'ordine: `01_zones` → `02_omi_values` → `03_coefficients` per rispettare le FK.

### `zones`

```sql
id_zona       VARCHAR(12) PRIMARY KEY,  -- es. "E379/B1"
comune        VARCHAR(100),
fascia        VARCHAR(20),              -- Centrale, Semicentrale, Periferica, Suburbana, Rurale
descrizione   TEXT
```

### `omi_values`

```sql
id            SERIAL PRIMARY KEY,
id_zona       VARCHAR(12) REFERENCES zones(id_zona),
destinazione  VARCHAR(20),             -- Residenziale | Commerciale
tipologia     VARCHAR(50),
min_price     DECIMAL(10,2),
max_price     DECIMAL(10,2)
```

### `correction_coefficients`

```sql
id            SERIAL PRIMARY KEY,
destinazione  VARCHAR(20),
tipologia     VARCHAR(50),             -- oppure 'ALL'
categoria     VARCHAR(30),             -- Ascensore, Box, Giardino, Stato, ecc.
parametro     VARCHAR(50),             -- es. "Presente", "Assente > 2°piano"
coefficiente  DECIMAL(5,3)
```

### `valuations`

```sql
id              SERIAL PRIMARY KEY,
lat             DECIMAL(10,7),
lon             DECIMAL(10,7),
address         TEXT,
id_zona         VARCHAR(12) REFERENCES zones(id_zona),
property_type   VARCHAR(50),
sqm             INTEGER,
condition       VARCHAR(30),
rooms           VARCHAR(10),
bathrooms       VARCHAR(10),
floor           VARCHAR(10),
build_year      INTEGER,               -- nullable
energy_class    VARCHAR(10),
heating         VARCHAR(20),
elevator        BOOLEAN,
balconies       VARCHAR(10),
terrace         BOOLEAN,
box             BOOLEAN,
garden          BOOLEAN,
min_value       DECIMAL(12,2),
max_value       DECIMAL(12,2),
avg_value       DECIMAL(12,2),
first_name      VARCHAR(100),
last_name       VARCHAR(100),
email           VARCHAR(255),
phone           VARCHAR(30),
intent          VARCHAR(100),
email_sent      BOOLEAN DEFAULT false,
crm_synced      BOOLEAN DEFAULT false,
created_at      TIMESTAMP DEFAULT NOW()
```

---

## 6. Flusso UX Completo (riferimento per lo sviluppo)

### Pagina di fallback (ingresso diretto senza parametri)

Se l'utente atterra su valutazione.bichimmobiliare.it senza lat/lon validi nei query params (parametri assenti, malformati o non numerici), l'app mostra una pagina di fallback invece del form. Composizione: titolo "Inizia la tua valutazione", sottotitolo "Per continuare, inserisci un indirizzo", input indirizzo con autocomplete Nominatim identico alla landing (house_number obbligatorio, debounce 400ms), pulsante "Valuta". Al click, l'app chiama GET /api/geo/lookup — se la zona è valida, reindirizza al primo step del form aggiornando i query params. Se fuori area o non trovata, toast di errore inline e l'utente rimane sulla pagina di fallback.

### Landing page (Wordpress — JS vanilla, separato dall'app React)

Input con debounce 400ms su Nominatim (`countrycodes=it`, `viewbox` Eporediese). Tendina con suggerimenti: **mostrati solo i risultati con `house_number`** — senza civico il risultato non è selezionabile e "Valuta" resta disabilitato. Al click redirect verso:

```
valutazione.bichimmobiliare.it?lat=45.4654&lon=7.8732&address=Via Palestro 3, Ivrea
```

Dal punto di vista backend è trasparente: il server riceve solo i query params.

### App React — arrivo

L'app legge `lat`, `lon`, `address` dai query params e chiama immediatamente `GET /api/geo/lookup`. Se la zona è valida, l'utente vede il primo step del form con la targhetta indirizzo in cima. Se fuori area → schermata di errore con CTA "Riprova con un altro indirizzo".

### Modifica indirizzo durante il form

Popup con **un unico campo testo** (Nominatim + debounce + `house_number` obbligatorio). Al salvataggio viene ri-chiamato `GET /api/geo/lookup` — se fuori area, errore inline nel popup prima di chiuderlo.

### Submit finale

Al click su "Scopri il valore" viene chiamato `POST /api/valuations` con tutti i dati form + `lat`/`lon`/`address` + lead. Il backend risponde con la forbice.

---

## 7. API Endpoints

Base path: `/api`

### `GET /api/geo/lookup`

Chiamato in due momenti: all'arrivo sull'app e ad ogni modifica dell'indirizzo. Non salva nulla su DB.

**Query params:** `lat` (number), `lon` (number)

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "id_zona": "E379/B1",
    "comune": "Ivrea",
    "fascia": "Centrale",
    "descrizione": "CENTRO STORICO - V.PALESTRO - V.ARDUINO - BORGHETTO"
  }
}
```

**Errori:**

- `400` — `lat` o `lon` mancanti o non numerici
- `404` — Coordinate fuori da tutte le zone (`OUTSIDE_AREA`)

**Rate limit:** 30 richieste / 15 min per IP.

**Note:** Questo endpoint è chiamato in tre momenti: (1) arrivo sull'app con parametri validi, (2) modifica indirizzo dal popup, (3) submit dalla pagina di fallback.

---

### `POST /api/valuations`

Endpoint principale. Riceve tutti i dati del form + lead, esegue il calcolo, salva, invia email e sincronizza CRM.

**Body (Zod schema):**

```typescript
{
  lat: number,
  lon: number,
  address: string,
  property_type: 'Appartamento' | 'Villa / Indipendente' | 'Casa semi-indipendente' | 'Ufficio' | 'Negozio',
  sqm: number,
  condition: 'Nuova costruzione' | 'Ristrutturato' | 'In buono stato' | 'Non ristrutturato',
  rooms: string,
  bathrooms: '1' | '2' | '3' | '3+',
  floor: string,
  build_year?: number,
  energy_class: string,
  heating: 'Autonomo' | 'Centralizzato' | 'Assente',
  elevator: boolean,
  balconies: '0' | '1' | '2+',
  terrace: boolean,
  box: boolean,
  garden: boolean,
  intent: string,
  first_name: string,
  last_name: string,
  email: string,
  phone: string
}
```

**Flusso controller:**

1. Validazione Zod
2. `geo.service.identifyZone(lat, lon)` → `id_zona`
3. `valuation.service.calculateValuation(id_zona, payload)` → `{ min_value, max_value, avg_value }`
4. Insert in `valuations`
5. `Promise.allSettled([email.service.send(...), crm.service.sync(...)])` — non bloccante
6. Aggiorna `email_sent` / `crm_synced` in base all'esito
7. Risposta `201`

**Response `201`:**

```json
{
  "success": true,
  "data": {
    "min_value": 85000,
    "max_value": 91800,
    "avg_value": 88400
  }
}
```

**Errori:**

- `400` — Validazione Zod fallita
- `404` — Fuori area (`OUTSIDE_AREA`)
- `500` — Errore generico

**Rate limit:** 10 richieste / 15 min per IP.

---

### `GET /health`

Risponde `200 OK` con `{ status: "ok", timestamp }`.

---

## 8. Logica di Calcolo (`valuation.service.ts`)

**Step 1 — Valore base OMI:**

```typescript
const baseValue = await knex("omi_values")
  .where({ id_zona, destinazione, tipologia })
  .first();
// → { min_price, max_price }
```

**Step 2 — Costruzione array parametri dal payload:**

Il service mappa i campi del payload nei parametri esatti presenti in `correction_coefficients.parametro`. Logica per categoria:

- **Stato:** diretto dal campo `condition` (es. `"In buono stato"`)
- **Ascensore** (solo Appartamento e Ufficio):
  - `elevator === true` → `"Presente"`
  - `elevator === false` e piano > 1° → `"Assente > 1°piano"`
  - `elevator === false` e piano > 2° → `"Assente > 2°piano"`
  - Piano terra o più livelli → categoria non applicata
- **Box, Giardino, Terrazzo:** `"Presente"` o `"Assente"` dal booleano
- **Balcone:** `"Assente - piano terra"` / `"Assente - altri piani"` / `"1"` / `"2+"`
- **Bagno:** `"1"` o `"2+"` da `bathrooms`
- **Vetrine** (solo Negozio): mapping da campo dedicato

Coefficienti applicati per tipologia:

- **Appartamento:** Stato, Ascensore, Box, Giardino, Terrazzo, Balcone, Bagno
- **Villa / Indipendente:** Stato, Giardino, Terrazzo, Balcone, Bagno
- **Casa semi-indipendente:** Stato, Giardino, Terrazzo, Balcone, Bagno
- **Ufficio:** Stato, Ascensore, Box, Balcone, Bagno
- **Negozio:** Stato, Vetrine

**Step 3 — Query coefficienti e moltiplicatore:**

```typescript
const coefficients = await knex("correction_coefficients")
  .where({ destinazione })
  .whereIn("tipologia", [tipologia, "ALL"])
  .whereIn("parametro", paramsArray);

const multiplier = coefficients.reduce((acc, c) => acc * c.coefficiente, 1);
```

**Step 4 — Forbice finale + edge case:**

```typescript
// Edge case: bonus box auto in centro storico Ivrea (hardcoded, non in DB)
let bonus = 0;
if (id_zona === "E379/B1" && box === true) {
  bonus = 15000;
}

const minValue = Math.round(baseValue.min_price * sqm * multiplier + bonus);
const maxValue = Math.round(baseValue.max_price * sqm * multiplier + bonus);
const avgValue = Math.round((minValue + maxValue) / 2);
```

---

## 9. `geo.service.ts` e `polygons.json`

Il file `data/polygons.json` è un `FeatureCollection` GeoJSON con una `Feature` per ogni zona OMI. Struttura `properties` attesa:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { ... },
      "properties": { "name": "ALBIANO D'IVREA - Zona OMI B1" }
    },
    {
      "type": "Feature",
      "geometry": { ... },
      "properties": { "name": "BANCHETTE - Zona OMI R1" }
    }
  ]
}
```

Il service mappa `properties.name` → `id_zona` tramite una lookup table (es. `"ALBIANO D'IVREA - Zona OMI B1"` → `"A157/B1"`). Il GeoJSON viene caricato **una sola volta** in memoria all'avvio del server in `server.ts` e passato al service come dipendenza, per evitare I/O ripetuti ad ogni request.

`identifyZone(lat, lon)`: itera le features con `booleanPointInPolygon`. Prima feature che contiene il punto → restituisce i dati della zona dal DB. Nessuna feature trovata → `AppError(404, 'OUTSIDE_AREA')`.

---

## 10. Servizi

- **`geo.service.ts`** — `identifyZone(lat, lon)`: Turf.js lookup → dati zona o errore
- **`valuation.service.ts`** — `calculateValuation(id_zona, payload)`: step 1–4 sopra
- **`email.service.ts`** — `sendValuationEmail(to, data)`: Resend API + template React Email
- **`crm.service.ts`** — `syncToMailerlite(leadData, valuationData)`: HTTP POST a Mailerlite con custom fields configurati via env
- **`logger.service.ts`** — Winston: `combined.log` + `error.log`. Dev: console colorata + file. Prod: solo file.

---

## 11. Middleware

- **`rateLimiter.middleware.ts`**: rate limit differenziato per endpoint (vedi §7)
- **`errorHandler.middleware.ts`**: gestisce `AppError` + errori non gestiti. Nessuno stack trace in produzione. Log automatico: 4xx → `logWarn`, 5xx → `logError`

---

## 12. Email Template (`ValuationEmail.tsx`)

- Logo aziendale
- Indirizzo immobile valutato
- **Valore medio** in grande (es. `€ 88.400`)
- Valori min e max più piccoli sotto (es. `min: € 85.000 — max: € 91.800`)
- CTA contatto agenzia
- Footer con dati agenzia

---

## 13. Variabili d'Ambiente

### `.env.dev`

```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bich_valutazione
DB_USER=postgres
DB_PASSWORD=...
RESEND_API_KEY=...
RESEND_FROM_EMAIL=valutazioni@bichimmobiliare.it
MAILERLITE_API_KEY=...
MAILERLITE_GROUP_ID=...
CORS_ORIGIN=http://localhost:5173
```

### `.env.production`

```
NODE_ENV=production
PORT=3000
DB_HOST=...
DB_PORT=5432
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
RESEND_API_KEY=...
RESEND_FROM_EMAIL=valutazioni@bichimmobiliare.it
MAILERLITE_API_KEY=...
MAILERLITE_GROUP_ID=...
CORS_ORIGIN=https://valutazione.bichimmobiliare.it
```

---

## 14. Fasi di Sviluppo

### Fase 1 — Setup base

- Init TypeScript + Express + Knex
- Migrations: `zones`, `omi_values`, `correction_coefficients`, `valuations`
- Seeds da `TABLES.md` (ordine obbligatorio: zones → omi_values → coefficients)
- Health check endpoint

### Fase 2 — Geo + calcolo

- `geo.service` con Turf.js + caricamento `polygons.json` in memoria all'avvio
- `valuation.service` con logica coefficienti completa + edge case box Ivrea centro
- Test unitari calcolo (Jest): verificare esempio concreto §8

### Fase 3 — Endpoints

- `GET /api/geo/lookup` + test Supertest
- `POST /api/valuations` completo + test Supertest

### Fase 4 — UX Entry & Fallback

- Logica di intercettazione query params (`lat`, `lon`, `address`) all'init dell'app.
- Implementazione Pagina di Fallback: input Nominatim + button "Valuta" per ingressi diretti.
- Integrazione con `GET /api/geo/lookup` per validazione zona e redirect al primo step del form.
- Gestione dello stato "fuori area" con feedback utente (toast/alert).

### Fase 5 — Email + CRM

- Template `ValuationEmail.tsx` con React Email
- `email.service` → Resend
- `crm.service` → Mailerlite
- Test invio manuale

### Fase 6 — Sicurezza & Deploy

- Rate limiting, Helmet, CORS per produzione
- Winston logging
- Migrations + seeds su Netsons (phpPgAdmin)
- Test end-to-end

---

## 15. Best Practices

- **Email e CRM non bloccanti:** `Promise.allSettled` dopo la risposta al client; loggare eventuali fallimenti
- **Poligoni:** caricati una volta in memoria all'avvio, non riletti ad ogni request
- **Zod:** validare tutto l'input prima di qualsiasi elaborazione
- **Migrations:** mai modificare quelle già eseguite in produzione — sempre nuova migration
- **Console.log:** in ogni punto critico (geo lookup, coefficienti applicati, calcolo finale, email, CRM)
- **Edge case box Ivrea:** logica hardcoded in `valuation.service`, non guidata da DB

---

**Fine PRD Backend**
