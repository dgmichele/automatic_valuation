import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useValuationStore } from '../store/useValuationStore';
import CalculatingOverlay from '../components/result/CalculatingOverlay';
import ResultCard from '../components/result/ResultCard';
import PayloadModal from '../components/result/PayloadModal';

export const ResultPage: React.FC = () => {
  const navigate = useNavigate();

  // Dati di guardia dallo store
  const lat = useValuationStore((s) => s.lat);
  const property_type = useValuationStore((s) => s.property_type);
  const sqm = useValuationStore((s) => s.sqm);
  const intent = useValuationStore((s) => s.intent);

  const [isCalculating, setIsCalculating] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Guard: verifica che i dati essenziali del form siano presenti nello store
  useEffect(() => {
    if (!lat || !property_type || !sqm || !intent) {
      navigate('/form/step-1', { replace: true });
    }
  }, [lat, property_type, sqm, intent, navigate]);

  // Se i dati minimi mancano, non renderizzare nulla durante il redirect
  if (!lat || !property_type || !sqm || !intent) {
    return null;
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {isCalculating ? (
        <CalculatingOverlay onComplete={() => setIsCalculating(false)} durationMs={3000} />
      ) : (
        <>
          {/* Card risultato con valore criptato e pulsante Sblocca */}
          <ResultCard onUnlockClick={() => setIsModalOpen(true)} />

          {/* Modal unico per Form Lead, Spinner invio (2s) e Ringraziamento */}
          <PayloadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
      )}
    </div>
  );
};

export default ResultPage;
