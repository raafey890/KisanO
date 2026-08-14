import React from 'react';
import { useAuthStore } from '../store/authStore';
import { AuthorizationEngine } from './authorizationEngine';
import { Role } from './roles';

interface RoleGateProps {
  role?: Role;
  allowedRoles?: Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component that only renders its children if the user has the required role.
 */
export const RoleGate: React.FC<RoleGateProps> = ({
  role,
  allowedRoles,
  fallback = null,
  children,
}) => {
  const user = useAuthStore((state) => state.user);
  
  let hasAccess = false;

  if (allowedRoles) {
    hasAccess = AuthorizationEngine.canAccessRoute(user?.role, allowedRoles);
  } else if (role) {
    hasAccess = AuthorizationEngine.hasRole(user?.role, role);
  } else {
    hasAccess = true;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
