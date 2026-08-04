import { getAccessToken, getRefreshToken, clearAuth, saveAccessToken, saveRefreshToken } from './authStorage';
import { TokenPair } from '../types/token.types';

export const hasAccessToken = (): boolean => {
  return !!getAccessToken();
};

export const hasRefreshToken = (): boolean => {
  return !!getRefreshToken();
};

export const isLoggedIn = (): boolean => {
  return hasAccessToken();
};

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return false; // not a JWT
    const decodedJson = atob(payloadBase64);
    const decoded = JSON.parse(decodedJson);
    const exp = decoded.exp;
    if (!exp) return false;
    
    // Check if current time is past expiration (with 10s buffer)
    return Date.now() >= exp * 1000 - 10000;
  } catch (error) {
    return true; // fail safe
  }
};

export const createSession = (tokens: TokenPair): void => {
  if (tokens.access_token) {
    saveAccessToken(tokens.access_token);
  }
  if (tokens.refresh_token) {
    saveRefreshToken(tokens.refresh_token);
  }
};

export const destroySession = (): void => {
  clearAuth();
};
