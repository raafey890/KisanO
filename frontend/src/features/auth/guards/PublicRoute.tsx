import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { selectIsAuthenticated, selectUser } from '../store/authSelectors';
import { ROLE_DASHBOARDS, UserRole } from '../utils/roleHierarchy';

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore(selectUser);

  if (isAuthenticated && user?.role) {
    // Logged in users trying to access public routes (like login)
    // should be redirected to their respective dashboards.
    const redirectPath = ROLE_DASHBOARDS[user.role as UserRole] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
