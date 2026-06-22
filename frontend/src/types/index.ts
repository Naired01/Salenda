export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user';
  avatar: string | null;
  is_active: boolean;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
}

export interface Room {
  id: number;
  uuid: string;
  name: string;
  capacity: number;
  location: string;
  amenities: string[];
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoomStatus extends Pick<Room, 'id' | 'uuid' | 'name' | 'capacity' | 'location'> {
  is_occupied: boolean;
  current_reservation: Reservation | null;
  next_reservation: Reservation | null;
}

export interface Reservation {
  id: number;
  room: number;
  room_name: string;
  user: number;
  user_email: string;
  user_name: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface CreateReservationData {
  room: number;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
}

export interface AvailabilityCheck {
  room: number;
  start_time: string;
  end_time: string;
}

export interface AvailabilityResponse {
  available: boolean;
  conflicts: Reservation[];
}
