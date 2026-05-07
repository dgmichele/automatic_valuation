# Descrizione app

---

## Di cosa si tratta?

Si tratta di un’applicazione che gestisce un sistema di valutazione automatico di un immobile.

## Percorso utente

L’inizio della valutazione inizia sempre con l’inserimento dell’indirizzo da parte dell’utente.

Può iniziare da una landing page ad hoc fatta su Wordpress + Elementor, oppure direttamente sull’app. Ad ogni modo, entrambe le pagine devono fare inserire l’indirizzo (gestito da Nominatim) per permettere all’app di iniziare il flusso.

L’inserimento dell’indirizzo poi viene catturato dal codice, tramite Nominatim che gestisce i suggerimenti automatici nella tendina dell’input. Quindi l’utente sceglie l’opzione fornita dal select, clicca “Valuta” e verrà reinderizzato al sottodominio dell’app.

Dietro le quinte, verrà generato un url di questo tipo: “valutazione.bichimmobiliare.it?lat=45.4654&lon=7.8732&address=Via-Palestro-3-Ivrea” nel momento che l’utente clicca “Valuta”.

L’utente infine, approdato all’interno dell’app, inserisce tutti i dati richiesti nei campi previsti tramite un multi-step form e arrivato alla fine del percorso, deve lasciare i propri recapiti per ottenere la valutazione via email e che verrà inviata entro pochi secondi.

### Ingresso diretto sull’app (fallback)

L'idea è avere una Pagina di fallback unica; in pratica quando l'utente atterra direttamente su valutazione.bichimmobiliare.it senza parametri URL validi (niente lat/lon, oppure coordinate che non matchano nessuna zona OMI), si mostra una pagina così composta:

- Titolo: "Inizia la tua valutazione"
- Sottotitolo: "Per continuare, inserisci un indirizzo"
- Input indirizzo con autocomplete Nominatim (identico a quello della landing page)
- Pulsante "Valuta"

Essenzialmente è una duplicazione dell'input della landing page, ma integrata nell'app. Così qualunque utente che arrivi direttamente in app, che torni dalla cronologia, che reinserisca dopo "Modifica indirizzo" vede sempre la stessa interfaccia coerente per partire. Il backend, al ricevimento del click "Valuta", fa il lookup geografico e se la zona viene trovata, procede naturalmente al primo step del form. Se la zona non esiste, mostra un toast di errore e fa rimanere l'utente sulla pagina di input.

## Multi-step form

Il form viene suddiviso in più parti:

1. **Scelta tipologia tra:**
   - Appartamento
   - Villa
   - Casa semi-indipendente
   - Ufficio
   - Negozio
2. **Caratteristiche immobile:**
   - mq
     [inserire numero]
   - stato conservativo
     Nuova costruzione, Ristrutturato, In buono stato, Da ristrutturare
   - locali
     1, 2, 3, 4, 5, 6, 6+
   - bagni
     1, 2, 3, 3+
   - piano
     1, 2, 3, 4, 5, 6, 7, 8, 9+, Terra, Più livelli
   - anno di costruzione (indicare che non è un problema non saperlo)
     [inserire numero]
   - classe energetica
     A4, A3, A2, A1, A, B, C, D, E, F, G, Non saprei
   - riscaldamento
     Autonomo, Centralizzato, Assente
   - ascensore
     Sì, No
   - balcone
     Nessuno, 1, 2, 2+
   - terrazzo
     Sì, No
   - box
     Sì, No
   - giardino
     Sì, No
3. **Perché stai facendo questa valutazione?**
   1. Opzioni da scegliere:
      - Voglio vendere casa in questo momento
      - Voglio vendere casa nei prossimi mesi
      - Voglio vendere casa entro 1 anno
      - Voglio solo conoscere il valore della mio immobile
      - Sono un adetto ai lavori del settore immobiliare
   2. CTA finale:

      Pulsante → Scopri il valore!

### Targhetta indirizzo

Sopra il multi-step form è sempre presente una targhetta che riprende l’indirizzo completo. È presente un tasto modifica, in modo tale che l’utente può sempre modificare l’indirizzo.

Al click di “modifica”, si apre un popup che permette di far modificare il campo dell’indirizzo. La modifica dell’indirizzo deve avvenire con i campi necessari a rifare il calcolo della latitudine/longitudine a Nominatim e il relativo poligono a Turf.js.

### Pulsanti “Avanti” e “Indietro”

I pulsanti per procedere o retrocedere nel contesto del form dovranno essere sticky-bottom. In quetso modo l’utente sa sempre, a prescindere dal numero di informazioni da dare in pagina, che c’è un passaggio successivo (e che all’evenienza può tornare indietro).

### Barra di caricamento sotto header

Sotto l’header, c’è una barra di caricamento che è sincronizzata all’avanzamento del multi step form.

Ecco come deve comportarsi:

- È “appiccicata” al top all’header;
- Quando l’utente approda sull’app e ovviamente non ha completato alcuno step, la barra non si vede
- La barra deve essere attaccata al left e al right (quindi quando la barra avanza, parte esattamente dal margine sx, quando arriva alla fine, deve essere attaccata al margine dx)

### Gestione edge case/errori multi-step form

- Indirizzo non trovato:
  Dovrà uscire un messaggio in pagina in cui si dice che l’indirizzo non è stato trovato. Sarà presente sotto un pulsante che permette di riprovare con un altro indirizzo (in sostanza, ripartire con il flusso)
- Indirizzo non fa parte dell’area di competenza dell’agenzia:
  Dovrà uscire un messaggio in cui si dice che l’indirizzo in questione non fa parte della nostra area di competenza. Anche qui, dovra esserci un pulsante che permette di riprovare con un altro indirizzo.
- Errori generici:
  Dovranno essere gestiti tramite un sistema di toast di avviso.

## CTA finale

Dopo che l’utente ha concluso il punto 3 del multi-step form ed ha quindi cliccato il pulsante “Scopri il valore”, si aprira una schermata con uno spinner che dice “Stiamo calcolando il valore del tuo immobile in base ai valori dell’Agenzia delle Entrate”.

Lo spinner durerà giusto 3 secondi per simulare il calcolo, dopodiché si aprirà una pagina così composta:

- Titolo: la tua valutazione è pronta
- Valore della valutazione: criptato
- Form per inserimento dati:
  - Nome
  - Cognome
  - Email
  - N° di telefono

Con questo percorso, l’utente è costretto ad inserire i dati richiesti per ricevere la valutazione via email entro pochi secondi.

In questo frangente il sistema ha già eseguito il calcolo; Semplicemente impacchetta la forbice della valutazione all’interno di una email inviata tramite l’API di Resend.

Nel mentre, sarà importante che lo stato di React faccia persistere i dati dell’utente: i dati del multi-step form si devono unire ai dati personali dell’utente forniti in questa fase finale. In questo modo, tutto questo pacchetto di informazioni viene poi mandate al nostro CRM, tramite l’API di Mailerlite.

### Popup di ringraziamento

L’utente che conclude il percorso, viene notificato tramite popup di successo, così composto:

- Titolo: Valutazione inviata!
- Sottotitolo: Che aspetti?! Apri la tua email per scoprirla ora!
- Pulsante di conferma

## Email della valutazione

Dovrà fornire il valore della valutazione in questo modo:

- In grande: Valore medio della forbice
  Esempio → valore minimo: 90.000€, valore massimo 96.000€, valore da mostrare: 93.000€
- Più piccolo sotto: Valori minimi e massimi
  Esempio → min: 90.000€ - max: 96.000€

## Branding & UI:

Vediamo l’UI dell’app abbinata al branding aziendale per i vari elementi:

### Tecnologia:

- Headless UI
- Tailwind CSS (esso dovrà avere la palette colori che segua i colori del brand che vedremo negli elementi sottostanti)

### Background applicazione:

- Immagine statica fornita da me

### Campi:

- background color → #fffbfc
- placeholder → #9c9c9c
- bordi: arrotondati, colore → #f0d6da
- Focus bordi durante click, scrittura all’interno del campo → #d2778a

### Testi:

- titoli (h1, h2) → #1e1e1e; tipografia → Merriweather 900
- titoli (h3 e minori) → #1e1e1e; tipografia → Inter 700
- paragrafi → #5f5f5f; tipografia → Inter 400
- link (a href)→ #b41c3c; tipografia → Inter 700
- diclaimer, paragrafi di minore importanza → #9c9c9c; tipografia → Inter 400
- tipografia generale → #5f5f5f; tipografia → Inter 400

### Barra di caricamento del multi-step form:

- color → #b41c3c

### Header:

- background color card → #fffbfc
- bordi: solo bottom, con ombra leggera

### Pulsanti:

- pulsante primario:
  - background color → #b41c3c; hover → #1e1e1e
  - color: #fffbfc; hover → invariato
- pulsante secondario:
  - background color → nessuno
  - color: #b41c3c; hover → #1e1e1e

### Link (a href):

- color: #b41c3c; hover → #1e1e1e

### Popup:

- background color → #fdf5f7
- Overlay backdrop con background rgba(0,0,0,.8) (deve impedire scorrimento pagina sotto)
- Bordi arrotondati
- Pulsante conferma: vedi pulsante primario in “Pulsanti”
- sticky header (solo per popup aggiunta/modifica):
  - background color → lo stesso del popup
  - titolo sx → vedi titoli (h1, h2) in “Testi”
  - pulsante chiusura dx → #d2778a; hover→ #1e1e1e
  - ombra leggera sotto di esso per staccarlo dal resto del popup

### Transizioni CSS:

Hover in generale: transizioni morbide e smooth, transition: 0.3s ease;

Entrata e uscita popup: transizioni morbide e smooth, fade in (entrata) e fade out (fade out)

## Funzionalità globali:

- Spinner di caricamento globali
- Toast di avviso globali
- Skeleton globale tramite Skeleton.jsx per creare poi uno skeleton dedicato per ogni componente
