interface DeleteConfirmModalProps {
  isOpen: boolean;
  companyName: string;
  jobTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  companyName,
  jobTitle,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      id="delete-confirm-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-scale-up border border-slate-200"
        id="delete-confirm-modal"
      >
        {/* Warning Header */}
        <div className="px-6 pt-6 pb-4 text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-800">Delete Application</h3>
            <p className="text-sm text-slate-500">
              Are you sure you want to delete the application for{' '}
              <span className="font-bold text-slate-700">{jobTitle}</span> at{' '}
              <span className="font-bold text-slate-700">{companyName}</span>?
            </p>
            <p className="text-xs text-slate-400">This action cannot be undone.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            id="delete-cancel-btn"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors cursor-pointer disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
            id="delete-confirm-btn"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
