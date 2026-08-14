import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { queryKeys } from '../../../lib/react-query';
import { useAuthStore } from '../store/authStore';
import { authActions } from '../store/authActions';
import { getAccessToken, getRefreshToken } from '../services/authStorage';
import { useEffect } from 'react';

export const useCurrentUser = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const query = useQuery({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: () => authApi.getCurrentUser(),
    // Only run this query if Zustand says we are authenticated
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  // Synchronize Zustand if the query fetches a fresh user
  useEffect(() => {
    if (query.data && isAuthenticated) {
      const accessToken = getAccessToken() || '';
      const refreshToken = getRefreshToken() || '';
      
      authActions.loginSuccess(query.data, {
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
  }, [query.data, isAuthenticated]);

  return query;
};
