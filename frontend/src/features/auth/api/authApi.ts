import { createSession, destroySession } from '../services/authSession';
import { saveAccessToken, saveRefreshToken, getRefreshToken } from '../services/authStorage';
// @ts-ignore - Importing JS module into TS without declarations
import api from '../../../services/api';
import { AUTH_ENDPOINTS } from './authEndpoints';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User, 
  ResetPasswordRequest, 
  VerifyOtpRequest 
} from '../types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    // The interceptor in api.js extracts the response data automatically, 
    // so we can typecast the return directly.
    const response = await api.post<any, AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
    createSession({ access_token: response.access_token, refresh_token: response.refresh_token });
    return response;
  },

  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<any, AuthResponse>(AUTH_ENDPOINTS.REGISTER, payload);
    createSession({ access_token: response.access_token, refresh_token: response.refresh_token });
    return response;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } finally {
      // Always clear tokens locally even if the server request fails
      destroySession();
    }
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await api.post<any, AuthResponse>(AUTH_ENDPOINTS.REFRESH_TOKEN, { refresh_token: refreshToken });
    saveAccessToken(response.access_token);
    if (response.refresh_token) {
      saveRefreshToken(response.refresh_token);
    }
    return response;
  },

  getCurrentUser: async (): Promise<User> => {
    return await api.get<any, User>(AUTH_ENDPOINTS.ME);
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return await api.post<any, { message: string }>(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  verifyOTP: async (payload: VerifyOtpRequest): Promise<{ valid: boolean; token: string }> => {
    return await api.post<any, { valid: boolean; token: string }>(AUTH_ENDPOINTS.VERIFY_OTP, payload);
  },

  resetPassword: async (payload: ResetPasswordRequest): Promise<{ message: string }> => {
    return await api.post<any, { message: string }>(AUTH_ENDPOINTS.RESET_PASSWORD, payload);
  }
};
