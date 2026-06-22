import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import RoomsPage from './pages/RoomsPage';
import ReservationsPage from './pages/ReservationsPage';
import NewReservation from './pages/NewReservation';
import AdminRoomsPage from './pages/AdminRoomsPage';
import KioskPage from './pages/KioskPage';
import KioskRoomPage from './pages/KioskRoomPage';

function App() {
  const { loadUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
          
          <Route path="/kiosk" element={<KioskPage />} />
          <Route path="/kiosk/:uuid" element={<KioskRoomPage />} />
          
          <Route path="/*" element={
            <ProtectedRoute>
              <Header />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/reservations" element={<ReservationsPage />} />
                <Route path="/reservations/new" element={<NewReservation />} />
                <Route path="/admin/rooms" element={
                  <ProtectedRoute requireAdmin>
                    <AdminRoomsPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
