import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { selectUser } from '../store/authSelectors';
import { Permission } from '../authorization/permissions';
import { ROUTE_REDIRECTS } from '../utils/routeConstants';
import { AuthorizationEngine } from '../authorization/authorizationEngine';

export const PermissionGuard: React.FC<{ requiredPermissions: Permission[]; children: React.ReactNode }> = ({ requiredPermissions, children }) => {
  const user = useAuthStore(selectUser);
  
  const hasPermission = AuthorizationEngine.hasAllPermissions(user?.role, requiredPermissions);

  if (!hasPermission) {
    return <Navigate to={ROUTE_REDIRECTS.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};
