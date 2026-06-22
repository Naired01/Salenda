import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reservationService } from '../services/reservationService';
import type { Reservation } from '../types';
import Loading from '../components/common/Loading';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await reservationService.getMyReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      try {
        await reservationService.delete(id);
        setReservations(reservations.filter(r => r.id !== id));
      } catch (error) {
        console.error('Error deleting reservation:', error);
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
          <p className="text-gray-600 mt-2">Gestiona tus reservas de salas</p>
        </div>
        <Link
          to="/reservations/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Nueva Reserva
        </Link>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">No tienes reservas aún</p>
          <Link
            to="/reservations/new"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Crear primera reserva
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <li key={reservation.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{reservation.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{reservation.room_name}</p>
                    {reservation.description && (
                      <p className="text-sm text-gray-600 mt-2">{reservation.description}</p>
                    )}
                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        {format(new Date(reservation.start_time), 'PP', { locale: es })}
                      </span>
                      <span>
                        {format(new Date(reservation.start_time), 'HH:mm', { locale: es })} - {' '}
                        {format(new Date(reservation.end_time), 'HH:mm', { locale: es })}
                      </span>
                      <span className="text-gray-400">
                        ({reservation.duration_minutes} min)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(reservation.id)}
                    className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
