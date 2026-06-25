/**
 * ErrorScreen.tsx — Schermata di errore con CTA per riprovare.
 *
 * Usata per due scenari:
 * - Indirizzo fuori area (OUTSIDE_AREA): messaggio specifico
 * - Errore generico: messaggio generico
 *
 * Presenta sempre un pulsante "Riprova con un altro indirizzo"
 * che redirige a FallbackPage ("/").
 */
import { useNavigate } from 'react-router-dom';
import { MdLocationOff, MdErrorOutline } from 'react-icons/md';

interface ErrorScreenProps {
  /** Tipo di errore: determina icona e testo mostrati */
  variant: 'outside-area' | 'generic';
  /** Callback opzionale per gestire il pulsante di riprova in locale */
  onRetry?: () => void;
}

const ERROR_CONTENT = {
  'outside-area': {
    Icon: MdLocationOff,
    title: 'Zona non coperta',
    description:
      "L'indirizzo inserito non rientra nell'area di competenza di Bich Immobiliare. Al momento offriamo il servizio di valutazione nella zona del Canavese.",
  },
  generic: {
    Icon: MdErrorOutline,
    title: 'Qualcosa è andato storto',
    description:
      'Si è verificato un errore durante la ricerca della zona. Riprova con un altro indirizzo.',
  },
} as const;

const ErrorScreen = ({ variant, onRetry }: ErrorScreenProps) => {
  const navigate = useNavigate();
  const { Icon, title, description } = ERROR_CONTENT[variant];

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      // Torna alla FallbackPage pulita (senza state di errore)
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
      {/* Icona errore */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-border">
        <Icon className="h-10 w-10 text-brand-primary" aria-hidden="true" />
      </div>

      {/* Titolo */}
      <h2 className="font-sans text-xl font-bold text-brand-dark mb-3">
        {title}
      </h2>

      {/* Descrizione */}
      <p className="font-sans text-sm text-brand-paragraph max-w-sm mb-8">
        {description}
      </p>

      {/* CTA */}
      <button
        id="error-screen-retry-btn"
        type="button"
        onClick={handleRetry}
        className="rounded-lg bg-brand-primary px-6 py-3 font-sans text-sm font-semibold text-brand-field transition duration-300 hover:bg-brand-dark cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
      >
        Riprova con un altro indirizzo
      </button>
    </div>
  );
};

export default ErrorScreen;
