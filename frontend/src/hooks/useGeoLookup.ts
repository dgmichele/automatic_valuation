/**
 * useGeoLookup.ts — Hook TanStack Query per la geolocalizzazione zona OMI.
 *
 * Responsabilità:
 * - Chiama GET /api/geo/lookup?lat=&lon= tramite TanStack Query (useQuery)
 * - In caso di successo: salva la zona nello store Zustand + redirige a /form/step-1
 * - In caso di 404 OUTSIDE_AREA: reindirizza a FallbackPage con stato "fuori area"
 * - In caso di errore generico: mostra toast con messaggio backend + reindirizza a FallbackPage
 *
 * Parametri:
 * - lat/lon: se null, la query non parte (enabled: false)
 */
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { lookupZone } from '../api/geo.api';
import { useValuationStore } from '../store/useValuationStore';
import { useToast } from '../context/ToastContext';
import { TOAST_MESSAGES } from '../types/feedback';

interface UseGeoLookupParams {
  lat: number | null;
  lon: number | null;
  address: string | null;
}

export const useGeoLookup = ({ lat, lon, address }: UseGeoLookupParams) => {
  const navigate = useNavigate();
  const { setGeo } = useValuationStore();
  const { showError } = useToast();

  // La query è abilitata solo se lat e lon sono numeri validi
  const enabled =
    lat !== null &&
    lon !== null &&
    !isNaN(lat) &&
    !isNaN(lon);

  const query = useQuery({
    queryKey: ['geo-lookup', lat, lon],
    queryFn: () => lookupZone(lat!, lon!),
    enabled,
    // Nessun retry per errori 4xx (configurato anche globalmente in main.tsx)
    retry: false,
    // Il risultato della lookup è stabile per la sessione — non rieseguire
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      // Successo: salva geo completa (lat, lon, address, zona) nello store
      setGeo({
        lat: lat!,
        lon: lon!,
        address: address ?? '',
        zona: query.data,
      });
      // Redirige al primo step del form
      navigate('/form/step-1', { replace: true });
    }
  }, [query.isSuccess, query.data, lat, lon, address, setGeo, navigate]);

  useEffect(() => {
    if (query.isError) {
      const error = query.error as { response?: { status?: number; data?: { error?: { message?: string } } }; code?: string; message?: string };
      const status = error?.response?.status;
      const code = error?.code;

      if (status === 404 || code === 'OUTSIDE_AREA') {
        // Fuori area: non mostrare toast, la FallbackPage gestisce la comunicazione
        navigate('/', { replace: true, state: { outsideArea: true } });
      } else {
        // Errore generico: mostra il messaggio esatto dal backend, con fallback al testo di default
        const backendMessage = error?.response?.data?.error?.message || error?.message;
        showError(
          backendMessage || `${TOAST_MESSAGES.GENERIC_ERROR.title}: ${TOAST_MESSAGES.GENERIC_ERROR.message}`,
        );
        navigate('/', { replace: true });
      }
    }
  }, [query.isError, query.error, navigate, showError]);

  return {
    isLoading: query.isLoading && enabled,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
};
