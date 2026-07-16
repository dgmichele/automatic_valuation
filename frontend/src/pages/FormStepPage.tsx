import { ProgressBar } from '../components/layout/ProgressBar';
import { AddressBadge } from '../components/layout/AddressBadge';
import { EditAddressModal } from '../components/form/EditAddressModal';
import { StickyFormNav } from '../components/form/StickyFormNav';
import { StepPropertyType } from '../components/form/steps/StepPropertyType';
import { StepFeatures } from '../components/form/steps/StepFeatures';
import { StepIntent } from '../components/form/steps/StepIntent';
import { useValuationForm } from '../hooks/useValuationForm';
import { useStepPropertyType } from '../hooks/useStepPropertyType';
import { useStepFeatures } from '../hooks/useStepFeatures';
import { useStepIntent } from '../hooks/useStepIntent';
import { useFormStepGuard } from '../hooks/useFormStepGuard';

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

  // Guard per la navigazione degli step form
  const { isGuardReady } = useFormStepGuard(currentStep);

  // Step 1 — logica di business (separata dalla UI)
  const {
    selectedType,
    selectPropertyType,
    isValid: isStep1Valid,
  } = useStepPropertyType();

  // Step 2 — logica di business (separata dalla UI)
  const step2 = useStepFeatures();

  // Step 3 — logica di business (separata dalla UI)
  const {
    intent,
    setIntent,
    isValid: isStep3Valid,
  } = useStepIntent();

  // Determina se il pulsante Avanti è disabilitato per lo step corrente
  const isNextDisabled =
    currentStep === 1 ? !isStep1Valid :
    currentStep === 2 ? !step2.isValid :
    currentStep === 3 ? !isStep3Valid :
    false;

  if (!isGuardReady) {
    return null; // Evita flash visivi di step non validi prima del redirect
  }

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

      {/* Contenitore step form */}
      <div className="w-full max-w-2xl mt-5 mb-30">
        {currentStep === 1 && (
          <StepPropertyType
            selectedType={selectedType}
            onSelect={selectPropertyType}
          />
        )}

        {currentStep === 2 && (
          <StepFeatures {...step2} />
        )}

        {currentStep === 3 && (
          <StepIntent
            selectedIntent={intent}
            onSelect={setIntent}
          />
        )}
      </div>

      {/* Navigazione Sticky inferiore */}
      <StickyFormNav
        onNext={goToNext}
        onBack={goToPrev}
        showBack={!isFirstStep}
        isNextDisabled={isNextDisabled}
        isLastStep={isLastStep}
        isLoading={isCalculating}
      />
    </div>
  );
};

export default FormStepPage;

