import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { authActions } from '../store/authActions';
import { RegisterRequest, AuthResponse } from '../types';
import { queryKeys } from '../../../lib/react-query';

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterRequest) => authApi.register(payload),
    onSuccess: (data: AuthResponse) => {
      authActions.loginSuccess(data.user, {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      queryClient.setQueryData(queryKeys.auth.currentUser(), data.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
    },
  });
};
