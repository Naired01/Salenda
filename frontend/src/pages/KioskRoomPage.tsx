import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicRoomService } from '../services/roomService';
import type { RoomStatus } from '../types';
import Loading from '../components/common/Loading';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function StatusDotLarge({ occupied }: { occupied: boolean }) {
  return (
    <div className="flex items-center gap-5">
      <div
        className={`w-10 h-10 rounded-full ${
          occupied ? 'bg-red-500 animate-pulse-occupied' : 'bg-green-500 animate-pulse-available'
        }`}
      />
      <span className="text-3xl font-bold tracking-widest">
        {occupied ? 'OCUPADA' : 'DISPONIBLE'}
      </span>
    </div>
  );
}

function UsersIcon() {
  return (
    <svg className="w-6 h-6 inline-block mr-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-6 h-6 inline-block mr-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5 inline-block mr-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

export default function KioskRoomPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadRoom = useCallback(async () => {
    if (!uuid) return;
    try {
      const data = await publicRoomService.getStatusByUuid(uuid);
      setRoom(data);
      setLastUpdate(new Date());
      setError(null);
    } catch {
      setError('Sala no encontrada');
    } finally {
      setLoading(false);
    }
  }, [uuid]);

  useEffect(() => {
    loadRoom();
    const interval = setInterval(loadRoom, 30000);
    return () => clearInterval(interval);
  }, [loadRoom]);

  if (loading) return <Loading />;

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl font-bold mb-4">404</p>
          <p className="text-xl text-gray-400 mb-8">Sala no encontrada</p>
          <button
            onClick={() => navigate('/kiosk')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            Volver al Kiosk
          </button>
        </div>
      </div>
    );
  }

  const bgClass = room.is_occupied
    ? 'bg-gradient-to-br from-red-950/60 via-gray-900 to-gray-900'
    : 'bg-gradient-to-br from-green-950/60 via-gray-900 to-gray-900';

  return (
    <div className={`min-h-screen text-white p-8 transition-all duration-700 ${bgClass}`}>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/kiosk')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors cursor-pointer"
        >
          <BackIcon />
          Volver
        </button>

        <div className="text-center mb-10">
          <h1 className="text-6xl font-extrabold mb-4 tracking-tight">{room.name}</h1>
          <div className="flex justify-center gap-8 text-lg opacity-80 mb-6">
            <span>
              <UsersIcon />
              {room.capacity} personas
            </span>
            {room.location && (
              <span>
                <LocationIcon />
                {room.location}
              </span>
            )}
          </div>
          <div className="flex justify-center mb-6">
            <StatusDotLarge occupied={room.is_occupied} />
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <ClockIcon />
            Actualizado: {format(lastUpdate, 'HH:mm:ss', { locale: es })}
          </div>
        </div>

        {room.current_reservation && (
          <div className={`rounded-3xl p-8 shadow-2xl border border-white/10 ${
            room.is_occupied ? 'bg-red-900/40' : 'bg-green-900/40'
          }`}>
            <p className="text-xs font-medium opacity-60 uppercase tracking-wider mb-3">Reserva actual</p>
            <p className="text-3xl font-bold mb-1">{room.current_reservation.title}</p>
            {room.current_reservation.description && (
              <p className="text-md opacity-60">{room.current_reservation.description}</p>
            )}
            <p className="text-xl opacity-90 mt-3">
              <ClockIcon />
              {format(new Date(room.current_reservation.start_time), 'HH:mm', { locale: es })} — {' '}
              {format(new Date(room.current_reservation.end_time), 'HH:mm', { locale: es })}
            </p>
            {room.current_reservation.user_name && (
              <p className="text-sm opacity-60 mt-3">
                Reservado por: {room.current_reservation.user_name}
              </p>
            )}
          </div>
        )}

        {room.next_reservation && !room.current_reservation && (
          <div className={`rounded-3xl p-8 shadow-2xl border border-white/10 ${
            room.is_occupied ? 'bg-red-900/40' : 'bg-green-900/40'
          }`}>
            <p className="text-xs font-medium opacity-60 uppercase tracking-wider mb-3">Próxima reserva</p>
            <p className="text-3xl font-bold mb-3">{room.next_reservation.title}</p>
            <p className="text-xs opacity-60">
              {room.next_reservation.description || 'Sin descripción'}
            </p>
            <p className="text-xl opacity-90">
              <ClockIcon />
              {format(new Date(room.next_reservation.start_time), 'HH:mm', { locale: es })}
            </p>
            {room.next_reservation.user_name && (
              <p className="text-sm opacity-60 mt-3">
                Reservado por: {room.next_reservation.user_name}
              </p>
            )}
          </div>
        )}

        {!room.current_reservation && !room.next_reservation && (
          <div className={`rounded-3xl p-8 shadow-2xl border border-white/10 text-center ${
            room.is_occupied ? 'bg-red-900/40' : 'bg-green-900/40'
          }`}>
            <p className="text-2xl opacity-70">Sin reservas programadas</p>
          </div>
        )}
      </div>
    </div>
  );
}
