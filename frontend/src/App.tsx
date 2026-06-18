/**
 * App.tsx — Root dell'applicazione.
 *
 * Responsabilità (Fase 1):
 * - Legge lat, lon, address dai query params all'avvio
 * - Se mancanti o non numerici → mostra FallbackPage (index route)
 * - Se presenti → salva nello store e redirige a /form/step-1
 *   (la geo lookup effettiva viene implementata in Fase 2)
 */
import { useEffect } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useValuationStore } from './store/useValuationStore';

const App = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setGeo } = useValuationStore();

  useEffect(() => {
    const rawLat = searchParams.get('lat');
    const rawLon = searchParams.get('lon');
    const address = searchParams.get('address');

    const lat = rawLat ? parseFloat(rawLat) : NaN;
    const lon = rawLon ? parseFloat(rawLon) : NaN;

    // Query params assenti o non numerici → FallbackPage (già sulla route /)
    if (isNaN(lat) || isNaN(lon) || !address) {
      return;
    }

    // Params validi: salva geo nello store (zona verrà popolata in Fase 2 via useGeoLookup)
    setGeo({ lat, lon, address, zona: null });

    // Redirige allo step 1 del form — la guard useFormStepGuard (Fase 3)
    // gestirà i redirect ai passi precedenti se necessario
    navigate('/form/step-1', { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Eseguito solo al mount — i query params non cambiano dopo l'ingresso

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

      {/* Outlet renderizza la pagina corrispondente alla route corrente */}
      <Outlet />
    </>
  );
};

export default App;
