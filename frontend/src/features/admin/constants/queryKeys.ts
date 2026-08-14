export const adminKeys = {
  all: ['admin'] as const,
  equipment: () => [...adminKeys.all, 'equipment'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  verifications: () => [...adminKeys.all, 'verifications'] as const,
};
