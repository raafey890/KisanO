export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    currentUser: () => [...queryKeys.auth.all, 'currentUser'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
    permissions: () => [...queryKeys.auth.all, 'permissions'] as const,
  },
  users: {
    all: ['users'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.users.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
  },
  equipment: {
    all: ['equipment'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.equipment.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.equipment.all, 'detail', id] as const,
  },
  bookings: {
    all: ['bookings'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.bookings.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.bookings.all, 'detail', id] as const,
  },
  // Add additional domains here as needed
} as const;
