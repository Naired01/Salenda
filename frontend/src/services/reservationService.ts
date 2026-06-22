import api from './api';
import type { Reservation, CreateReservationData, AvailabilityCheck, AvailabilityResponse } from '../types';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const reservationService = {
  getAll: async () => {
    const response = await api.get<PaginatedResponse<Reservation>>('/reservations/');
    return response.data.results;
  },

  getById: async (id: number) => {
    const response = await api.get<Reservation>(`/reservations/${id}/`);
    return response.data;
  },

  create: async (data: CreateReservationData) => {
    const response = await api.post<Reservation>('/reservations/', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateReservationData>) => {
    const response = await api.patch<Reservation>(`/reservations/${id}/`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/reservations/${id}/`);
  },

  checkAvailability: async (data: AvailabilityCheck) => {
    const response = await api.post<AvailabilityResponse>('/reservations/check_availability/', data);
    return response.data;
  },

  getMyReservations: async () => {
    const response = await api.get<PaginatedResponse<Reservation>>('/reservations/my_reservations/');
    return response.data.results ?? response.data;
  },

  getToday: async () => {
    const response = await api.get<PaginatedResponse<Reservation> | Reservation[]>('/reservations/today/');
    return Array.isArray(response.data) ? response.data : response.data.results ?? [];
  },
};
