import React from 'react';
import { usePermission, usePermissions } from './usePermission';
import { Permission } from './permissions';

interface PermissionGateProps {
  permission?: Permission;
  permissions?: Permission[];
  mode?: 'all' | 'any';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component that only renders its children if the user has the required permission(s).
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  permissions,
  mode = 'all',
  fallback = null,
  children,
}) => {
  // Use hooks conditionally (but safe since props shouldn't switch between permission and permissions dynamically)
  let hasAccess = false;
  
  if (permission) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    hasAccess = usePermission(permission);
  } else if (permissions) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    hasAccess = usePermissions(permissions, mode);
  } else {
    // If no permission requirements provided, grant access
    hasAccess = true;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
