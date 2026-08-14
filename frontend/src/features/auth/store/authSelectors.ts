import { AuthState } from './authStore';

/**
 * Pure selectors to optimize component re-rendering.
 */
export const selectUser = (state: AuthState) => state.currentUser;
export const selectRole = (state: AuthState) => state.currentUser?.role;
export const selectAccessToken = (state: AuthState) => state.accessToken;
export const selectRefreshToken = (state: AuthState) => state.refreshToken;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectLoading = (state: AuthState) => state.loading;
export const selectError = (state: AuthState) => state.error;
export const selectSession = (state: AuthState) => state.session;
export const selectIsInitialized = (state: AuthState) => state.isInitialized;
