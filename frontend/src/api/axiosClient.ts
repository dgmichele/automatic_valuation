/**
 * axiosClient.ts — Istanza Axios centralizzata.
 *
 * Configura:
 * - baseURL da variabile d'ambiente VITE_API_BASE_URL
 * - Timeout di 10 secondi
 * - Interceptor di risposta: normalizza gli errori del backend
 *   (formato { success: false, error: { code, message } }) in
 *   errori Axios arricchiti con proprietà `code` e `message` standard.
 */
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // es. http://localhost:3000/api
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Interceptor risposta: estrae il codice errore dal body backend ──────────
apiClient.interceptors.response.use(
  // Passthrough per le risposte di successo
  (response) => response,

  // Normalizzazione degli errori
  (error) => {
    // Se il server ha risposto con un body AppError strutturato
    const serverError = error?.response?.data?.error;
    if (serverError?.code) {
      // Arricchisce l'errore Axios con il codice e il messaggio del backend
      error.code = serverError.code;
      error.message = serverError.message ?? error.message;
    }
    return Promise.reject(error);
  },
);

export default apiClient;
