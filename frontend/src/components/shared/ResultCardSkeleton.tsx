import React from 'react';
import Skeleton from './Skeleton';

export const ResultCardSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-xl mx-auto bg-brand-field border border-brand-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in">
      <div className="flex flex-col items-center text-center space-y-3">
        <Skeleton variant="circle" width={56} height={56} />
        <Skeleton width="60%" height={28} />
        <Skeleton width="80%" height={18} />
      </div>

      <div className="bg-brand-popup-bg border border-brand-border rounded-xl p-6 flex flex-col items-center space-y-4">
        <Skeleton width="40%" height={16} />
        <Skeleton width="75%" height={40} />
        <Skeleton width="50%" height={14} />
      </div>

      <div className="space-y-2 pt-2">
        <Skeleton width="100%" height={16} />
        <Skeleton width="90%" height={16} />
      </div>
    </div>
  );
};

export default ResultCardSkeleton;
