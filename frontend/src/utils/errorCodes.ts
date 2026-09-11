export const ErrorCode = {
  // Authentication & Authorization
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  AUTH_ACCOUNT_LOCKED: "AUTH_ACCOUNT_LOCKED",
  AUTH_ACCOUNT_SUSPENDED: "AUTH_ACCOUNT_SUSPENDED",
  AUTH_DUPLICATE_EMAIL: "AUTH_DUPLICATE_EMAIL",
  AUTH_DUPLICATE_PHONE: "AUTH_DUPLICATE_PHONE",
  AUTH_INVALID_OTP: "AUTH_INVALID_OTP",
  AUTH_OTP_EXPIRED: "AUTH_OTP_EXPIRED",
  AUTH_TOO_MANY_REQUESTS: "AUTH_TOO_MANY_REQUESTS",
  AUTH_UNAUTHORIZED: "AUTH_UNAUTHORIZED",
  AUTH_FORBIDDEN: "AUTH_FORBIDDEN",
  AUTH_TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED",
  AUTH_TOKEN_INVALID: "AUTH_TOKEN_INVALID",
  AUTH_SESSION_INVALID: "AUTH_SESSION_INVALID",

  // Validation & System
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  ROUTE_NOT_FOUND: "ROUTE_NOT_FOUND",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",

  // Payments
  PAYMENT_FAILED: "PAYMENT_FAILED",
  PAYMENT_VERIFICATION_FAILED: "PAYMENT_VERIFICATION_FAILED",
  PAYMENT_NOT_FOUND: "PAYMENT_NOT_FOUND",

  // Entities
  BOOKING_NOT_FOUND: "BOOKING_NOT_FOUND",
  BOOKING_INVALID_STATE: "BOOKING_INVALID_STATE",
  EQUIPMENT_NOT_FOUND: "EQUIPMENT_NOT_FOUND",
  EQUIPMENT_UNAVAILABLE: "EQUIPMENT_UNAVAILABLE",
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  PRODUCT_OUT_OF_STOCK: "PRODUCT_OUT_OF_STOCK",

  // External Services
  AI_SERVICE_UNAVAILABLE: "AI_SERVICE_UNAVAILABLE",
  SMS_SERVICE_UNAVAILABLE: "SMS_SERVICE_UNAVAILABLE",
} as const;

export type ErrorCodeType = keyof typeof ErrorCode;

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  AUTH_INVALID_CREDENTIALS: 'Invalid email/phone or password. Please try again.',
  AUTH_DUPLICATE_PHONE: 'An account with this phone number already exists.',
  AUTH_DUPLICATE_EMAIL: 'An account with this email already exists.',
  AUTH_ACCOUNT_LOCKED: 'Account temporarily locked due to too many failed attempts. Please try again in 15 minutes.',
  AUTH_ACCOUNT_SUSPENDED: 'Your account has been suspended. Please contact support.',
  AUTH_INVALID_OTP: 'The OTP you entered is incorrect. Please try again.',
  AUTH_TOO_MANY_REQUESTS: 'Too many attempts. Please try again later.',
  AUTH_TOKEN_EXPIRED: 'Your session has expired. Please sign in again.',
  AUTH_TOKEN_INVALID: 'Invalid session. Please sign in again.',
};

export function getAuthErrorMessage(errorCode?: string, fallback?: string): string {
  if (errorCode && AUTH_ERROR_MESSAGES[errorCode]) {
    return AUTH_ERROR_MESSAGES[errorCode];
  }
  return fallback || 'Something went wrong. Please try again.';
}
