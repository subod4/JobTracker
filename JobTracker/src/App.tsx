import { useState } from 'react';
import type { Application, ApplicationFormData, User } from './types';
import { useApplications } from './hooks/useApplications';
import { getCurrentUser, logout as authLogout } from './api/auth';
import Layout from './components/Layout';
import AuthScreen from './components/AuthScreen';
import ApplicationList from './components/ApplicationList';
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

  // Render Authentication screen if user is not logged in
  if (!user) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
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
