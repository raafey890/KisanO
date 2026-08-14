import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { authActions } from '../store/authActions';
import { hasAccessToken, hasRefreshToken, isTokenExpired, destroySession } from '../services/authSession';
import { getAccessToken, getRefreshToken } from '../services/authStorage';
import { authApi } from '../api/authApi';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const initializingRef = useRef(false); // Prevent strict-mode double firing

  useEffect(() => {
    // Idempotency guard
    if (isInitialized || initializingRef.current) return;
    initializingRef.current = true;

    const bootstrapAuth = async () => {
      try {
        const hasAccess = hasAccessToken();
        const hasRefresh = hasRefreshToken();

        // 1. If no tokens exist, we are unauthenticated
        if (!hasAccess && !hasRefresh) {
          authActions.resetAuth();
          authActions.setInitialized(true);
          return;
        }

        // 2. We have a token, optionally refresh if expired, but let's just fetch user
        // Note: authApi handles token inclusion via interceptors.
        // If the token is invalid, this will throw an error (e.g., 401).
        const user = await authApi.getCurrentUser();
        
        // 3. Validation succeeded, sync state
        // We retrieve tokens from storage since authSession holds them
        const accessToken = getAccessToken() || '';
        const refreshToken = getRefreshToken() || '';
        
        authActions.loginSuccess(user, { access_token: accessToken, refresh_token: refreshToken });
      } catch (error) {
        // 4. Validation failed (network error, invalid token, etc.)
        console.error('Auth Initialization failed:', error);
        destroySession();
        authActions.resetAuth();
      } finally {
        // 5. Mark as initialized
        authActions.setInitialized(true);
      }
    };

    bootstrapAuth();
  }, [isInitialized]);

  // Show a minimal loading state while bootstrapping
  if (!isInitialized) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading application...</p>
      </div>
    );
  }

  return <>{children}</>;
};
