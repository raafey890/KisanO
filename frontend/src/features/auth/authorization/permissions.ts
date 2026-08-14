export const PERMISSIONS = {
  // Admin Permissions
  ADMIN_DASHBOARD: 'admin:dashboard',
  MANAGE_USERS: 'admin:manage_users',
  MANAGE_VERIFICATIONS: 'admin:manage_verifications',
  MANAGE_MARKETPLACE: 'admin:manage_marketplace',
  VIEW_REPORTS: 'admin:view_reports',
  VIEW_LOGS: 'admin:view_logs',

  // Equipment Owner Permissions
  EQUIPMENT_CREATE: 'equipment:create',
  EQUIPMENT_UPDATE: 'equipment:update',
  EQUIPMENT_DELETE: 'equipment:delete',
  EQUIPMENT_VIEW: 'equipment:view',

  // Booking Permissions
  BOOKING_CREATE: 'booking:create',
  BOOKING_UPDATE: 'booking:update',
  BOOKING_CANCEL: 'booking:cancel',
  BOOKING_VIEW: 'booking:view',

  // Farmer Specific Permissions
  FARMER_DASHBOARD: 'farmer:dashboard',
  RENT_EQUIPMENT: 'farmer:rent_equipment',
  HIRE_SPRAYER: 'farmer:hire_sprayer',
  PURCHASE_SUPPLIES: 'farmer:purchase_supplies',

  // Sprayer Permissions
  SPRAYER_DASHBOARD: 'sprayer:dashboard',
  MANAGE_SPRAY_SERVICES: 'sprayer:manage_services',
  ACCEPT_SPRAY_JOB: 'sprayer:accept_job',

  // AI & General Permissions
  AI_DOCTOR: 'ai:doctor',
  AI_RECOMMENDATION: 'ai:recommendation',
  VIEW_WALLET: 'wallet:view',
  UPDATE_WALLET: 'wallet:update',
  VIEW_PAYMENT: 'payment:view',
  CREATE_PAYMENT: 'payment:create',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
