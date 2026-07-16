import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangle' | 'circle';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangle',
  width,
  height,
}) => {
  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;

  const baseClass = 'animate-pulse bg-brand-border/60';
  const variantClass = variant === 'circle' ? 'rounded-full' : 'rounded-lg';

  return (
    <div
      className={`${baseClass} ${variantClass} ${className}`}
      style={style}
      role="status"
      aria-label="Caricamento in corso..."
    />
  );
};

export default Skeleton;
