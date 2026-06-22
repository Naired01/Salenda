import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { reservationService } from '../services/reservationService';
import type { Reservation } from '../types';
import Loading from '../components/common/Loading';
import EventDetailDrawer from '../components/calendar/EventDetailDrawer';

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<typeof Views[keyof typeof Views]>(Views.MONTH);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await reservationService.getAll();
      setReservations(data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const events = reservations.map((reservation) => ({
    id: reservation.id,
    title: `${reservation.title} - ${reservation.room_name}`,
    start: new Date(reservation.start_time),
    end: new Date(reservation.end_time),
    resource: reservation,
  }));

  const handleSelectEvent = (event: any) => {
    setSelectedReservation(event.resource as Reservation);
    setIsDrawerOpen(true);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: typeof Views[keyof typeof Views]) => {
    setView(newView);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedReservation(null);
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Calendario</h1>
        <p className="text-gray-600 mt-2">Vista de calendario de reservas</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          date={date}
          view={view}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          onSelectEvent={handleSelectEvent}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          messages={{
            next: 'Sig',
            previous: 'Ant',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
            date: 'Fecha',
            time: 'Hora',
            event: 'Evento',
            noEventsInRange: 'No hay eventos en este rango',
            showMore: (total) => `+ Ver más (${total})`,
          }}
        />
      </div>

      <EventDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        reservation={selectedReservation}
      />
    </div>
  );
}
