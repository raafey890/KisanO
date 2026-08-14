import { useAuthStore, initialAuthState } from './authStore';
import { User } from '../types/user.types';
import { TokenPair } from '../types/token.types';

/**
 * Pure state mutations for Authentication.
 * These actions DO NOT perform API calls or interact with localStorage.
 */
export const authActions = {
  loginSuccess: (user: User, tokens: TokenPair) => {
    useAuthStore.setState({
      currentUser: user,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      isAuthenticated: true,
      error: null,
    });
  },

  logout: () => {
    useAuthStore.setState({
      ...initialAuthState,
      isInitialized: useAuthStore.getState().isInitialized, // preserve initialized flag
    });
  },

  updateUser: (userUpdates: Partial<User>) => {
    useAuthStore.setState((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, ...userUpdates } : null,
    }));
  },

  updateTokens: (tokens: TokenPair) => {
    useAuthStore.setState({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      isAuthenticated: true, // having active tokens implies authenticated
    });
  },

  clearTokens: () => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  setLoading: (loading: boolean) => {
    useAuthStore.setState({ loading });
  },

  setError: (error: string) => {
    useAuthStore.setState({ error, loading: false });
  },

  clearError: () => {
    useAuthStore.setState({ error: null });
  },

  setInitialized: (isInitialized: boolean = true) => {
    useAuthStore.setState({ isInitialized });
  },

  resetAuth: () => {
    useAuthStore.setState(initialAuthState);
  },
};
