import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useValuationStore } from '../store/useValuationStore';
import { ProgressBar } from '../components/layout/ProgressBar';
import { AddressBadge } from '../components/layout/AddressBadge';

const FormStepPage = () => {
  const { step } = useParams<{ step: string }>();
  const setCurrentStep = useValuationStore((state) => state.setCurrentStep);

  // Determina il numero dello step corrente in base al parametro dell'URL
  const stepNumber = step === 'step-3' ? 3 : step === 'step-2' ? 2 : 1;

  // Stato locale per il modal di modifica indirizzo
  // (il futuro EditAddressModal sarà collegato qui)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Sincronizza lo step corrente nello store globale
  useEffect(() => {
    setCurrentStep(stepNumber as 1 | 2 | 3);
  }, [stepNumber, setCurrentStep]);

  return (
    <div className="flex-1 flex flex-col items-center justify-start w-full max-w-4xl mx-auto px-4 py-8">
      {/* Barra di progresso in cima al form */}
      <ProgressBar />

      {/* Targhetta indirizzo con pulsante Modifica */}
      <AddressBadge onEdit={() => setIsEditModalOpen(true)} />

      {/* TODO: EditAddressModal — da implementare nella prossima fase */}
      {/* isEditModalOpen verrà passato al modal quando sarà creato */}
      {isEditModalOpen && (
        <div className="hidden" aria-hidden="true" />
      )}

      {/* Contenitore di mockup temporaneo per i passi successivi della Fase 3 */}
      <div className="w-full max-w-2xl bg-brand-field/80 backdrop-blur-md rounded-2xl p-8 border border-brand-border mt-0" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
        <h2 className="text-xl font-bold text-brand-dark mb-4">
          Step {stepNumber}: {stepNumber === 1 ? 'Tipologia Immobile' : stepNumber === 2 ? 'Caratteristiche' : 'Scopo Valutazione'}
        </h2>
        <p className="text-brand-paragraph font-sans text-sm">
          Contenuto del form per lo step {stepNumber} in fase di sviluppo.
        </p>
      </div>
    </div>
  );
};

export default FormStepPage;
