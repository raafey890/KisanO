import { TOKEN_KEYS } from '../constants/auth.constants';

export const saveAccessToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
};

export const saveRefreshToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
};

export const removeTokens = (): void => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
};

export const clearAuth = (): void => {
  removeTokens();
  // Clear any other auth-related items from storage if needed
};
