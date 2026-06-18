/**
 * Messaggi di feedback standardizzati per toast e notifiche utente.
 * Usare sempre queste costanti invece di stringhe inline.
 */

export interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export const TOAST_MESSAGES = {
  GEO_OUTSIDE_AREA: {
    type: 'warning',
    title: 'Fuori zona',
    message: "L'indirizzo inserito non è nella nostra area di competenza.",
  },
  GEO_NOT_FOUND: {
    type: 'error',
    title: 'Indirizzo non trovato',
    message: "Non è stato possibile localizzare l'indirizzo inserito.",
  },
  VALUATION_SUCCESS: {
    type: 'success',
    title: 'Valutazione inviata!',
    message: 'Controlla la tua casella email!',
  },
  GENERIC_ERROR: {
    type: 'error',
    title: 'Errore',
    message: 'Qualcosa è andato storto, riprova più tardi.',
  },
} as const satisfies Record<string, ToastMessage>;
