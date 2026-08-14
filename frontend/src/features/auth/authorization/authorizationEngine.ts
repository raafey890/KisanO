import { Role } from './roles';
import { Permission } from './permissions';
import { ROLE_PERMISSIONS } from './rolePermissions';
import { hasAllPermissions as utilsHasAll, hasAnyPermission as utilsHasAny, normalizeRole } from './permissionUtils';

export const AuthorizationEngine = {
  /**
   * Returns the array of permissions associated with a given role.
   */
  getPermissionsForRole(role: string | null | undefined): Permission[] {
    if (!role) return [];
    const normalized = normalizeRole(role) as Role;
    return ROLE_PERMISSIONS[normalized] || [];
  },

  /**
   * Checks if a role has a specific permission.
   */
  hasPermission(role: string | null | undefined, permission: Permission): boolean {
    const permissions = this.getPermissionsForRole(role);
    return permissions.includes(permission);
  },

  /**
   * Checks if a role has ALL of the required permissions.
   */
  hasAllPermissions(role: string | null | undefined, requiredPermissions: Permission[]): boolean {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    const permissions = this.getPermissionsForRole(role);
    return utilsHasAll(permissions, requiredPermissions);
  },

  /**
   * Checks if a role has ANY of the required permissions.
   */
  hasAnyPermission(role: string | null | undefined, requiredPermissions: Permission[]): boolean {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    const permissions = this.getPermissionsForRole(role);
    return utilsHasAny(permissions, requiredPermissions);
  },

  /**
   * Checks if a user's role matches a target role.
   */
  hasRole(userRole: string | null | undefined, targetRole: Role): boolean {
    if (!userRole) return false;
    return normalizeRole(userRole) === targetRole;
  },

  /**
   * Checks if a role is included in a list of allowed roles for a route.
   */
  canAccessRoute(userRole: string | null | undefined, allowedRoles: Role[]): boolean {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    if (!userRole) return false;
    return allowedRoles.includes(normalizeRole(userRole) as Role);
  },
};
