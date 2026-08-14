import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { authActions } from '../store/authActions';
import { LoginRequest, AuthResponse } from '../types';
import { queryKeys } from '../../../lib/react-query';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data: AuthResponse) => {
      // 1. authApi handles saving the session via authStorage
      // 2. Sync Zustand state
      authActions.loginSuccess(data.user, {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      // 3. Update query cache for current user directly to avoid another fetch
      queryClient.setQueryData(queryKeys.auth.currentUser(), data.user);
      
      // 4. Invalidate related auth queries if necessary
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
    },
  });
};
