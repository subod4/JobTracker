import type { ApplicationStatus } from '../types';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; classes: string; dotClass: string }> = {
  Applied: {
    label: 'Applied',
    classes: 'text-sky-700 bg-sky-50 border-sky-200',
    dotClass: 'bg-sky-500',
  },
  Interviewing: {
    label: 'Interviewing',
    classes: 'text-amber-700 bg-amber-50 border-amber-200',
    dotClass: 'bg-amber-500 animate-pulse',
  },
  Offer: {
    label: 'Offer',
    classes: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  Rejected: {
    label: 'Rejected',
    classes: 'text-rose-600 bg-rose-50 border-rose-200',
    dotClass: 'bg-rose-400',
  },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Applied;

  const sizeClasses = size === 'sm'
    ? 'text-[9px] px-1.5 py-0.5 gap-1'
    : 'text-[10px] px-2 py-0.5 gap-1.5';

  const dotSize = size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border leading-tight select-none ${config.classes} ${sizeClasses}`}
    >
      <span className={`${dotSize} rounded-full shrink-0 ${config.dotClass}`} />
      {config.label}
    </span>
  );
}
