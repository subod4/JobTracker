import type { Application } from '../types';
import { formatDate, getJobTypeBadgeClasses } from '../utils/formatting';
import StatusBadge from './StatusBadge';

interface ApplicationDetailProps {
  isOpen: boolean;
  application: Application | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ApplicationDetail({
  isOpen,
  application,
  onClose,
  onEdit,
  onDelete,
}: ApplicationDetailProps) {
  if (!isOpen || !application) return null;

  const app = application;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
      id="detail-modal-overlay"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col my-auto"
        id="detail-modal-container"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 line-clamp-2">{app.company_name}</h2>
            <p className="text-sm text-slate-500 mt-1">{app.job_title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer rounded-lg hover:bg-slate-100 shrink-0 ml-3"
            id="detail-close-btn"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Status & Job Type */}
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={app.status} />
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getJobTypeBadgeClasses(app.job_type)}`}>
              {app.job_type}
            </span>
          </div>

          {/* Details Grid */}
          <div className="space-y-3 bg-slate-50/50 border border-slate-100 rounded-xl p-4">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Applied Date</span>
              <span className="block text-sm font-medium text-slate-800 mt-1">{formatDate(app.applied_date)}</span>
            </div>
          </div>

          {/* Notes */}
          {app.notes && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase block">Notes</span>
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {app.notes}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-3">
          <button
            onClick={onDelete}
            className="px-4 py-2.5 text-sm font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            id="detail-delete-btn"
          >
            Delete
          </button>
          <button
            onClick={onEdit}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl cursor-pointer transition-colors shadow-sm"
            id="detail-edit-btn"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
