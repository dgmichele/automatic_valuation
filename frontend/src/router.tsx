/**
 * router.tsx — Definizione delle route dell'applicazione.
 * Usa React Router v6 con createBrowserRouter.
 */
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import FallbackPage from './pages/FallbackPage';
import FormStepPage from './pages/FormStepPage';
import ResultPage from './pages/ResultPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Route fallback: nessun lat/lon validi oppure fuori area
      { index: true, element: <FallbackPage /> },

      // Multi-step form — step parametrico
      { path: 'form/step-1', element: <FormStepPage /> },
      { path: 'form/step-2', element: <FormStepPage /> },
      { path: 'form/step-3', element: <FormStepPage /> },

      // Pagina risultato + lead form
      { path: 'risultato', element: <ResultPage /> },
    ],
  },
]);

export default router;
