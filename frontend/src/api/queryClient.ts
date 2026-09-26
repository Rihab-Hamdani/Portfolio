import { QueryClient } from '@tanstack/react-query';
import type { ApiError } from './client';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;
  }
}

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: (count, error) => error.status >= 500 && count < 2,
      },
    },
  });
}
