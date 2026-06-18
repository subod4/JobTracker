import React, { useState, useEffect } from 'react';
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
    if (touched[field]) {
      setErrors(validate(next));
    }
  }

  function handleBlur(field: string) {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate(formData));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100 flex flex-col my-auto"
        id="form-modal-container"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {isEditMode ? 'Edit Application' : 'Add Application'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer rounded-lg hover:bg-slate-100"
            id="form-close-btn"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Company Name */}
          <div className="space-y-1">
            <label htmlFor="form-company-name" className="text-xs font-semibold text-slate-600">
              Company Name
            </label>
            <input
              id="form-company-name"
              type="text"
              placeholder="e.g. Google"
              value={formData.company_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('company_name', e.target.value)}
              onBlur={() => handleBlur('company_name')}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all font-medium text-slate-800 ${
                errors.company_name && touched.company_name
                  ? 'border-rose-300 bg-rose-50/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            />
            {errors.company_name && touched.company_name && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.company_name}</p>
            )}
          </div>

          {/* Job Title */}
          <div className="space-y-1">
            <label htmlFor="form-job-title" className="text-xs font-semibold text-slate-600">
              Job Title
            </label>
            <input
              id="form-job-title"
              type="text"
              placeholder="e.g. Frontend Engineer"
              value={formData.job_title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('job_title', e.target.value)}
              onBlur={() => handleBlur('job_title')}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all font-medium text-slate-800 ${
                errors.job_title && touched.job_title
                  ? 'border-rose-300 bg-rose-50/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            />
            {errors.job_title && touched.job_title && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.job_title}</p>
            )}
          </div>

          {/* Job Type */}
          <div className="space-y-1">
            <label htmlFor="form-job-type" className="text-xs font-semibold text-slate-600">
              Job Type
            </label>
            <select
              id="form-job-type"
              value={formData.job_type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('job_type', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 cursor-pointer font-medium text-slate-800 transition-all"
            >
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label htmlFor="form-status" className="text-xs font-semibold text-slate-600">
              Status
            </label>
            <select
              id="form-status"
              value={formData.status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('status', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 cursor-pointer font-medium text-slate-800 transition-all"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Applied Date */}
          <div className="space-y-1">
            <label htmlFor="form-applied-date" className="text-xs font-semibold text-slate-600">
              Applied Date
            </label>
            <input
              id="form-applied-date"
              type="date"
              value={formData.applied_date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('applied_date', e.target.value)}
              onBlur={() => handleBlur('applied_date')}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all font-medium text-slate-800 ${
                errors.applied_date && touched.applied_date
                  ? 'border-rose-300 bg-rose-50/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            />
            {errors.applied_date && touched.applied_date && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.applied_date}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label htmlFor="form-notes" className="text-xs font-semibold text-slate-600">
              Notes <span className="text-slate-400">(optional)</span>
            </label>
            <textarea
              id="form-notes"
              rows={3}
              placeholder="Add any notes, interview details, or reminders..."
              value={formData.notes || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('notes', e.target.value)}
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
                isEditMode ? 'Update' : 'Add'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
