import { create } from 'zustand';
import type { User, AuthTokens } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem('tokens', JSON.stringify({ access: data.access, refresh: data.refresh }));
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, tokens: { access: data.access, refresh: data.refresh }, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Error al iniciar sesión', isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.register(data);
      localStorage.setItem('tokens', JSON.stringify({ access: result.access, refresh: result.refresh }));
      localStorage.setItem('user', JSON.stringify(result.user));
      set({ user: result.user, tokens: { access: result.access, refresh: result.refresh }, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const errorMsg = error.response?.data?.password?.[0] || error.response?.data?.email?.[0] || 'Error al registrar';
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    const { tokens } = get();
    try {
      if (tokens?.refresh) {
        await authService.logout(tokens.refresh);
      }
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      set({ user: null, tokens: null, isAuthenticated: false });
    }
  },

  loadUser: () => {
    const tokensStr = localStorage.getItem('tokens');
    const userStr = localStorage.getItem('user');
    if (tokensStr && userStr) {
      try {
        const tokens = JSON.parse(tokensStr);
        const user = JSON.parse(userStr);
        set({ user, tokens, isAuthenticated: true });
      } catch {
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
      }
    }
  },

  clearError: () => set({ error: null }),
}));
