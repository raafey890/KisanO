import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { defaultQueryOptions } from './defaultOptions';
import { logger } from '../logger';

export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Log all background fetch failures that aren't user-triggered
      logger.error(`Query Failed: ${query.queryKey}`, error, {
        queryKey: query.queryKey,
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, variables, context, mutation) => {
      // Log all mutation failures
      logger.error(`Mutation Failed`, error, {
        variables,
        mutationKey: mutation.options.mutationKey,
      });
    },
  }),
});
