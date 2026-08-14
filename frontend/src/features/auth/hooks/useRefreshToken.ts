import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { authActions } from '../store/authActions';
import { queryKeys } from '../../../lib/react-query';
import { getAccessToken, getRefreshToken } from '../services/authStorage';
import { AuthResponse } from '../types';

export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.refreshToken(),
    onSuccess: (data: AuthResponse) => {
      // 1. authApi handles saving the new tokens via authStorage
      // 2. Sync Zustand
      authActions.loginSuccess(data.user, {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      // 3. Update cache
      queryClient.setQueryData(queryKeys.auth.currentUser(), data.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
    },
    onError: () => {
      // If refresh token fails, we clear the session
      queryClient.removeQueries({ queryKey: queryKeys.auth.all });
      authActions.logout();
    }
  });
};
