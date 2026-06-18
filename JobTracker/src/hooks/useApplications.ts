import { useState, useEffect, useCallback, useRef } from 'react';
import type { Application, ApplicationFormData, ApplicationFilters, ApplicationStatus } from '../types';
import * as api from '../api/applications';

interface UseApplicationsReturn {
  applications: Application[];
  loading: boolean;
  error: string | null;
  filters: ApplicationFilters;
  setStatusFilter: (status: ApplicationStatus | '') => void;
  setSearchQuery: (query: string) => void;
  createApp: (data: ApplicationFormData) => Promise<boolean>;
  updateApp: (id: number | string, data: Partial<ApplicationFormData>) => Promise<boolean>;
  deleteApp: (id: number | string) => Promise<boolean>;
  refetch: () => void;
  mutating: boolean;
}

export function useApplications(isAuthenticated: boolean): UseApplicationsReturn {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);
  const [filters, setFilters] = useState<ApplicationFilters>({ status: '', search: '' });

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchApplications = useCallback(async () => {
    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const data = await api.getApplications();
      setApplications(data);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'Failed to fetch applications';
      setError(message);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
    } else {
      setApplications([]);
      setLoading(false);
      setError(null);
    }
  }, [fetchApplications, isAuthenticated]);

  const setStatusFilter = useCallback((status: ApplicationStatus | '') => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    // Debounce search by 300ms
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: query }));
    }, 300);
  }, []);

  const refetch = useCallback(() => {
    if (isAuthenticated) {
      fetchApplications();
    }
  }, [fetchApplications, isAuthenticated]);

  const createApp = useCallback(async (data: ApplicationFormData): Promise<boolean> => {
    setMutating(true);
    try {
      const created = await api.createApplication(data);
      // Optimistic: prepend to list
      setApplications((prev) => [created, ...prev]);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create application';
      setError(message);
      return false;
    } finally {
      setMutating(false);
    }
  }, []);

  const updateApp = useCallback(async (id: number | string, data: Partial<ApplicationFormData>): Promise<boolean> => {
    setMutating(true);
    try {
      const updated = await api.updateApplication(id, data);
      // Optimistic: replace in list
      setApplications((prev) => prev.map((app) => (app.id === id ? updated : app)));
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update application';
      setError(message);
      return false;
    } finally {
      setMutating(false);
    }
  }, []);

  const deleteApp = useCallback(async (id: number | string): Promise<boolean> => {
    setMutating(true);
    try {
      await api.deleteApplication(id);
      // Optimistic: remove from list
      setApplications((prev) => prev.filter((app) => app.id !== id));
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete application';
      setError(message);
      return false;
    } finally {
      setMutating(false);
    }
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return {
    applications,
    loading,
    error,
    filters,
    setStatusFilter,
    setSearchQuery,
    createApp,
    updateApp,
    deleteApp,
    refetch,
    mutating,
  };
}
