import { useMemo, useState } from 'react';
import type { Application, ApplicationStatus } from '../types';
import { formatDate, getJobTypeBadgeClasses } from '../utils/formatting';
import LoadingSpinner from './LoadingSpinner';

interface ApplicationKanbanProps {
  applications: Application[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  onAddNew: () => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  onStatusChange?: (appId: number | string, newStatus: ApplicationStatus) => void;
}

const STATUSES: ApplicationStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

const STATUS_CONFIG = {
  Applied: {
    label: 'Applied',
    color: 'sky',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
  },
  Interviewing: {
    label: 'Interviewing',
    color: 'amber',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
  },
  Offer: {
    label: 'Offer',
    color: 'emerald',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
  },
  Rejected: {
    label: 'Rejected',
    color: 'rose',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-700',
  },
};

function KanbanCard({
  app,
  onEdit,
  onDelete,
}: {
  app: Application;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
}) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application', JSON.stringify(app));
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-move group active:opacity-50"
    >
      <div className="space-y-3">
        {/* Job Title */}
        <div>
          <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 group-hover:text-slate-900">
            {app.job_title}
          </h3>
          <p className="text-xs text-slate-500 mt-1">{app.company_name}</p>
        </div>

        {/* Job Type Badge */}
        <div>
          <span
            className={`inline-block text-xs font-medium px-2 py-1 border rounded-md ${getJobTypeBadgeClasses(
              app.job_type
            )}`}
          >
            {app.job_type}
          </span>
        </div>

        {/* Applied Date */}
        <div className="text-[11px] text-slate-400">
          {formatDate(app.applied_date)}
        </div>

        {/* Notes Preview */}
        {app.notes && (
          <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100">
            {app.notes}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onEdit(app);
            }}
            className="flex-1 px-2 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded transition-colors"
            title="Edit"
          >
            Edit
          </button>
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onDelete(app);
            }}
            className="flex-1 px-2 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded transition-colors"
            title="Delete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({
  status,
  applications,
  searchQuery,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  status: ApplicationStatus;
  applications: Application[];
  searchQuery: string;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  onStatusChange?: (appId: number | string, newStatus: ApplicationStatus) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const config = STATUS_CONFIG[status];

  // Filter applications by search query
  const filteredApps = useMemo(() => {
    if (!searchQuery) return applications;
    return applications.filter(
      (app) =>
        app.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.job_title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [applications, searchQuery]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const data = e.dataTransfer.getData('application');
    if (data && onStatusChange) {
      try {
        const app: Application = JSON.parse(data);
        if (app.status !== status) {
          onStatusChange(app.id, status);
        }
      } catch (err) {
        // Silent fail for drag and drop parsing errors
      }
    }
  };

  return (
    <div className="flex-1 min-w-80 flex flex-col">
      <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 mb-4`}>
        <div className="flex items-center justify-between">
          <h2 className={`font-bold text-sm ${config.textColor}`}>{config.label}</h2>
          <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full ${config.bgColor} ${config.textColor}`}>
            {filteredApps.length}
          </span>
        </div>
      </div>

      {/* Cards Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 space-y-3 overflow-y-auto pr-2 p-3 rounded-lg border-2 border-dashed transition-all ${
          isDragOver
            ? 'border-slate-400 bg-slate-50'
            : 'border-slate-200 bg-transparent'
        }`}
      >
        {filteredApps.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400">No applications</p>
          </div>
        ) : (
          filteredApps.map((app: Application) => (
            <KanbanCard
              key={app.id}
              app={app}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function ApplicationKanban({
  applications,
  loading,
  error,
  searchQuery,
  onAddNew,
  onEdit,
  onDelete,
  onStatusChange,
}: ApplicationKanbanProps) {
  // Group applications by status
  const applicationsByStatus = useMemo(() => {
    const grouped: Record<ApplicationStatus, Application[]> = {
      Applied: [],
      Interviewing: [],
      Offer: [],
      Rejected: [],
    };

    applications.forEach((app) => {
      grouped[app.status].push(app);
    });

    return grouped;
  }, [applications]);

  // Calculate total counts
  const totalCounts = useMemo(() => {
    const counts = { all: applications.length, Applied: 0, Interviewing: 0, Offer: 0, Rejected: 0 };
    applications.forEach((app) => {
      if (app.status in counts) {
        counts[app.status as keyof typeof counts] += 1;
      }
    });
    return counts;
  }, [applications]);

  return (
    <div className="space-y-6" id="application-kanban-container">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" id="kpi-cards">
        <div className="bg-white border border-slate-100 p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-all cursor-default text-left group">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total
          </span>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-800 leading-none">{totalCounts.all}</div>
            <span className="text-[10px] text-slate-400">applications</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-all cursor-default text-left group">
          <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Applied</span>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-800 leading-none">{totalCounts.Applied}</div>
            <span className="text-[10px] text-slate-400">waiting</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-all cursor-default text-left group">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Interviewing</span>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-800 leading-none">{totalCounts.Interviewing}</div>
            <span className="text-[10px] text-amber-600">in progress</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-all cursor-default text-left group">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Offers</span>
          <div className="mt-2">
            <div className="text-2xl font-bold text-emerald-700 leading-none">{totalCounts.Offer}</div>
            <span className="text-[10px] text-emerald-500">received</span>
          </div>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-white transition-all cursor-pointer shadow-sm"
          id="add-application-btn"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add Application</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <LoadingSpinner message="Loading applications..." />
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center space-y-2" id="error-state">
          <div className="w-10 h-10 mx-auto rounded-full bg-rose-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-rose-700">Failed to load applications</p>
          <p className="text-xs text-rose-500">{error}</p>
          <p className="text-[10px] text-rose-400">Make sure the backend server is running and try refreshing.</p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 bg-white rounded-xl border border-slate-100 p-4 shadow-xs">
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              applications={applicationsByStatus[status]}
              searchQuery={searchQuery}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
