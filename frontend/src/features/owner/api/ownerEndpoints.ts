export const OWNER_ENDPOINTS = {
  DASHBOARD: '/dashboards/owner', // Placeholder
  EQUIPMENT: '/equipment', // For fetching fleet
  EQUIPMENT_DETAIL: (id: string) => `/equipment/${id}`, // Placeholder
  BOOKINGS: '/bookings',
  BOOKING_STATUS: (id: string) => `/bookings/${id}/status`,
  
  // Placeholders for remaining modules
  EARNINGS: '/earnings', // TODO: Backend integration pending
  NOTIFICATIONS: '/notifications', // TODO: Backend integration pending
  PROFILE: '/profile', // TODO: Backend integration pending
  SETTINGS: '/settings', // TODO: Backend integration pending
};
