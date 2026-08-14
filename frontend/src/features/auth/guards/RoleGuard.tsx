import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { selectUser } from '../store/authSelectors';
import { UserRole } from '../utils/roleHierarchy';
import { ROUTE_REDIRECTS } from '../utils/routeConstants';
import { AuthorizationEngine } from '../authorization/authorizationEngine';
import { Role } from '../authorization/roles';

export const RoleGuard: React.FC<{ allowedRoles: UserRole[]; children: React.ReactNode }> = ({ allowedRoles, children }) => {
  const user = useAuthStore(selectUser);

  if (!user || !user.role) {
    return <Navigate to={ROUTE_REDIRECTS.UNAUTHENTICATED} replace />;
  }

  // Use the new Authorization Engine
  if (!AuthorizationEngine.canAccessRoute(user.role, allowedRoles as Role[])) {
    return <Navigate to={ROUTE_REDIRECTS.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
};
