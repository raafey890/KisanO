// Define atomic permissions for future ABAC readiness
export const PERMISSIONS = {
  CAN_MANAGE_USERS: 'CAN_MANAGE_USERS',
  CAN_ADD_EQUIPMENT: 'CAN_ADD_EQUIPMENT',
  CAN_BOOK_EQUIPMENT: 'CAN_BOOK_EQUIPMENT',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Currently unused, ready for fine-grained checks
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  '/owner/equipment/add': [PERMISSIONS.CAN_ADD_EQUIPMENT],
};
