import { useAuthStore } from '../store/authStore';
import { AuthorizationEngine } from './authorizationEngine';
import { Role } from './roles';

/**
 * Hook to check if the current user has a specific role.
 */
export const useRole = (role: Role): boolean => {
  const user = useAuthStore((state) => state.user);
  return AuthorizationEngine.hasRole(user?.role, role);
};
