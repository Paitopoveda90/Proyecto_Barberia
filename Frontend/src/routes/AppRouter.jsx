import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import BookAppointment from '../pages/BookAppointment';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AppRouterInner() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/book"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppRouterInner />
    </BrowserRouter>
  );
}
