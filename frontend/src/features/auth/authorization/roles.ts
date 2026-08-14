import { USER_ROLES } from '../utils/roleHierarchy';

export const ROLES = {
  ADMIN: USER_ROLES.ADMIN,
  FARMER: USER_ROLES.FARMER,
  EQUIPMENT_OWNER: USER_ROLES.EQUIPMENT_OWNER,
  SPRAYER: USER_ROLES.SPRAYER,
  OPERATOR: 'OPERATOR', // Legacy / specific to operator dashboard
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
