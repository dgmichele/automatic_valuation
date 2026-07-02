/**
 * FallbackPage.tsx — Pagina di ingresso diretto senza parametri URL validi.
 *
 * Scenari gestiti:
 * 1. Accesso diretto a "/" senza lat/lon → mostra form di inserimento indirizzo
 * 2. Ritorno da useGeoLookup con state { outsideArea: true } → mostra ErrorScreen "fuori area"
 * 3. Errore generico durante lookup (gestito in useGeoLookup) → mostra form (dopo reset a "/")
 *
 * Flusso:
 * - L'utente inserisce l'indirizzo tramite AddressAutocomplete (Nominatim)
 * - Alla selezione valida + click "Valuta": chiama lookupZone direttamente
 *   (non via useGeoLookup, che è per il flusso App.tsx con query params)
 * - Successo → salva geo nello store, redirect a /form/step-1
 * - OUTSIDE_AREA → mostra ErrorScreen "outside-area"
 * - Errore generico → toast errore, rimane sulla pagina
 */
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AddressAutocomplete from '../components/fallback/AddressAutocomplete';
import ErrorScreen from '../components/shared/ErrorScreen';
import { lookupZone } from '../api/geo.api';
import { useValuationStore } from '../store/useValuationStore';
import { TOAST_MESSAGES } from '../types/feedback';
import type { SelectedAddress } from '../hooks/useNominatim';

const FallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setGeo } = useValuationStore();

  // Stato di lookup in corso (disabilita il pulsante "Valuta" durante la chiamata)
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Errore di zona fuori area (mostrato inline, non via toast)
  const [isOutsideArea, setIsOutsideArea] = useState(
    // Se siamo arrivati qui da useGeoLookup con flag outsideArea, lo mostriamo subito
    Boolean((location.state as { outsideArea?: boolean } | null)?.outsideArea),
  );

  /**
   * Gestisce la selezione di un indirizzo valido da AddressAutocomplete.
   * Esegue il lookup zona e, in base al risultato, naviga o mostra errore.
   */
  const handleValidSelect = async (address: SelectedAddress) => {
    setIsSubmitting(true);
    setIsOutsideArea(false);

    try {
      const zona = await lookupZone(address.lat, address.lon);

      // Successo: salva lat, lon, address e zona nello store
      setGeo({
        lat: address.lat,
        lon: address.lon,
        address: address.displayName,
        zona,
      });

      // Redirect al primo step del form
      navigate('/form/step-1', { replace: true });
    } catch (err: unknown) {
      const error = err as { response?: { status?: number }; code?: string };
      const status = error?.response?.status;
      const code = error?.code;

      if (status === 404 || code === 'OUTSIDE_AREA') {
        // Zona fuori area: mostra schermata dedicata inline
        setIsOutsideArea(true);
      } else {
        // Errore generico: toast
        toast.error(
          `${TOAST_MESSAGES.GENERIC_ERROR.title}: ${TOAST_MESSAGES.GENERIC_ERROR.message}`,
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Torna alla form di inserimento dopo aver visto l'ErrorScreen */
  const handleRetryFromError = () => {
    setIsOutsideArea(false);
  };

  // ── Render: schermata fuori area ──────────────────────────────────────────
  if (isOutsideArea) {
    return (
      <div className="flex min-h-screen flex-col">
        {/* Header minimale — solo logo testuale */}
        <header className="border-b border-brand-border bg-brand-field shadow-sm">
          <div className="mx-auto max-w-xl px-4 py-4 text-center">
            <p className="font-serif text-base font-black text-brand-primary tracking-wide">
              Bich Immobiliare
            </p>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-4">
          {/* ErrorScreen gestisce il testo e il pulsante "Riprova" */}
          <div className="w-full max-w-lg">
            <ErrorScreen variant="outside-area" onRetry={handleRetryFromError} />
          </div>
        </main>
      </div>
    );
  }

  // ── Render: form inserimento indirizzo ────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col">
      {/* Overlay semitrasparente per leggibilità */}
      <div className="flex min-h-screen flex-col backdrop-blur-sm">
        {/* Header minimale */}
        <header className="border-b border-white/10 bg-brand-field/90 shadow-sm">
          <div className="mx-auto max-w-xl px-4 py-4 text-center">
            <p className="font-serif text-base font-black text-brand-primary tracking-wide">
              Bich Immobiliare
            </p>
          </div>
        </header>

        {/* Contenuto centrale */}
        <main
          className="flex flex-1 flex-col items-center justify-center px-4 py-12"
          id="fallback-main"
        >
          <div className="w-full max-w-lg rounded-2xl bg-brand-field/95 shadow-2xl backdrop-blur-md px-6 py-10 sm:px-10">
            {/* Titolo */}
            <h1 className="font-serif text-2xl font-black text-brand-dark text-center mb-2">
              Inizia la tua valutazione
            </h1>

            {/* Sottotitolo */}
            <p className="font-sans text-sm text-brand-paragraph text-center mb-8">
              Per continuare, inserisci un indirizzo
            </p>

            {/* AddressAutocomplete — cuore della FallbackPage */}
            <AddressAutocomplete
              onValidSelect={handleValidSelect}
              isSubmitting={isSubmitting}
            />

            {/* Disclaimer zona */}
            <p className="mt-6 text-center font-sans text-xs text-brand-placeholder">
              Il servizio è disponibile per immobili nel Canavese (Ivrea e dintorni).
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FallbackPage;
