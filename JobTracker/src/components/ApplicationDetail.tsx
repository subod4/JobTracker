import type { Application } from '../types';
import StatusBadge from './StatusBadge';

interface ApplicationDetailProps {
  isOpen: boolean;
  application: Application | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + (dateStr.includes('T') ? '' : 'T12:00:00'));
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function formatTimestamp(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' at ' +
      d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoStr;
  }
}

function getJobTypeBadgeClasses(type: string): string {
  switch (type) {
    case 'Internship':
      return 'bg-violet-50 text-violet-700 border-violet-200';
    case 'Part-time':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
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
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scale-up border border-slate-200 flex flex-col my-auto max-h-[90vh]"
        id="detail-modal-container"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-sm uppercase shrink-0">
                  {app.company_name.substring(0, 2)}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-white truncate">{app.company_name}</h2>
                  <p className="text-xs text-slate-400 truncate">{app.job_title}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={app.status} size="sm" />
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getJobTypeBadgeClasses(app.job_type)}`}>
                  {app.job_type}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/10 shrink-0 ml-3"
              id="detail-close-btn"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Details Grid */}
          <div className="space-y-1.5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Application Details</h3>
            <div className="grid grid-cols-2 gap-3 bg-slate-50/50 border border-slate-100 rounded-xl p-4">
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Company</span>
                <span className="text-sm font-bold text-slate-800">{app.company_name}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Job Title</span>
                <span className="text-sm font-semibold text-slate-800">{app.job_title}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Job Type</span>
                <span className="text-sm font-medium text-slate-700">{app.job_type}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Status</span>
                <StatusBadge status={app.status} />
              </div>
              <div className="col-span-2">
                <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Applied Date</span>
                <span className="text-sm font-medium text-slate-800 font-mono">
                  {formatDate(app.applied_date)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notes</h3>
            <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap min-h-[60px]">
              {app.notes ? app.notes : (
                <span className="text-slate-300 italic">No notes added</span>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-1.5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Timestamps</h3>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 font-mono bg-slate-50/30 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Created</span>
                {formatTimestamp(app.created_at)}
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Last Updated</span>
                {formatTimestamp(app.updated_at)}
              </div>
            </div>
          </div>

          {/* ID */}
          <div className="text-[10px] text-slate-300 font-mono">
            ID: {app.id}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50/50">
          <button
            onClick={onDelete}
            className="px-4 py-2 text-sm font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            id="detail-delete-btn"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
          <button
            onClick={onEdit}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl cursor-pointer transition-colors shadow-sm flex items-center gap-1.5"
            id="detail-edit-btn"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
