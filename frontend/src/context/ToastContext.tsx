/**
 * ToastContext.tsx — Context centralizzato per tutti i toast dell'applicazione.
 *
 * Espone un hook `useToast()` con metodi:
 *   - showError(msg)   → toast rosso di errore
 *   - showSuccess(msg) → toast verde di successo
 *   - showWarning(msg) → toast giallo di avviso
 *
 * Internamente delega a react-hot-toast, che rimane l'unico punto
 * di import della libreria nel codebase (insieme al <Toaster> in App.tsx).
 *
 * I messaggi di errore dal backend vengono passati così come sono,
 * senza riscritture, per massima chiarezza UX.
 */
import { createContext, useContext } from 'react';
import toast from 'react-hot-toast';

interface ToastContextValue {
  /** Mostra un toast di errore con il messaggio fornito (di solito dal backend). */
  showError: (message: string, id?: string) => void;
  /** Mostra un toast di successo. */
  showSuccess: (message: string, id?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Hook per accedere ai metodi toast da qualsiasi componente o hook.
 * Deve essere usato dentro un albero avvolto da <ToastProvider>.
 */
export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast deve essere usato dentro <ToastProvider>');
  }
  return ctx;
};

/**
 * Provider da inserire nell'albero React (in App.tsx, sotto il Router).
 * Non renderizza nulla di visibile: il <Toaster> rimane in App.tsx.
 */
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const showError = (message: string, id?: string) => {
    // Usiamo id o message come id per far sì che react-hot-toast eviti toast duplicati identici
    toast.error(message, { id: id || message });
  };

  const showSuccess = (message: string, id?: string) => {
    toast.success(message, { id: id || message });
  };

  // test toast in console
  (window as any).toast = { showError, showSuccess };

  return (
    <ToastContext.Provider value={{ showError, showSuccess }}>
      {children}
    </ToastContext.Provider>
  );
};
