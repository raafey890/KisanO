import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { selectIsAuthenticated, selectIsInitialized } from '../store/authSelectors';
import { ROUTE_REDIRECTS } from '../utils/routeConstants';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isInitialized = useAuthStore(selectIsInitialized);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const location = useLocation();

  // If AuthInitializer is still booting, we let it handle the loading state or render null.
  // Actually, AuthInitializer already blocks rendering of Routes entirely,
  // but just in case this is used outside that tree, we return null until ready.
  if (!isInitialized) return null;

  if (!isAuthenticated) {
    // Pass the current location in state so we can redirect back after login
    return <Navigate to={ROUTE_REDIRECTS.UNAUTHENTICATED} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
