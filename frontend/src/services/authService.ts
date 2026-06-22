import api from './api';
import type { User, LoginCredentials, RegisterData } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<{ user: User; access: string; refresh: string }>(
      '/auth/login/',
      credentials
    );
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post<{ user: User; access: string; refresh: string }>(
      '/auth/register/',
      data
    );
    return response.data;
  },

  logout: async (refreshToken: string) => {
    await api.post('/auth/logout/', { refresh: refreshToken });
  },

  getProfile: async () => {
    const response = await api.get<User>('/auth/profile/');
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.patch<User>('/auth/profile/', data);
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    await api.post('/auth/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },
};
