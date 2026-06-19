/**
 * App.tsx — Root dell'applicazione.
 *
 * Responsabilità (Fase 2):
 * - Legge lat, lon, address dai query params all'avvio
 * - Se mancanti/non numerici → non abilita il lookup → FallbackPage (route "/")
 * - Se presenti → useGeoLookup chiama GET /api/geo/lookup:
 *     200 OK        → salva zona nello store + redirect /form/step-1
 *     404 OUTSIDE_AREA → redirect a "/" con state { outsideArea: true }
 *     errore generico → toast + redirect a "/"
 * - Durante il lookup: mostra un overlay skeleton a schermo intero
 */
import { Outlet, useSearchParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useGeoLookup } from './hooks/useGeoLookup';

const App = () => {
  const [searchParams] = useSearchParams();

  // Estrae lat, lon, address dai query params
  const rawLat = searchParams.get('lat');
  const rawLon = searchParams.get('lon');
  const address = searchParams.get('address');

  const lat = rawLat ? parseFloat(rawLat) : null;
  const lon = rawLon ? parseFloat(rawLon) : null;

  // Lookup abilitato solo se tutti i parametri sono presenti e validi
  const hasValidParams =
    lat !== null &&
    lon !== null &&
    !isNaN(lat) &&
    !isNaN(lon) &&
    Boolean(address);

  // Hook che gestisce internamente redirect, toast ed errori
  const { isLoading } = useGeoLookup({
    lat: hasValidParams ? lat : null,
    lon: hasValidParams ? lon : null,
    address: hasValidParams ? address : null,
  });

  return (
    <>
      {/* Toaster globale — stile coerente col branding */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: '#1e1e1e',
          },
          success: {
            iconTheme: { primary: '#b41c3c', secondary: '#fffbfc' },
          },
          error: {
            iconTheme: { primary: '#b41c3c', secondary: '#fffbfc' },
          },
        }}
      />

      {/*
       * Overlay di caricamento durante il geo-lookup iniziale.
       * Copre l'intera viewport con z-50 per evitare flash di FallbackPage
       * nei millisecondi prima che useGeoLookup esegua il redirect.
       */}
      {isLoading ? (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-field"
          role="status"
          aria-label="Ricerca zona in corso"
        >
          {/* Skeleton animato — placeholder per il form step */}
          <div className="w-full max-w-md px-6 space-y-4 animate-pulse">
            <div className="h-6 rounded-lg bg-brand-border w-3/4 mx-auto" />
            <div className="h-4 rounded-lg bg-brand-border w-1/2 mx-auto" />
            <div className="mt-8 space-y-3">
              <div className="h-12 rounded-xl bg-brand-border" />
              <div className="h-12 rounded-xl bg-brand-border w-5/6" />
              <div className="h-12 rounded-xl bg-brand-border w-4/6" />
            </div>
          </div>
          <p className="mt-6 font-sans text-sm text-brand-placeholder">
            Ricerca zona in corso…
          </p>
        </div>
      ) : (
        /* Outlet renderizza la pagina corrispondente alla route corrente */
        <Outlet />
      )}
    </>
  );
};

export default App;
