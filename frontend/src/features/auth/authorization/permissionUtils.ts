import { Permission } from './permissions';

/**
 * Checks if an array of permissions contains all of the required permissions.
 */
export const hasAllPermissions = (userPermissions: Permission[], requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.every((perm) => userPermissions.includes(perm));
};

/**
 * Checks if an array of permissions contains at least one of the required permissions.
 */
export const hasAnyPermission = (userPermissions: Permission[], requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.some((perm) => userPermissions.includes(perm));
};

/**
 * Normalizes a role string to match the internal ROLES type.
 */
export const normalizeRole = (role: string | null | undefined): string => {
  return role ? role.trim().toUpperCase() : '';
};
