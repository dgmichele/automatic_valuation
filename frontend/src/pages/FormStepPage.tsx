/**
 * FormStepPage — stub (Fase 1)
 * Gestisce i 3 step del multi-step form: /form/step-1, /form/step-2, /form/step-3.
 * Implementata completamente in Fase 3.
 */
import { useParams } from 'react-router-dom';

const FormStepPage = () => {
  const { step } = useParams<{ step: string }>();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-brand-paragraph font-sans text-sm">
        FormStepPage — stub Fase 1 — step: {step}
      </p>
    </div>
  );
};

export default FormStepPage;
