import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { roomService } from '../services/roomService';
import { reservationService } from '../services/reservationService';
import type { RoomStatus, Reservation } from '../types';
import Loading from '../components/common/Loading';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Dashboard() {
  const [rooms, setRooms] = useState<RoomStatus[]>([]);
  const [todayReservations, setTodayReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [roomsData, reservationsData] = await Promise.all([
        roomService.getAll(),
        reservationService.getToday(),
      ]);
      
      const roomsWithStatus = await Promise.all(
        roomsData.map(room => roomService.getStatus(room.id))
      );
      
      setRooms(roomsWithStatus);
      setTodayReservations(reservationsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Vista general de salas y reservas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Estado de Salas</h2>
            <Link to="/rooms" className="text-sm text-blue-600 hover:text-blue-800">
              Ver todas
            </Link>
          </div>
          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            {rooms.map((room) => (
              <div key={room.id} className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{room.name}</h3>
                  <p className="text-sm text-gray-500">Capacidad: {room.capacity}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    room.is_occupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {room.is_occupied ? 'Ocupada' : 'Disponible'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Mis Reservas de Hoy</h2>
            <Link to="/reservations" className="text-sm text-blue-600 hover:text-blue-800">
              Ver todas
            </Link>
          </div>
          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            {todayReservations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No tienes reservas para hoy
              </div>
            ) : (
              todayReservations.map((reservation) => (
                <div key={reservation.id} className="p-4">
                  <h3 className="font-medium text-gray-900">{reservation.title}</h3>
                  <p className="text-sm text-gray-500">{reservation.room_name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {format(new Date(reservation.start_time), 'HH:mm', { locale: es })} - {' '}
                    {format(new Date(reservation.end_time), 'HH:mm', { locale: es })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link
          to="/reservations/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Nueva Reserva
        </Link>
      </div>
    </div>
  );
}
