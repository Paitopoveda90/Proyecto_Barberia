import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointmentStore } from '../store/appointmentStore';
import { useAuthStore } from '../store/authStore';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const { appointments, fetchMyAppointments, loading, deleteAppointment } = useAppointmentStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyAppointments();
  }, [fetchMyAppointments]);

  const handleDeleteAppointment = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      await deleteAppointment(id);
      await fetchMyAppointments(); // Recargar la lista después de eliminar
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <>
      <div className="dashboard-container">
        <div >
          <h2>Hola, {user?.name || 'Cliente'}</h2>
        </div>

        <button 
          className="create-btn" 
          onClick={() => navigate('/book')}
        >
          Reservar Cita
        </button>

        <div className="dashboard-card">
          <h3>Mis Citas</h3>

          {loading && <p>Cargando citas...</p>}

          {!loading && appointments.length === 0 && (
            <p className="empty">No tienes citas programadas</p>
          )}

          <div className="appointments-list">
            {appointments.map(app => (
              <div key={app.id} className="appointment-item">
                <div>
                  <strong>{app.Service?.name || 'Servicio no disponible'}</strong>
                  <p>Fecha: {new Date(app.date).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  {app.time && <p>Hora: {app.time}</p>}
                  <span className={`status status-${app.status}`}>
                    {app.status === 'scheduled' ? 'Programada' : 
                     app.status === 'completed' ? 'Completada' : 
                     app.status === 'cancelled' ? 'Cancelada' : app.status}
                  </span>
                </div>
                <button
                  className="cancel-btn"
                  onClick={() => handleDeleteAppointment(app.id)}
                  disabled={loading}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
        <button 
            className="logout-btn" 
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
      </div>
    </>
  );
}
