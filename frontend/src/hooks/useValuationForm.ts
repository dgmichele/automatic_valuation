import { useReducer, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useValuationStore } from '../store/useValuationStore';

// ── Tipi per lo Stato ─────────────────────────────────────────────────────────
type FormState = {
  currentStep: 1 | 2 | 3;
  isAddressModalOpen: boolean;
  isCalculating: boolean;
  isSubmitting: boolean;
};

// ── Tipi per le Azioni ────────────────────────────────────────────────────────
type FormAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_STEP'; payload: 1 | 2 | 3 }
  | { type: 'TOGGLE_ADDRESS_MODAL'; payload: boolean }
  | { type: 'START_CALCULATION' }
  | { type: 'COMPLETE_CALCULATION' }
  | { type: 'SET_SUBMITTING'; payload: boolean };

// ── Reducer ──────────────────────────────────────────────────────────────────
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 3) as 1 | 2 | 3,
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1) as 1 | 2 | 3,
      };
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };
    case 'TOGGLE_ADDRESS_MODAL':
      return {
        ...state,
        isAddressModalOpen: action.payload,
      };
    case 'START_CALCULATION':
      return {
        ...state,
        isCalculating: true,
      };
    case 'COMPLETE_CALCULATION':
      return {
        ...state,
        isCalculating: false,
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };
    default:
      return state;
  }
};

// Stato iniziale di default
const initialFormState: FormState = {
  currentStep: 1,
  isAddressModalOpen: false,
  isCalculating: false,
  isSubmitting: false,
};

/**
 * useValuationForm — Custom hook per coordinare lo stato locale del modulo
 * ed evitare logica sparpagliata nei componenti presentazionali.
 * Implementa useReducer ed è integrato con Zustand e React Router.
 */
export const useValuationForm = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const storeSetCurrentStep = useValuationStore((state) => state.setCurrentStep);

  // Determina lo step corrente dal pathname (le rotte sono path letterali, non parametriche)
  const getStepFromUrl = (): 1 | 2 | 3 => {
    if (pathname.endsWith('step-3')) return 3;
    if (pathname.endsWith('step-2')) return 2;
    return 1;
  };

  const [state, dispatch] = useReducer(formReducer, {
    ...initialFormState,
    currentStep: getStepFromUrl(),
  });

  // Sincronizza lo stato locale e lo store globale ad ogni cambio di pathname
  useEffect(() => {
    const stepNum = getStepFromUrl();
    dispatch({ type: 'SET_STEP', payload: stepNum });
    storeSetCurrentStep(stepNum);
  }, [pathname, storeSetCurrentStep]);

  // Gestione avanzamento step
  const goToNext = () => {
    if (state.currentStep < 3) {
      const nextStep = (state.currentStep + 1) as 1 | 2 | 3;
      dispatch({ type: 'NEXT_STEP' });
      navigate(`/form/step-${nextStep}`);
    } else {
      // Ultimo step (3): trigger del calcolo e redirect ai risultati
      dispatch({ type: 'START_CALCULATION' });
      navigate('/risultato');
    }
  };

  // Gestione arretramento step
  const goToPrev = () => {
    if (state.currentStep > 1) {
      const prevStep = (state.currentStep - 1) as 1 | 2 | 3;
      dispatch({ type: 'PREV_STEP' });
      navigate(`/form/step-${prevStep}`);
    }
  };

  const toggleAddressModal = (open: boolean) => {
    dispatch({ type: 'TOGGLE_ADDRESS_MODAL', payload: open });
  };

  return {
    currentStep: state.currentStep,
    isAddressModalOpen: state.isAddressModalOpen,
    isCalculating: state.isCalculating,
    isSubmitting: state.isSubmitting,
    isFirstStep: state.currentStep === 1,
    isLastStep: state.currentStep === 3,
    goToNext,
    goToPrev,
    toggleAddressModal,
    startCalculation: () => dispatch({ type: 'START_CALCULATION' }),
    completeCalculation: () => dispatch({ type: 'COMPLETE_CALCULATION' }),
    setSubmitting: (submitting: boolean) =>
      dispatch({ type: 'SET_SUBMITTING', payload: submitting }),
  };
};
