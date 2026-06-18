import type { AuthResponse, User } from '../types';

const AUTH_BASE_URL = '/api/auth';

class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

async function handleAuthResponse(response: Response): Promise<AuthResponse> {
  if (!response.ok) {
    let message = 'Authentication failed';
    try {
      const errorBody = await response.json();
      if (errorBody.error) {
        message = errorBody.error;
      } else if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // Fallback message
    }
    throw new AuthError(message, response.status);
  }
  
  const data = (await response.json()) as AuthResponse;
  
  // Save credentials on success
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleAuthResponse(response);
}

export async function signup(name: string, email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleAuthResponse(response);
}

export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}
