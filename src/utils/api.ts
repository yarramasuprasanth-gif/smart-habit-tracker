import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-fb39a48a`;

interface ApiOptions {
  method?: string;
  body?: any;
  token?: string | null;
}

async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error (${endpoint}):`, data.error);
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

export const api = {
  // Auth
  signup: (email: string, name: string, password: string) =>
    apiCall('/signup', {
      method: 'POST',
      body: { email, name, password },
    }),

  login: (email: string, password: string) =>
    apiCall('/login', {
      method: 'POST',
      body: { email, password },
    }),

  // Profile
  getProfile: (token: string) =>
    apiCall('/profile', { token }),

  updateProfile: (token: string, updates: any) =>
    apiCall('/profile', {
      method: 'PUT',
      token,
      body: updates,
    }),

  // Habits
  getHabits: (token: string) =>
    apiCall('/habits', { token }),

  updateHabits: (token: string, habits: any[]) =>
    apiCall('/habits', {
      method: 'POST',
      token,
      body: { habits },
    }),

  toggleHabit: (token: string, habitId: string) =>
    apiCall(`/habits/${habitId}/toggle`, {
      method: 'PUT',
      token,
    }),

  // AI Chat
  sendAiMessage: (token: string, message: string) =>
    apiCall('/ai-chat', {
      method: 'POST',
      token,
      body: { message },
    }),

  // Settings
  getSettings: (token: string) =>
    apiCall('/settings', { token }),

  updateSettings: (token: string, settings: any) =>
    apiCall('/settings', {
      method: 'PUT',
      token,
      body: settings,
    }),

  changePassword: (token: string, newPassword: string) =>
    apiCall('/change-password', {
      method: 'POST',
      token,
      body: { newPassword },
    }),

  exportData: (token: string) =>
    apiCall('/export-data', { token }),
};