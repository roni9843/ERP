/** Typed access to build-time environment variables (see apps/web/.env.example). */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1',
} as const;
