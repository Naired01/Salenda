import { useEffect, useState } from 'react';
import { roomService } from '../services/roomService';
import type { RoomStatus } from '../types';
import Loading from '../components/common/Loading';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const roomsData = await roomService.getAll();
      const roomsWithStatus = await Promise.all(
        roomsData.map(room => roomService.getStatus(room.id))
      );
      setRooms(roomsWithStatus);
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Salas de Conferencias</h1>
        <p className="text-gray-600 mt-2">Estado actual de todas las salas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                <p className="text-sm text-gray-500">Capacidad: {room.capacity}</p>
                {room.location && (
                  <p className="text-sm text-gray-500">{room.location}</p>
                )}
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                room.is_occupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {room.is_occupied ? 'Ocupada' : 'Disponible'}
              </span>
            </div>

            {room.current_reservation && (
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium text-gray-700">Reserva actual:</p>
                <p className="text-sm text-gray-600">{room.current_reservation.title}</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(room.current_reservation.start_time), 'HH:mm', { locale: es })} - {' '}
                  {format(new Date(room.current_reservation.end_time), 'HH:mm', { locale: es })}
                </p>
              </div>
            )}

            {room.next_reservation && !room.current_reservation && (
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium text-gray-700">Próxima reserva:</p>
                <p className="text-sm text-gray-600">{room.next_reservation.title}</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(room.next_reservation.start_time), 'PP HH:mm', { locale: es })}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
