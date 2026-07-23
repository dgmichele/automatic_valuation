import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FaSpinner,
  FaPaperPlane,
  FaEnvelopeOpenText,
  FaCheckCircle,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import clsx from 'clsx';
import { leadSchema } from '../../schemas/valuation.schema';
import type { LeadFormData } from '../../schemas/valuation.schema';
import { useValuationStore } from '../../store/useValuationStore';
import useLeadSubmission from '../../hooks/useLeadSubmission';

interface PayloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStep = 'form' | 'submitting' | 'success';

export const PayloadModal: React.FC<PayloadModalProps> = ({ isOpen, onClose }) => {
  const storedFirstName = useValuationStore((s) => s.first_name);
  const storedLastName = useValuationStore((s) => s.last_name);
  const storedEmail = useValuationStore((s) => s.email);
  const storedPhone = useValuationStore((s) => s.phone);
  const setLeadFields = useValuationStore((s) => s.setLeadFields);
  const resetStore = useValuationStore((s) => s.resetStore);
  const result = useValuationStore((s) => s.result);

  // Se result è già presente nello store (valutazione già inviata), imposta direttamente lo stato success
  const [modalStep, setModalStep] = useState<ModalStep>(() =>
    result !== null ? 'success' : 'form',
  );

  React.useEffect(() => {
    if (isOpen && result !== null && modalStep === 'form') {
      setModalStep('success');
    }
  }, [isOpen, result, modalStep]);

  const { submitLeadAsync } = useLeadSubmission();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      first_name: storedFirstName || '',
      last_name: storedLastName || '',
      email: storedEmail || '',
      phone: storedPhone || '',
      privacy: false,
    },
  });

  const handleFormSubmit = async (data: LeadFormData) => {
    setLeadFields(data);
    setModalStep('submitting');

    const minDelay = new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      await Promise.all([submitLeadAsync(data), minDelay]);
      setModalStep('success');
    } catch {
      // In caso di errore la mutation mostra il toast e facciamo tornare l'utente al form
      setModalStep('form');
    }
  };

  const handleCloseAndRedirect = () => {
    resetStore();
    const landingUrl = import.meta.env.VITE_LANDING_URL || 'https://www.bichimmobiliare.it';
    window.location.href = landingUrl;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        // Se siamo nello stato form o success permetti la chiusura, altrimenti blocco durante submitting
        if (modalStep !== 'submitting') {
          onClose();
        }
      }}
      className="relative z-50"
    >
      {/* Backdrop con blur */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 data-closed:opacity-0"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className={clsx(
            'w-full max-w-lg transform overflow-hidden rounded-2xl bg-brand-popup-bg p-6 sm:p-8 text-left align-middle shadow-2xl border border-brand-border space-y-6',
            'duration-300 ease-out data-closed:scale-95 data-closed:opacity-0',
          )}
        >
          {/* STATO 1: Form Lead */}
          {modalStep === 'form' && (
            <div className="space-y-5">
              {/* Header Modal */}
              <div className="flex items-center justify-between border-b border-brand-border pb-4">
                <DialogTitle
                  as="h3"
                  className="text-xl sm:text-2xl font-serif font-extrabold text-brand-dark"
                >
                  Inserisci i tuoi dati
                </DialogTitle>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-brand-placeholder hover:text-brand-primary transition-colors cursor-pointer p-1"
                  aria-label="Chiudi modal"
                >
                  <MdClose className="h-6 w-6" />
                </button>
              </div>

              <p className="font-sans text-xs sm:text-sm text-brand-paragraph">
                La stima <strong>arriverà subito</strong> sulla tua email.
              </p>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nome */}
                  <div className="space-y-1">
                    <label htmlFor="first_name" className="block text-xs font-semibold text-brand-dark font-sans">
                      Nome <span className="text-brand-primary">*</span>
                    </label>
                    <input
                      id="first_name"
                      type="text"
                      placeholder="Es. Mario"
                      {...register('first_name')}
                      className={`w-full px-3.5 py-2.5 bg-brand-field border rounded-lg text-sm text-brand-dark placeholder-brand-placeholder transition duration-300 focus:outline-none ${
                        errors.first_name
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-brand-border focus:border-brand-border-focus'
                      }`}
                    />
                    {errors.first_name && (
                      <p className="text-xs text-red-500 font-sans">{errors.first_name.message}</p>
                    )}
                  </div>

                  {/* Cognome */}
                  <div className="space-y-1">
                    <label htmlFor="last_name" className="block text-xs font-semibold text-brand-dark font-sans">
                      Cognome <span className="text-brand-primary">*</span>
                    </label>
                    <input
                      id="last_name"
                      type="text"
                      placeholder="Es. Rossi"
                      {...register('last_name')}
                      className={`w-full px-3.5 py-2.5 bg-brand-field border rounded-lg text-sm text-brand-dark placeholder-brand-placeholder transition duration-300 focus:outline-none ${
                        errors.last_name
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-brand-border focus:border-brand-border-focus'
                      }`}
                    />
                    {errors.last_name && (
                      <p className="text-xs text-red-500 font-sans">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-xs font-semibold text-brand-dark font-sans">
                    Email <span className="text-brand-primary">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="mario.rossi@email.it"
                    {...register('email')}
                    className={`w-full px-3.5 py-2.5 bg-brand-field border rounded-lg text-sm text-brand-dark placeholder-brand-placeholder transition duration-300 focus:outline-none ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-brand-border focus:border-brand-border-focus'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 font-sans">{errors.email.message}</p>
                  )}
                </div>

                {/* Telefono */}
                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-xs font-semibold text-brand-dark font-sans">
                    Numero di Telefono <span className="text-brand-primary">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Es. 333 1234567"
                    {...register('phone')}
                    className={`w-full px-3.5 py-2.5 bg-brand-field border rounded-lg text-sm text-brand-dark placeholder-brand-placeholder transition duration-300 focus:outline-none ${
                      errors.phone
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-brand-border focus:border-brand-border-focus'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 font-sans">{errors.phone.message}</p>
                  )}
                </div>

                {/* Checkbox Privacy Policy */}
                <div className="space-y-1 pt-1">
                  <label htmlFor="privacy-checkbox" className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      id="privacy-checkbox"
                      type="checkbox"
                      {...register('privacy')}
                      className="mt-0.5 h-4 w-4 rounded border-brand-border text-brand-primary focus:ring-brand-border-focus cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-brand-paragraph font-sans leading-tight">
                      Dichiaro di accettare l'
                      <a
                        href="https://www.iubenda.com/privacy-policy/72256962"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary font-semibold underline hover:text-brand-dark transition-colors"
                      >
                        Informativa sulla Privacy
                      </a>{' '}
                      e acconsento al trattamento dei miei dati personali, inoltre accetto di essere contattato da Bich Immobiliare per l'invio della valutazione del mio immobile. <span className="text-brand-primary">*</span>
                    </span>
                  </label>
                  {errors.privacy && (
                    <p className="text-xs text-red-500 font-sans">{errors.privacy.message}</p>
                  )}
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 bg-brand-primary text-brand-field font-sans font-bold text-base rounded-xl hover:bg-brand-dark transition duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FaPaperPlane className="text-sm" />
                    <span>Ricevi ora la valutazione</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STATO 2: Submitting Spinner (~2s) */}
          {modalStep === 'submitting' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-5 animate-fade-in">
              <FaSpinner className="animate-spin text-brand-primary text-5xl sm:text-6xl" />
              <div className="space-y-2">
                <h4 className="font-serif text-xl sm:text-2xl font-extrabold text-brand-dark">
                  Invio in corso...
                </h4>
                <p className="font-sans text-sm text-brand-paragraph max-w-sm">
                  Stiamo registrando la tua richiesta e preparando la valutazione da inviarti via email.
                </p>
              </div>
            </div>
          )}

          {/* STATO 3: Success Thank You */}
          {modalStep === 'success' && (
            <div className="py-4 text-center space-y-6 animate-fade-in">
              {/* Icona di successo */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-primary/10 text-brand-primary mx-auto">
                <FaEnvelopeOpenText className="text-4xl" />
                <div className="absolute -bottom-1 -right-1 bg-brand-field text-emerald-600 rounded-full p-1 shadow">
                  <FaCheckCircle className="text-xl" />
                </div>
              </div>

              <div className="space-y-2">
                <DialogTitle
                  as="h3"
                  className="text-2xl sm:text-3xl font-serif font-extrabold text-brand-dark"
                >
                  Valutazione inviata
                </DialogTitle>
                <p className="font-sans text-base sm:text-lg text-brand-paragraph">
                  Che aspetti?! Apri la tua email per scoprirla ora!
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCloseAndRedirect}
                  className="w-full py-3.5 px-6 bg-brand-primary text-brand-field font-sans font-bold text-base rounded-xl hover:bg-brand-dark transition duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Passo e chiudo</span>
                  <FaExternalLinkAlt className="text-xs" />
                </button>
              </div>
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default PayloadModal;
