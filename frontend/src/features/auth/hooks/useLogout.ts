import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { authActions } from '../store/authActions';
import { queryKeys } from '../../../lib/react-query';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onMutate: () => {
      // Optimistic update
      authActions.logout();
    },
    onSettled: () => {
      // Regardless of success or failure, we clear auth from cache
      // We do NOT use queryClient.clear() to avoid wiping non-auth data like products/equipment
      queryClient.removeQueries({ queryKey: queryKeys.auth.all });
      
      // authApi.logout() automatically destroys the session via authSession.ts
      authActions.logout();
    },
  });
};
