import React from 'react';
import { PermissionGate } from './PermissionGate';
import { Permission } from './permissions';

/**
 * HOC to wrap a component with a permission requirement.
 */
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  permission: Permission,
  fallback?: React.ReactNode
) {
  return function WithPermissionWrapper(props: P) {
    return (
      <PermissionGate permission={permission} fallback={fallback}>
        <WrappedComponent {...props} />
      </PermissionGate>
    );
  };
}
