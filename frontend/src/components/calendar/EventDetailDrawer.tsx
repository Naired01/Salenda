import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Reservation } from '../../types';
import Drawer from '../common/Drawer';

interface EventDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
}

export default function EventDetailDrawer({ isOpen, onClose, reservation }: EventDetailDrawerProps) {
  if (!reservation) return null;

  const startTime = new Date(reservation.start_time);
  const endTime = new Date(reservation.end_time);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Detalle del Evento">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{reservation.title}</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-500">Sala</p>
              <p className="text-base text-gray-900">{reservation.room_name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-500">Fecha</p>
              <p className="text-base text-gray-900">
                {format(startTime, 'PPPP', { locale: es })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-500">Horario</p>
              <p className="text-base text-gray-900">
                {format(startTime, 'HH:mm', { locale: es })} - {format(endTime, 'HH:mm', { locale: es })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-500">Reservado por</p>
              <p className="text-base text-gray-900">{reservation.user_name || reservation.user_email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-500">Duración</p>
              <p className="text-base text-gray-900">{reservation.duration_minutes} minutos</p>
            </div>
          </div>
        </div>

        {reservation.description && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-2">Descripción</p>
            <p className="text-base text-gray-900 whitespace-pre-wrap">{reservation.description}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Drawer>
  );
}
