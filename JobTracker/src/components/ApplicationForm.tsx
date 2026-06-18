import { useState, useEffect } from 'react';
import type { Application, ApplicationFormData, ApplicationStatus, JobType, FormErrors } from '../types';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationFormData) => Promise<boolean>;
  editApplication?: Application | null;
  loading?: boolean;
}

const JOB_TYPES: JobType[] = ['Internship', 'Full-time', 'Part-time'];
const STATUSES: ApplicationStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

function getTodayDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function ApplicationForm({
  isOpen,
  onClose,
  onSubmit,
  editApplication,
  loading = false,
}: ApplicationFormProps) {
  const isEditMode = !!editApplication;

  const [formData, setFormData] = useState<ApplicationFormData>({
    company_name: '',
    job_title: '',
    job_type: 'Full-time',
    status: 'Applied',
    applied_date: getTodayDate(),
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset form when opening/closing or switching edit target
  useEffect(() => {
    if (isOpen) {
      if (editApplication) {
        setFormData({
          company_name: editApplication.company_name,
          job_title: editApplication.job_title,
          job_type: editApplication.job_type,
          status: editApplication.status,
          applied_date: editApplication.applied_date,
          notes: editApplication.notes || '',
        });
      } else {
        setFormData({
          company_name: '',
          job_title: '',
          job_type: 'Full-time',
          status: 'Applied',
          applied_date: getTodayDate(),
          notes: '',
        });
      }
      setErrors({});
      setTouched({});
    }
  }, [isOpen, editApplication]);

  function validate(data: ApplicationFormData): FormErrors {
    const errs: FormErrors = {};
    if (!data.company_name.trim()) {
      errs.company_name = 'Company name is required';
    } else if (data.company_name.trim().length < 2) {
      errs.company_name = 'Company name must be at least 2 characters';
    }
    if (!data.job_title.trim()) {
      errs.job_title = 'Job title is required';
    }
    if (!data.applied_date) {
      errs.applied_date = 'Applied date is required';
    }
    return errs;
  }

  function handleChange(field: keyof ApplicationFormData, value: string) {
    const next = { ...formData, [field]: value };
    setFormData(next);
    // Live validation for touched fields
    if (touched[field]) {
      setErrors(validate(next));
    }
  }

  function handleBlur(field: string) {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate(formData));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setTouched({ company_name: true, job_title: true, applied_date: true });

    if (Object.keys(validationErrors).length > 0) return;

    const success = await onSubmit(formData);
    if (success) {
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
      id="form-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-up border border-slate-200 flex flex-col my-auto"
        id="form-modal-container"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              {isEditMode ? 'Edit Application' : 'Add New Application'}
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {isEditMode ? 'Update the application details below' : 'Track a new job opportunity'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/10"
            id="form-close-btn"
            type="button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Company Name */}
          <div className="space-y-1">
            <label htmlFor="form-company-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Company Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="form-company-name"
              type="text"
              placeholder="e.g. Google, Stripe, etc."
              value={formData.company_name}
              onChange={(e) => handleChange('company_name', e.target.value)}
              onBlur={() => handleBlur('company_name')}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all font-medium text-slate-800 ${
                errors.company_name && touched.company_name
                  ? 'border-rose-300 bg-rose-50/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            />
            {errors.company_name && touched.company_name && (
              <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.company_name}
              </p>
            )}
          </div>

          {/* Job Title */}
          <div className="space-y-1">
            <label htmlFor="form-job-title" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Job Title <span className="text-rose-400">*</span>
            </label>
            <input
              id="form-job-title"
              type="text"
              placeholder="e.g. Frontend Engineer, Product Designer"
              value={formData.job_title}
              onChange={(e) => handleChange('job_title', e.target.value)}
              onBlur={() => handleBlur('job_title')}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all font-medium text-slate-800 ${
                errors.job_title && touched.job_title
                  ? 'border-rose-300 bg-rose-50/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            />
            {errors.job_title && touched.job_title && (
              <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.job_title}
              </p>
            )}
          </div>

          {/* Job Type + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="form-job-type" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Job Type
              </label>
              <select
                id="form-job-type"
                value={formData.job_type}
                onChange={(e) => handleChange('job_type', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 cursor-pointer font-medium text-slate-800 transition-all"
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="form-status" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Status
              </label>
              <select
                id="form-status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 cursor-pointer font-medium text-slate-800 transition-all"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Applied Date */}
          <div className="space-y-1">
            <label htmlFor="form-applied-date" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Applied Date <span className="text-rose-400">*</span>
            </label>
            <input
              id="form-applied-date"
              type="date"
              value={formData.applied_date}
              onChange={(e) => handleChange('applied_date', e.target.value)}
              onBlur={() => handleBlur('applied_date')}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all font-medium text-slate-800 font-mono ${
                errors.applied_date && touched.applied_date
                  ? 'border-rose-300 bg-rose-50/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            />
            {errors.applied_date && touched.applied_date && (
              <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.applied_date}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label htmlFor="form-notes" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Notes <span className="text-slate-300">(optional)</span>
            </label>
            <textarea
              id="form-notes"
              rows={3}
              placeholder="Add any relevant details, interview notes, or reminders..."
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all font-medium text-slate-800 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              id="form-cancel-btn"
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all rounded-xl cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              id="form-submit-btn"
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl cursor-pointer transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                isEditMode ? 'Update Application' : 'Add Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
