export const FARMER_ENDPOINTS = {
  DASHBOARD: '/dashboards/farmer',
  EQUIPMENT: '/equipment',
  EQUIPMENT_DETAIL: (id: string) => `/equipment/${id}`,
  
  // Placeholders for remaining modules (Do not implement fake logic yet)
  MARKETPLACE: '/marketplace', // TODO: Backend integration pending
  AI_DOCTOR: '/ai-doctor', // TODO: Backend integration pending
  BOOKINGS: '/bookings', // TODO: Backend integration pending
  WALLET: '/wallet', // TODO: Backend integration pending
  NOTIFICATIONS: '/notifications', // TODO: Backend integration pending
  PROFILE: '/profile', // TODO: Backend integration pending
  SETTINGS: '/settings', // TODO: Backend integration pending
};
