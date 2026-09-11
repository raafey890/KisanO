export const USER_ROLES = {
  ADMIN: 'Admin',
  SUPER_ADMIN: 'SuperAdmin',
  FARMER: 'Farmer',
  EQUIPMENT_OWNER: 'EquipmentOwner',
  SPRAYER: 'SprayerOperator',
  SELLER: 'Seller',
  SUPPORT: 'SupportAgent',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Map roles to a hierarchy or default dashboard
export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: '/admin/dashboard',
  [USER_ROLES.SUPER_ADMIN]: '/admin/dashboard',
  [USER_ROLES.FARMER]: '/farmer/dashboard',
  [USER_ROLES.EQUIPMENT_OWNER]: '/owner/dashboard',
  [USER_ROLES.SPRAYER]: '/operator/dashboard',
  [USER_ROLES.SELLER]: '/seller/dashboard',
  [USER_ROLES.SUPPORT]: '/admin/dashboard', // Example mapped fallback
};
