import { useState, useMemo } from 'react';
import type { Application, ApplicationStatus } from '../types';
import { formatDate, getJobTypeBadgeClasses } from '../utils/formatting';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';

interface ApplicationListProps {
  applications: Application[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: ApplicationStatus | '';
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: ApplicationStatus | '') => void;
  onAddNew: () => void;
  onView: (app: Application) => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
}

const ITEMS_PER_PAGE = 8;

const STATUS_OPTIONS: { value: ApplicationStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'Applied', label: 'Applied' },
  { value: 'Interviewing', label: 'Interviewing' },
  { value: 'Offer', label: 'Offer' },
  { value: 'Rejected', label: 'Rejected' },
];

export default function ApplicationList({
  applications,
  loading,
  error,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onAddNew,
  onView,
  onEdit,
  onDelete,
}: ApplicationListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Whenever status filter changes, reset to page 1
  const handleStatusChange = (status: ApplicationStatus | '') => {
    setCurrentPage(1);
    onStatusFilterChange(status);
  };

  const handleSearchInput = (value: string) => {
    setLocalSearch(value);
    setCurrentPage(1);
    onSearchChange(value);
  };

  // Calculate status counts from the unfiltered applications list
  // Since applications is the raw list of all user applications, this count is always correct!
  const statusCounts = useMemo(() => {
    const counts = { all: applications.length, Applied: 0, Interviewing: 0, Offer: 0, Rejected: 0 };
    applications.forEach((app) => {
      if (app.status in counts) {
        counts[app.status as keyof typeof counts] += 1;
      }
    });
    return counts;
  }, [applications]);

  // Filter applications by status and search queries on client-side
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus = !statusFilter || app.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        app.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.job_title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [applications, statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredApps.length / ITEMS_PER_PAGE));
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Ensure current page stays valid
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  return (
    <div className="space-y-6" id="application-list-container">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" id="kpi-cards">
        <button
          onClick={() => handleStatusChange('')}
          className={`bg-white border p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-all cursor-pointer text-left group ${
            statusFilter === '' ? 'border-slate-800 ring-1 ring-slate-800/10 shadow-sm' : 'border-slate-100 hover:border-slate-300'
          }`}
          id="kpi-all"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-600 transition-colors">
            Total
          </span>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-800 leading-none">{statusCounts.all}</div>
            <span className="text-[10px] text-slate-400">applications</span>
          </div>
        </button>

        <button
          onClick={() => handleStatusChange('Applied')}
          className={`bg-white border p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-all cursor-pointer text-left group ${
            statusFilter === 'Applied' ? 'border-sky-500 ring-1 ring-sky-500/10 shadow-sm' : 'border-slate-100 hover:border-sky-200'
          }`}
          id="kpi-applied"
        >
          <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Applied</span>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-800 leading-none">{statusCounts.Applied}</div>
            <span className="text-[10px] text-slate-400">waiting</span>
          </div>
        </button>

        <button
          onClick={() => handleStatusChange('Interviewing')}
          className={`bg-white border p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-all cursor-pointer text-left group ${
            statusFilter === 'Interviewing' ? 'border-amber-500 ring-1 ring-amber-500/10 shadow-sm' : 'border-slate-100 hover:border-amber-200'
          }`}
          id="kpi-interviewing"
        >
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Interviewing</span>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-800 leading-none">{statusCounts.Interviewing}</div>
            <span className="text-[10px] text-amber-600">in progress</span>
          </div>
        </button>

        <button
          onClick={() => handleStatusChange('Offer')}
          className={`bg-white border p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-all cursor-pointer text-left group ${
            statusFilter === 'Offer' ? 'border-emerald-500 ring-1 ring-emerald-500/10 shadow-sm' : 'border-slate-100 hover:border-emerald-200'
          }`}
          id="kpi-offers"
        >
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Offers</span>
          <div className="mt-2">
            <div className="text-2xl font-bold text-emerald-700 leading-none">{statusCounts.Offer}</div>
            <span className="text-[10px] text-emerald-500">received</span>
          </div>
        </button>

        <button
          onClick={() => handleStatusChange('Rejected')}
          className={`bg-white border p-4 rounded-xl flex flex-col justify-between hover:shadow-md transition-all cursor-pointer text-left group ${
            statusFilter === 'Rejected' ? 'border-rose-500 ring-1 ring-rose-500/10 shadow-sm' : 'border-slate-100 hover:border-rose-200'
          }`}
          id="kpi-rejected"
        >
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Rejected</span>
          <div className="mt-2">
            <div className="text-2xl font-bold text-slate-800 leading-none">{statusCounts.Rejected}</div>
            <span className="text-[10px] text-rose-600">declined</span>
          </div>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs" id="controls-bar">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by company or job title..."
              value={localSearch}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="w-full text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800/15 focus:border-slate-800 rounded-xl transition-all font-medium text-slate-800"
              id="search-input"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus | '')}
                className="text-sm font-semibold py-1.5 bg-transparent border-none focus:outline-none cursor-pointer text-slate-700"
                id="status-filter-select"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Add Button */}
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
        </div>
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
      ) : filteredApps.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-xl shadow-xs">
          <EmptyState
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title={statusFilter || localSearch ? 'No matching applications' : 'No applications yet'}
            description={
              statusFilter || localSearch
                ? 'Try adjusting your search or filter criteria.'
                : 'Start tracking your job applications by adding your first one.'
            }
            action={
              statusFilter || localSearch
                ? {
                    label: 'Clear Filters',
                    onClick: () => {
                      handleSearchInput('');
                      handleStatusChange('');
                    },
                  }
                : {
                    label: 'Add Your First Application',
                    onClick: onAddNew,
                  }
            }
          />
        </div>
      ) : (
        /* Data Table */
        <div className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden" id="applications-table-container">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100" id="applications-table">
              <thead className="bg-slate-50/70">
                <tr>
                  <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Company</th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Job Title</th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-5 py-3.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Applied</th>
                  <th scope="col" className="px-5 py-3.5 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-50">
                {paginatedApps.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    onClick={() => onView(app)}
                    id={`row-${app.id}`}
                  >
                    {/* Company */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center font-bold text-xs select-none shadow-sm uppercase shrink-0">
                          {app.company_name.substring(0, 2)}
                        </div>
                        <span className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                          {app.company_name}
                        </span>
                      </div>
                    </td>

                    {/* Job Title */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-600">{app.job_title}</span>
                    </td>

                    {/* Job Type */}
                    <td className="px-5 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getJobTypeBadgeClasses(app.job_type)}`}>
                        {app.job_type}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>

                    {/* Applied Date */}
                    <td className="px-5 py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className="text-xs text-slate-500 font-mono">{formatDate(app.applied_date)}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onView(app)}
                          className="p-1.5 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                          title="View Details"
                          id={`view-btn-${app.id}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onEdit(app)}
                          className="p-1.5 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                          title="Edit"
                          id={`edit-btn-${app.id}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(app)}
                          className="p-1.5 rounded-lg border border-transparent hover:border-rose-200 hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-all cursor-pointer"
                          title="Delete"
                          id={`delete-btn-${app.id}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between bg-slate-50/30" id="pagination-bar">
              <p className="text-xs text-slate-400">
                Showing <span className="font-semibold text-slate-600">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>
                –<span className="font-semibold text-slate-600">{Math.min(currentPage * ITEMS_PER_PAGE, filteredApps.length)}</span>
                {' '}of <span className="font-semibold text-slate-600">{filteredApps.length}</span> applications
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  id="page-prev"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                      page === currentPage
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                    id={`page-${page}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                  id="page-next"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
