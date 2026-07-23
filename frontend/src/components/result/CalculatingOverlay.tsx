import React, { useEffect, useState } from 'react';
import { FaSpinner, FaChartLine, FaBuilding, FaSearchLocation } from 'react-icons/fa';

interface CalculatingOverlayProps {
  onComplete: () => void;
  durationMs?: number;
}

const MESSAGES = [
  { icon: FaSearchLocation, text: 'Localizzazione dell\'immobile e analisi della zona...' },
  { icon: FaBuilding, text: 'Elaborazione delle caratteristiche strutturali...' },
  { icon: FaChartLine, text: 'Confronto con i dati OMI e recenti compravendite...' },
];

export const CalculatingOverlay: React.FC<CalculatingOverlayProps> = ({
  onComplete,
  durationMs = 3000,
}) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Ruota i messaggi ogni (durationMs / MESSAGES.length)
    const stepDuration = Math.floor(durationMs / MESSAGES.length);
    const interval = setInterval(() => {
      setStep((prev) => (prev < MESSAGES.length - 1 ? prev + 1 : prev));
    }, stepDuration);

    const timer = setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [durationMs, onComplete]);

  const CurrentIcon = MESSAGES[step].icon;

  return (
    <div className="w-full max-w-xl mx-auto my-8 p-8 bg-brand-field border border-brand-border rounded-2xl shadow-lg flex flex-col items-center text-center space-y-6 animate-fade-in">
      <div className="relative flex items-center justify-center">
        <FaSpinner className="animate-spin text-brand-primary text-5xl sm:text-6xl" />
        <div className="absolute inset-0 flex items-center justify-center">
          <CurrentIcon className="text-brand-primary text-lg sm:text-xl transition-all duration-300 transform scale-110" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-brand-dark">
          Stiamo calcolando la tua valutazione...
        </h2>
        <p className="font-sans text-sm sm:text-base text-brand-paragraph transition-all duration-300 min-h-[48px] flex items-center justify-center">
          {MESSAGES[step].text}
        </p>
      </div>

      <div className="w-full bg-brand-border/40 rounded-full h-2 overflow-hidden">
        <div
          className="bg-brand-primary h-full transition-all duration-300 ease-out rounded-full"
          style={{ width: `${((step + 1) / MESSAGES.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default CalculatingOverlay;
