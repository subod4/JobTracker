interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[2.5px]',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" id="loading-spinner">
      <div className={`${sizeMap[size]} border-slate-800 border-t-transparent rounded-full animate-spin`} />
      {message && (
        <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
