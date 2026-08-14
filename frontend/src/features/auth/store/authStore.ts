import { create } from 'zustand';
import { User, UserRole, Permission } from '../types/user.types';
import { TokenPair } from '../types/token.types';

export interface AuthState {
  currentUser: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  
  // Future proofing for OAuth, MFA, multiple sessions
  session: any | null; 
  
  isAuthenticated: boolean;
  isInitialized: boolean;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  currentUser: null,
  accessToken: null,
  refreshToken: null,
  session: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
  error: null,
};

// Pure state store. No side effects.
export const useAuthStore = create<AuthState>(() => initialAuthState);
