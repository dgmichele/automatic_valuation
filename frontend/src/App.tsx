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
 *
 * Struttura a due livelli:
 * - <App> → monta <ToastProvider> e <Toaster>, poi renderizza <AppContent>
 * - <AppContent> → vive dentro il ToastProvider, quindi può usare useToast()
 *   tramite useGeoLookup senza errori di context mancante.
 */
import { Outlet, useSearchParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ToastProvider } from './context/ToastContext';
import { useGeoLookup } from './hooks/useGeoLookup';
import Header from './components/layout/Header';
import { ScrollToTop } from './components/layout/ScrollToTop';
import FormStepSkeleton from './components/shared/FormStepSkeleton';

/**
 * AppContent — componente interno che usa useGeoLookup (e quindi useToast).
 * Deve essere renderizzato dentro <ToastProvider>, mai al suo esterno.
 */
const AppContent = () => {
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
      {/* Reset dello scroll automatico ad ogni cambio di step o pagina */}
      <ScrollToTop />

      {/* Header globale — presente su tutte le route */}
      <Header />

      {/*
       * Overlay di caricamento durante il geo-lookup iniziale.
       * Copre l'intera viewport con z-50 per evitare flash di FallbackPage
       * nei millisecondi prima che useGeoLookup esegua il redirect.
       */}
      {isLoading ? (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-[#f5f5f5] overflow-y-auto pt-16"
          role="status"
          aria-label="Ricerca zona in corso"
        >
          <FormStepSkeleton />
        </div>
      ) : (
        /* Blocco <main /> unico con flex-1 per riempire lo spazio verticale */
        <main className="flex-1 flex flex-col">
          {/* Outlet renderizza la pagina corrispondente alla route corrente */}
          <Outlet />
        </main>
      )}
    </>
  );
};

/**
 * App — root del layout.
 * Monta ToastProvider e Toaster prima di renderizzare AppContent,
 * così useToast() è sempre disponibile nell'albero figlio.
 */
const App = () => {
  return (
    <ToastProvider>
      {/*
       * Toaster centralizzato — posizionato dentro ToastProvider.
       * containerStyle.top = 90px allineato all'altezza dell'header (h-14 + py-2×2).
       * I toast appaiono sempre sotto l'header, mai sovrapposti.
       */}
      <Toaster
        position="top-center"
        containerStyle={{ top: 90 }}
        toastOptions={{
          duration: 4500,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: '#1e1e1e',
            maxWidth: '480px',
          },
          success: {
            iconTheme: { primary: '#16a34a', secondary: '#fffbfc' },
          },
          error: {
            iconTheme: { primary: 'red', secondary: '#fffbfc' },
          },
        }}
      />
      <AppContent />
    </ToastProvider>
  );
};

export default App;
