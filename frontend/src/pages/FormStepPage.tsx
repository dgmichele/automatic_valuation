import { ProgressBar } from '../components/layout/ProgressBar';
import { AddressBadge } from '../components/layout/AddressBadge';
import { EditAddressModal } from '../components/form/EditAddressModal';
import { StickyFormNav } from '../components/form/StickyFormNav';
import { useValuationForm } from '../hooks/useValuationForm';

const FormStepPage = () => {
  const {
    currentStep,
    isAddressModalOpen,
    isFirstStep,
    isLastStep,
    isCalculating,
    goToNext,
    goToPrev,
    toggleAddressModal,
  } = useValuationForm();

  return (
    <div className="flex-1 flex flex-col items-center justify-start w-full max-w-4xl mx-auto px-4 pt-4 pb-24 md:py-8">
      {/* Barra di progresso in cima al form */}
      <ProgressBar />

      {/* Targhetta indirizzo con pulsante Modifica */}
      <AddressBadge onEdit={() => toggleAddressModal(true)} />

      {/* Modal di modifica indirizzo */}
      <EditAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => toggleAddressModal(false)}
      />

      {/* Contenitore di mockup temporaneo per i passi successivi della Fase 3 */}
      <div className="w-full max-w-2xl bg-brand-field/80 backdrop-blur-md rounded-2xl p-8 border border-brand-border mt-0 mb-20" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
        <h2 className="text-xl font-bold text-brand-dark mb-4">
          Step {currentStep}: {currentStep === 1 ? 'Tipologia Immobile' : currentStep === 2 ? 'Caratteristiche' : 'Scopo Valutazione'}
        </h2>
        <p className="text-brand-paragraph font-sans text-sm">
          Contenuto del form per lo step {currentStep} in fase di sviluppo.
        </p>
      </div>

      {/* Navigazione Sticky inferiore */}
      <StickyFormNav
        onNext={goToNext}
        onBack={goToPrev}
        showBack={!isFirstStep}
        isLastStep={isLastStep}
        isLoading={isCalculating}
      />
    </div>
  );
};

export default FormStepPage;

