import { QueryClient } from '@tanstack/react-query';
import type { ApiError } from './client';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;
  }
}

/** Network errors and gateway errors (502/503/504) happen while a sleeping free server wakes up. */
const isWakingUp = (error: ApiError) => error.status === 0 || error.status === 502 || error.status === 503 || error.status === 504;

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: (count, error) => (isWakingUp(error) ? count < 6 : error.status >= 500 && count < 2),
        retryDelay: (attempt) => Math.min(2_000 * 2 ** attempt, 15_000),
      },
    },
  });
}