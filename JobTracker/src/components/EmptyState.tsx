import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-16 px-6 space-y-3"
      id="empty-state"
    >
      {icon && (
        <div className="p-3.5 bg-slate-100/60 rounded-2xl text-slate-400">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-700">{title}</h4>
        {description && (
          <p className="text-xs text-slate-400 max-w-xs">{description}</p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer shadow-sm"
          id="empty-state-action"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
