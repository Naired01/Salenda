import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomService } from '../services/roomService';
import { reservationService } from '../services/reservationService';
import type { Room, AvailabilityResponse } from '../types';
import Loading from '../components/common/Loading';

export default function NewReservation() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [checking, setChecking] = useState(false);
  
  const [formData, setFormData] = useState({
    room: '',
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await roomService.getAll();
      setRooms(data);
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setAvailability(null);
    setError('');
  };

  const checkAvailability = async () => {
    if (!formData.room || !formData.date || !formData.startTime || !formData.endTime) {
      setError('Por favor completa todos los campos de fecha y hora');
      return;
    }

    setChecking(true);
    setError('');

    try {
      const startDateTime = `${formData.date}T${formData.startTime}:00`;
      const endDateTime = `${formData.date}T${formData.endTime}:00`;

      const result = await reservationService.checkAvailability({
        room: parseInt(formData.room),
        start_time: startDateTime,
        end_time: endDateTime,
      });

      setAvailability(result);

      if (!result.available) {
        setError('La sala no está disponible en el horario seleccionado');
      }
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Error al verificar disponibilidad');
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!availability?.available) {
      setError('Por favor verifica la disponibilidad antes de reservar');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const startDateTime = `${formData.date}T${formData.startTime}:00`;
      const endDateTime = `${formData.date}T${formData.endTime}:00`;

      await reservationService.create({
        room: parseInt(formData.room),
        title: formData.title,
        description: formData.description,
        start_time: startDateTime,
        end_time: endDateTime,
      });

      navigate('/reservations');
    } catch (error: any) {
      setError(error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || 'Error al crear la reserva');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nueva Reserva</h1>
        <p className="text-gray-600 mt-2">Reserva una sala de conferencias</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título de la junta *
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Ej: Reunión de equipo"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Breve descripción de la junta"
          />
        </div>

        <div>
          <label htmlFor="room" className="block text-sm font-medium text-gray-700">
            Sala *
          </label>
          <select
            name="room"
            id="room"
            required
            value={formData.room}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Selecciona una sala</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} (Capacidad: {room.capacity})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Fecha *
          </label>
          <input
            type="date"
            name="date"
            id="date"
            required
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
              Hora de inicio *
            </label>
            <input
              type="time"
              name="startTime"
              id="startTime"
              required
              value={formData.startTime}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
              Hora de fin *
            </label>
            <input
              type="time"
              name="endTime"
              id="endTime"
              required
              value={formData.endTime}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={checkAvailability}
            disabled={checking || !formData.room || !formData.date || !formData.startTime || !formData.endTime}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {checking ? 'Verificando...' : 'Verificar Disponibilidad'}
          </button>
        </div>

        {availability && (
          <div className={`rounded-md p-4 ${availability.available ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className={`text-sm font-medium ${availability.available ? 'text-green-800' : 'text-red-800'}`}>
              {availability.available ? '✓ La sala está disponible' : '✗ La sala no está disponible'}
            </p>
            {!availability.available && availability.conflicts.length > 0 && (
              <div className="mt-2 text-sm text-red-700">
                <p>Conflictos encontrados:</p>
                <ul className="list-disc list-inside mt-1">
                  {availability.conflicts.map((conflict) => (
                    <li key={conflict.id}>
                      {conflict.title} ({new Date(conflict.start_time).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} - {new Date(conflict.end_time).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={submitting || !availability?.available}
            className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {submitting ? 'Creando...' : 'Crear Reserva'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/reservations')}
            className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
