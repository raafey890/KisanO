export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
} as const;

export const AUTH_EVENTS = {
  LOGOUT_TRIGGERED: 'auth:logout',
  SESSION_EXPIRED: 'auth:expired',
} as const;

export const DEFAULT_REDIRECTS = {
  AFTER_LOGIN: '/dashboard',
  AFTER_LOGOUT: '/login',
} as const;
