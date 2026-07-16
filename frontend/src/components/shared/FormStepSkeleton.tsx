import React from 'react';
import { Skeleton } from './Skeleton';

export const FormStepSkeleton: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-start w-full max-w-4xl mx-auto px-4 pt-4 pb-24 md:py-8">
      {/* Barra di progresso in cima al form */}
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[3px] bg-brand-border/40 rounded-full -z-10" />
          {/* Nodi fittizi per i 3 step */}
          {[1, 2, 3].map((step) => (
            <div key={step} className="relative flex flex-col items-center">
              <Skeleton variant="circle" className="w-10 h-10 border-2 border-brand-border" />
              <div className="absolute mt-12 flex flex-col items-center w-24">
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-2 w-12 hidden sm:block" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-10" aria-hidden="true" />
      </div>

      {/* Targhetta indirizzo fittizia */}
      <div className="w-full max-w-2xl bg-brand-field/80 border border-brand-border/60 rounded-xl p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3 w-full">
          <Skeleton variant="circle" className="w-5 h-5 shrink-0" />
          <Skeleton className="h-4 w-3/4 max-w-md" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg shrink-0 ml-4" />
      </div>

      {/* Contenuto dello Step */}
      <div className="w-full max-w-2xl mt-8 space-y-6">
        {/* Titolo dello Step */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <Skeleton className="h-7 w-2/3 max-w-xs" />
          <Skeleton className="h-4 w-1/2 max-w-xs" />
        </div>

        {/* Campi e griglie interattive dello Step (es. card per property type o campi input) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <Skeleton key={idx} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Navigazione Sticky fittizia in basso */}
      <div className="fixed bottom-0 left-0 right-0 bg-brand-field/90 backdrop-blur-md border-t border-brand-border/50 py-4 px-6 z-40">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <Skeleton className="h-12 w-28 rounded-xl" />
          <Skeleton className="h-12 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default FormStepSkeleton;
