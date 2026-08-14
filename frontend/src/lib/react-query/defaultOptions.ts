import { DefaultOptions } from '@tanstack/react-query';

export const defaultQueryOptions: DefaultOptions = {
  queries: {
    // Stale time: how long data is considered fresh (5 minutes)
    staleTime: 5 * 60 * 1000,
    
    // Garbage collection time (cache time): how long data stays in cache after unmount (15 minutes)
    gcTime: 15 * 60 * 1000,
    
    // Retry policy: retry once, but don't retry on 401/403/404 errors
    retry: (failureCount, error: any) => {
      const status = error?.status;
      if (status === 401 || status === 403 || status === 404) return false;
      return failureCount < 1;
    },
    
    // Retry delay with exponential backoff (starts at 1s)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Window focus behavior: only refetch if data is stale
    refetchOnWindowFocus: true,
    
    // Reconnect behavior: refetch when network restores
    refetchOnReconnect: true,
    
    // Network recovery: wait for network before failing
    networkMode: 'online',
  },
  mutations: {
    // Generally don't retry mutations automatically to avoid duplicate actions
    retry: false,
    networkMode: 'online',
  },
};
