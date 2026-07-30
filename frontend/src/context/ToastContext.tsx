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
  showError: (message: string) => void;
  /** Mostra un toast di successo. */
  showSuccess: (message: string) => void;
  /** Mostra un toast di avviso. */
  showWarning: (message: string) => void;
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
  const showError = (message: string) => {
    toast.error(message);
  };

  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showWarning = (message: string) => {
    // react-hot-toast non ha un tipo "warning" nativo:
    // usiamo toast() custom con icona e stile coerente al branding.
    toast(message, {
      icon: '⚠️',
      style: {
        background: '#fffbfc',
        color: '#1e1e1e',
        border: '1px solid #f5a623',
      },
    });
  };

  return (
    <ToastContext.Provider value={{ showError, showSuccess, showWarning }}>
      {children}
    </ToastContext.Provider>
  );
};
