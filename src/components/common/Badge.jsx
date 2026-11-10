import React from 'react';

/**
 * Reusable Badge Component
 * Aligned with SPPGIndonesia corporate color palette: Deep Navy, Golden Yellow, Soft Cyan, etc.
 */
export default function Badge({
  children,
  variant = 'slate',
  size = 'sm',
  dot = false,
  className = '',
  ...props
}) {
  const variantStyles = {
    navy: 'bg-[#1e293b]/10 text-[#0f172a] border-[#0f172a]/20',
    yellow: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold',
    cyan: 'bg-sky-50 text-sky-700 border-sky-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-orange-50 text-orange-700 border-orange-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const dotColors = {
    navy: 'bg-[#0f172a]',
    yellow: 'bg-amber-500',
    cyan: 'bg-sky-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-orange-500',
    rose: 'bg-rose-500',
    slate: 'bg-slate-500'
  };

  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs sm:text-sm'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors ${
        variantStyles[variant] || variantStyles.slate
      } ${sizeStyles[size] || sizeStyles.sm} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            dotColors[variant] || dotColors.slate
          }`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

