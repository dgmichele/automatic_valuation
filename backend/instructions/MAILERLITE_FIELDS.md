# Mailerlite — Mappatura Campi

Group: **Valutazione automatica**
Group ID: `187453353369798040`

---

## Mappatura Backend → Mailerlite

| Dato del backend | Field Mailerlite    | Variabile Mailerlite  |
| ---------------- | ------------------- | --------------------- |
| `first_name`     | Name                | `$name`               |
| `last_name`      | Last name           | `$last_name`          |
| `phone`          | Phone               | `$phone`              |
| `address`        | Via                 | `$via`                |
| `property_type`  | Tipologia immobile  | `$tipologia_immobile` |
| `sqm`            | Metri quadrati      | `$metri_quadrati`     |
| `condition`      | Condizioni immobile | `$stato_immobile`     |
| `rooms`          | Locali              | `$locali`             |
| `bathrooms`      | Bagni               | `$bagni`              |
| `floor`          | Piano               | `$piano`              |
| `energy_class`   | Classe energetica   | `$classe_energetica`  |
| `heating`        | Riscaldamento       | `$riscaldamento`      |
| `elevator`       | Ascensore           | `$ascensore`          |
| `balconies`      | Balconi             | `$balconi`            |
| `terrace`        | Terrazzo            | `$terrazzo`           |
| `box`            | Garage              | `$garage`             |
| `garden`         | Giardino            | `$giardino`           |
| `windows`        | Vetrine             | `$vetrine`            |
| `intent`         | Richieste per:      | `$richieste_per`      |
| `avg_value`      | Valutazione media   | `$valutazione_media`  |

---

## Note

- `elevator`, `terrace`, `box`, `garden` sono booleani nel DB: vanno convertiti in stringa `"Sì"` / `"No"` prima di inviarli a Mailerlite.
- `avg_value` è un numero intero (es. `88400`): va formattato come stringa leggibile (es. `"€ 88.400"`) prima dell'invio.
- `windows` è nullable: inviare solo se presente (immobili di tipo Negozio).
- Il campo `email` è l'identificatore principale del subscriber in Mailerlite e non va incluso nei `fields` ma nel campo dedicato `email` della chiamata API.
- Se il subscriber esiste già (stessa email), Mailerlite aggiorna i campi anziché creare un duplicato.
