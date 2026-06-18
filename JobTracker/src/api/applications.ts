import type { Application, ApplicationFormData, ApplicationFilters } from '../types';
import { getToken } from './auth';

const API_BASE_URL = '/api/applications';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Helper to construct request headers with JWT authorization
function getHeaders(extraHeaders: Record<string, string> = {}): HeadersInit {
  const headers: Record<string, string> = { ...extraHeaders };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      if (errorBody.message) {
        message = errorBody.message;
      } else if (errorBody.error) {
        message = errorBody.error;
      }
    } catch {
      // Use default message
    }
    throw new ApiError(message, response.status);
  }
  return response.json() as Promise<T>;
}

export async function getApplications(filters?: ApplicationFilters): Promise<Application[]> {
  const params = new URLSearchParams();
  if (filters?.status) {
    params.set('status', filters.status);
  }
  if (filters?.search) {
    params.set('search', filters.search);
  }

  const queryString = params.toString();
  const url = queryString ? `${API_BASE_URL}?${queryString}` : API_BASE_URL;

  const response = await fetch(url, {
    headers: getHeaders(),
  });
  return handleResponse<Application[]>(response);
}

export async function getApplication(id: number | string): Promise<Application> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    headers: getHeaders(),
  });
  return handleResponse<Application>(response);
}

export async function createApplication(data: ApplicationFormData): Promise<Application> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: getHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  return handleResponse<Application>(response);
}

export async function updateApplication(
  id: number | string,
  data: Partial<ApplicationFormData>
): Promise<Application> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: getHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  return handleResponse<Application>(response);
}

export async function deleteApplication(id: number | string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) {
    let message = `Delete failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      if (errorBody.message) message = errorBody.message;
    } catch {
      // Use default
    }
    throw new ApiError(message, response.status);
  }
}
