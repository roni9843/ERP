import { QueryClient } from '@tanstack/react-query';
import { isClientError } from './errors';

/** Server state lives in TanStack Query; Zustand is only for client-side state. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => !isClientError(error) && failureCount < 2,
    },
    mutations: { retry: false },
  },
});
