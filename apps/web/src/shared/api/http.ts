import axios from 'axios';
import { env } from '@/shared/config/env';
import { useAuthStore } from '@/stores/auth.store';
import { usePreferencesStore } from '@/stores/preferences.store';

/**
 * The single HTTP client. Feature `api.ts` files use it; components never call axios directly.
 * Adds the bearer token and the UI language; clears the session when the API answers 401.
 */
export const http = axios.create({
  baseURL: env.apiUrl,
  timeout: 20_000,
});

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['Accept-Language'] = usePreferencesStore.getState().locale;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // ProtectedRoute notices the cleared session and redirects to /login.
      useAuthStore.getState().clearSession();
    }
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  },
);
