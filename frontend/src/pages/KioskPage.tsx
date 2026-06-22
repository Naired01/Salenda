import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicRoomService } from '../services/roomService';
import type { RoomStatus } from '../types';
import Loading from '../components/common/Loading';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function StatusDot({ occupied }: { occupied: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-5 h-5 rounded-full ${
          occupied ? 'bg-red-500 animate-pulse-occupied' : 'bg-green-500 animate-pulse-available'
        }`}
      />
      <span className="text-lg font-bold tracking-wide">
        {occupied ? 'OCUPADA' : 'DISPONIBLE'}
      </span>
    </div>
  );
}

function UsersIcon() {
  return (
    <svg className="w-5 h-5 inline-block mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-5 h-5 inline-block mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4 inline-block mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className="w-4 h-4 inline-block mr-1 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function RoomCard({ room, onClick }: { room: RoomStatus; onClick: () => void }) {
  const kioskUrl = `${window.location.origin}/kiosk/${room.uuid}`;

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-6 shadow-xl cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl border border-white/10 ${
        room.is_occupied
          ? 'bg-gradient-to-br from-red-600/90 to-red-800/90'
          : 'bg-gradient-to-br from-green-600/90 to-green-800/90'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">{room.name}</h2>
        <div className="text-right">
          <StatusDot occupied={room.is_occupied} />
        </div>
      </div>

      <div className="space-y-2 text-sm opacity-90">
        <p>
          <UsersIcon />
          {room.capacity} personas
        </p>
        {room.location && (
          <p>
            <LocationIcon />
            {room.location}
          </p>
        )}
      </div>

      {room.current_reservation && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs font-medium opacity-70 uppercase tracking-wider">Reserva actual</p>
          <p className="font-semibold mt-1 text-lg">{room.current_reservation.title}</p>
          <p className="text-sm opacity-90 mt-1">
            <ClockIcon />
            {format(new Date(room.current_reservation.start_time), 'HH:mm', { locale: es })} — {' '}
            {format(new Date(room.current_reservation.end_time), 'HH:mm', { locale: es })}
          </p>
        </div>
      )}

      {room.next_reservation && !room.current_reservation && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs font-medium opacity-70 uppercase tracking-wider">Próxima reserva</p>
          <p className="font-semibold mt-1 text-lg">{room.next_reservation.title}</p>
          <p className="text-sm opacity-90 mt-1">
            <ClockIcon />
            {format(new Date(room.next_reservation.start_time), 'HH:mm', { locale: es })}
          </p>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-white/10">
        <p className="text-xs opacity-50 truncate" title={kioskUrl}>
          <LinkIcon />
          {kioskUrl}
        </p>
      </div>
    </div>
  );
}

export default function KioskPage() {
  const [rooms, setRooms] = useState<RoomStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const navigate = useNavigate();

  const loadRooms = useCallback(async () => {
    try {
      const data = await publicRoomService.getAllStatus();
      setRooms(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
    const interval = setInterval(loadRooms, 30000);
    return () => clearInterval(interval);
  }, [loadRooms]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 transition-all duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold mb-2 tracking-tight">
            Office<span className="text-blue-400">Rs</span>
          </h1>
          <p className="text-xl text-gray-400 font-light">Estado de Salas en Tiempo Real</p>
          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-500">
            <ClockIcon />
            Actualizado: {format(lastUpdate, 'HH:mm:ss', { locale: es })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onClick={() => navigate(`/kiosk/${room.uuid}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
