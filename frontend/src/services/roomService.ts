import api from './api';
import type { Room, RoomStatus } from '../types';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const roomService = {
  getAll: async () => {
    const response = await api.get<PaginatedResponse<Room>>('/rooms/');
    return response.data.results;
  },

  getById: async (id: number) => {
    const response = await api.get<Room>(`/rooms/${id}/`);
    return response.data;
  },

  getStatus: async (id: number) => {
    const response = await api.get<RoomStatus>(`/rooms/${id}/status/`);
    return response.data;
  },

  getSchedule: async (id: number, date?: string) => {
    const params = date ? { date } : {};
    const response = await api.get(`/rooms/${id}/schedule/`, { params });
    return response.data;
  },

  create: async (data: Partial<Room>) => {
    const response = await api.post<Room>('/rooms/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Room>) => {
    const response = await api.patch<Room>(`/rooms/${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/rooms/${id}/`);
  },
};

export const publicRoomService = {
  getAll: async () => {
    const response = await api.get<PaginatedResponse<Room>>('/public/rooms/');
    return response.data.results;
  },

  getAllStatus: async () => {
    const response = await api.get<RoomStatus[]>('/public/rooms/all_status/');
    return response.data;
  },

  getStatus: async (id: number) => {
    const response = await api.get<RoomStatus>(`/public/rooms/${id}/status/`);
    return response.data;
  },

  getStatusByUuid: async (uuid: string) => {
    const response = await api.get<RoomStatus>(`/public/rooms/uuid/${uuid}/status/`);
    return response.data;
  },

  getSchedule: async (id: number, date?: string) => {
    const params = date ? { date } : {};
    const response = await api.get(`/public/rooms/${id}/schedule/`, { params });
    return response.data;
  },
};
