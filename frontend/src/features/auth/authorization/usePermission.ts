import { useAuthStore } from '../store/authStore';
import { AuthorizationEngine } from './authorizationEngine';
import { Permission } from './permissions';

/**
 * Hook to check if the current user has a specific permission.
 */
export const usePermission = (permission: Permission): boolean => {
  const user = useAuthStore((state) => state.user);
  return AuthorizationEngine.hasPermission(user?.role, permission);
};

/**
 * Hook to check if the current user has multiple permissions.
 * @param permissions Array of permissions to check.
 * @param mode 'all' requires all permissions, 'any' requires at least one. Default is 'all'.
 */
export const usePermissions = (permissions: Permission[], mode: 'all' | 'any' = 'all'): boolean => {
  const user = useAuthStore((state) => state.user);
  if (mode === 'any') {
    return AuthorizationEngine.hasAnyPermission(user?.role, permissions);
  }
  return AuthorizationEngine.hasAllPermissions(user?.role, permissions);
};
