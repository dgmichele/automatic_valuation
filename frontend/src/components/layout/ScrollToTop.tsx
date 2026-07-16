import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — Componente che centralizza il ripristino dello scroll al top
 * ad ogni cambio di rotta (passaggio da uno step all'altro, ResultPage, ecc.).
 *
 * NOTA: il layout usa html/body con height:100% + #root con display:flex,
 * pertanto lo scroll container effettivo potrebbe non essere window.
 * Resettiamo esplicitamente tutti i possibili contenitori, e usiamo
 * requestAnimationFrame per garantire che il reset avvenga DOPO che React
 * ha completato il rendering del nuovo contenuto (evita race conditions).
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const root = document.getElementById('root');
      if (root) root.scrollTop = 0;
    };

    // Reset immediato
    resetScroll();

    // Reset ritardato di un frame per sicurezza (evita race condition col render React)
    const raf = requestAnimationFrame(resetScroll);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
};
