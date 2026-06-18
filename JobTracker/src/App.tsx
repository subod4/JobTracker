import { useState } from 'react';
import type { Application, ApplicationFormData, ApplicationStatus, User } from './types';
import { useApplications } from './hooks/useApplications';
import { getCurrentUser, logout as authLogout } from './api/auth';
import Layout from './components/Layout';
import AuthScreen from './components/AuthScreen';
import ApplicationList from './components/ApplicationList';
import ApplicationKanban from './components/ApplicationKanban';
import ApplicationForm from './components/ApplicationForm';
import ApplicationDetail from './components/ApplicationDetail';
import DeleteConfirmModal from './components/DeleteConfirmModal';

type ModalState =
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; application: Application }
  | { type: 'view'; application: Application }
  | { type: 'delete'; application: Application };

export default function App() {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const {
    applications,
    loading,
    error,
    filters,
    setStatusFilter,
    setSearchQuery,
    createApp,
    updateApp,
    deleteApp,
    mutating,
  } = useApplications(!!user);

  const [modal, setModal] = useState<ModalState>({ type: 'none' });

  // --- Auth handlers ---
  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
    setModal({ type: 'none' });
  };

  // --- Modal handlers ---
  const openAdd = () => setModal({ type: 'add' });
  const openEdit = (app: Application) => setModal({ type: 'edit', application: app });
  const openView = (app: Application) => setModal({ type: 'view', application: app });
  const openDelete = (app: Application) => setModal({ type: 'delete', application: app });
  const closeModal = () => setModal({ type: 'none' });

  // --- CRUD handlers ---
  const handleCreate = async (data: ApplicationFormData): Promise<boolean> => {
    const success = await createApp(data);
    return success;
  };

  const handleUpdate = async (data: ApplicationFormData): Promise<boolean> => {
    if (modal.type !== 'edit') return false;
    const success = await updateApp(modal.application.id, data);
    return success;
  };

  const handleDelete = async () => {
    if (modal.type !== 'delete') return;
    const success = await deleteApp(modal.application.id);
    if (success) {
      closeModal();
    }
  };

  // View → Edit transition
  const handleViewToEdit = () => {
    if (modal.type === 'view') {
      setModal({ type: 'edit', application: modal.application });
    }
  };

  // View → Delete transition
  const handleViewToDelete = () => {
    if (modal.type === 'view') {
      setModal({ type: 'delete', application: modal.application });
    }
  };

  // Kanban status change handler
  const handleKanbanStatusChange = async (appId: number | string, newStatus: ApplicationStatus) => {
    const app = applications.find((a) => a.id === appId);
    if (app) {
      const updatedData: ApplicationFormData = {
        company_name: app.company_name,
        job_title: app.job_title,
        job_type: app.job_type,
        status: newStatus,
        applied_date: app.applied_date,
        notes: app.notes,
      };
      await updateApp(appId, updatedData);
    }
  };

  // Render Authentication screen if user is not logged in
  if (!user) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="space-y-4">
        {/* View Toggle */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setViewMode('list')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="List View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Kanban View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="hidden sm:inline">Kanban</span>
          </button>
        </div>

        {/* View Content */}
        {viewMode === 'list' ? (
          <ApplicationList
            applications={applications}
            loading={loading}
            error={error}
            searchQuery={filters.search || ''}
            statusFilter={filters.status || ''}
            onSearchChange={setSearchQuery}
            onStatusFilterChange={setStatusFilter}
            onAddNew={openAdd}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        ) : (
          <ApplicationKanban
            applications={applications}
            loading={loading}
            error={error}
            searchQuery={filters.search || ''}
            onAddNew={openAdd}
            onEdit={openEdit}
            onDelete={openDelete}
            onStatusChange={handleKanbanStatusChange}
          />
        )}
      </div>

      {/* Add Modal */}
      <ApplicationForm
        isOpen={modal.type === 'add'}
        onClose={closeModal}
        onSubmit={handleCreate}
        loading={mutating}
      />

      {/* Edit Modal */}
      <ApplicationForm
        isOpen={modal.type === 'edit'}
        onClose={closeModal}
        onSubmit={handleUpdate}
        editApplication={modal.type === 'edit' ? modal.application : null}
        loading={mutating}
      />

      {/* View Modal */}
      <ApplicationDetail
        isOpen={modal.type === 'view'}
        application={modal.type === 'view' ? modal.application : null}
        onClose={closeModal}
        onEdit={handleViewToEdit}
        onDelete={handleViewToDelete}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={modal.type === 'delete'}
        companyName={modal.type === 'delete' ? modal.application.company_name : ''}
        jobTitle={modal.type === 'delete' ? modal.application.job_title : ''}
        onConfirm={handleDelete}
        onCancel={closeModal}
        loading={mutating}
      />
    </Layout>
  );
}
