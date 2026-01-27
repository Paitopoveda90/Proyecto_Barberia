import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAdminStore } from '../store/adminStore';
import { useServiceStore } from '../store/serviceStore';
import { 
  CONFIRM_MESSAGES, 
  SUCCESS_MESSAGES, 
  ERROR_MESSAGES,
  STATUS_LABELS,
  APPOINTMENT_STATUS
} from '../constants/messages';
import '../styles/adminDashboard.css';

// Función helper para formatear fechas sin problemas de zona horaria
const formatDateLocal = (dateValue) => {
  if (!dateValue) return '';
  
  // Si la fecha viene como string YYYY-MM-DD, parsearla correctamente
  if (typeof dateValue === 'string') {
    const datePart = dateValue.split('T')[0]; // Tomar solo la parte de fecha
    const [year, month, day] = datePart.split('-');
    // Crear Date usando constructor local (no UTC) para evitar cambios de día
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return dateObj.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  // Si es un objeto Date, usar métodos locales
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Función helper para formatear fechas en formato corto (DD/MM/YYYY)
const formatDateShort = (dateValue) => {
  if (!dateValue) return '';
  
  // Si la fecha viene como string YYYY-MM-DD, parsearla correctamente
  if (typeof dateValue === 'string') {
    const datePart = dateValue.split('T')[0];
    const [year, month, day] = datePart.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return dateObj.toLocaleDateString('es-ES');
  }
  
  // Si es un objeto Date, usar métodos locales
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  return date.toLocaleDateString('es-ES');
};

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const {
    users, 
    appointments, 
    blockedDates, 
    loading, 
    error,
    fetchAllUsers, 
    fetchAllAppointments, 
    cancelAppointment,
    fetchBlockedDates,
    blockDate,
    unblockDate,
    createService,
    deleteService
  } = useAdminStore();
  
  const { services, fetchServices } = useServiceStore();

  const [activeTab, setActiveTab] = useState('appointments');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', duration: '', price: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [blockForm, setBlockForm] = useState({ date: '', time: '', reason: '' });

  useEffect(() => {
    fetchAllAppointments();
    fetchAllUsers();
    fetchBlockedDates();
    fetchServices();
  }, [fetchAllAppointments, fetchAllUsers, fetchBlockedDates, fetchServices]);

  // Helper para mostrar mensajes
  const showMessage = (message) => {
    alert(message);
  };

  const handleCancelAppointment = async (id) => {
    if (window.confirm(CONFIRM_MESSAGES.CANCEL_APPOINTMENT)) {
      const result = await cancelAppointment(id);
      if (result.success) {
        showMessage(SUCCESS_MESSAGES.APPOINTMENT_CANCELLED);
      } else {
        showMessage(result.error || ERROR_MESSAGES.CANCEL_APPOINTMENT, true);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setServiceForm({ ...serviceForm, image: file });
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', serviceForm.name);
    formData.append('description', serviceForm.description || '');
    formData.append('duration', serviceForm.duration);
    formData.append('price', serviceForm.price);
    if (serviceForm.image) {
      formData.append('image', serviceForm.image);
    }
    
    const result = await createService(formData);
    
    if (result.success) {
      showMessage(SUCCESS_MESSAGES.SERVICE_CREATED);
      setShowServiceForm(false);
      setServiceForm({ name: '', description: '', duration: '', price: '', image: null });
      setImagePreview(null);
      fetchServices();
    } else {
      showMessage(result.error || ERROR_MESSAGES.CREATE_SERVICE, true);
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm(CONFIRM_MESSAGES.DELETE_SERVICE)) {
      const result = await deleteService(id);
      if (result.success) {
        showMessage(SUCCESS_MESSAGES.SERVICE_DELETED);
        fetchServices();
      } else {
        showMessage(result.error || ERROR_MESSAGES.DELETE_SERVICE, true);
      }
    }
  };

  const handleBlockDate = async (e) => {
    e.preventDefault();
    const result = await blockDate(blockForm.date, blockForm.time || null, blockForm.reason || null);
    
    if (result.success) {
      showMessage(SUCCESS_MESSAGES.DATE_BLOCKED);
      setShowBlockForm(false);
      setBlockForm({ date: '', time: '', reason: '' });
      fetchBlockedDates();
    } else {
      showMessage(result.error || ERROR_MESSAGES.BLOCK_DATE, true);
    }
  };

  const handleUnblockDate = async (id) => {
    if (window.confirm(CONFIRM_MESSAGES.UNBLOCK_DATE)) {
      const result = await unblockDate(id);
      if (result.success) {
        showMessage(SUCCESS_MESSAGES.DATE_UNBLOCKED);
        fetchBlockedDates();
      } else {
        showMessage(result.error || ERROR_MESSAGES.UNBLOCK_DATE, true);
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm(CONFIRM_MESSAGES.LOGOUT)) {
      logout();
      navigate('/login');
    }
  };


  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2>Panel Admin</h2>
        <p>Bienvenido, {user?.name}</p>
        
        <button 
          className={`admin-menu-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          📅 Citas
        </button>
        
        <button 
          className={`admin-menu-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Usuarios
        </button>
        
        <button 
          className={`admin-menu-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          ✂️ Servicios
        </button>
        
        <button 
          className={`admin-menu-btn ${activeTab === 'blocked' ? 'active' : ''}`}
          onClick={() => setActiveTab('blocked')}
        >
          🚫 Fechas Bloqueadas
        </button>
        
        <button 
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          🚪 Cerrar Sesión
        </button>
      </div>

      {/* Contenido principal */}
      <div className="admin-content">
        {error && <div className="error-message">{error}</div>}

        {loading && <p style={{ textAlign: 'center', color: '#ffd700' }}>Cargando...</p>}

      {/* Tab: Citas */}
      {activeTab === 'appointments' && (
        <div className="admin-card">
          <h3>Todas las Citas</h3>
          {appointments.length === 0 ? (
            <p>No hay citas registradas</p>
          ) : (
            <div className="appointments-list">
              {appointments.map(app => (
                <div key={app.id} className="appointment-item">
                  <div>
                    <strong>{app.User?.name || 'Cliente'}</strong>
                    <p>Servicio: {app.Service?.name || 'N/A'}</p>
                    <p>Fecha: {formatDateLocal(app.date)}</p>
                    {app.time && <p>Hora: {app.time}</p>}
                    <span className={`status status-${app.status}`}>
                      {STATUS_LABELS[app.status] || app.status}
                    </span>
                  </div>
                  {app.status === 'scheduled' && (
                    <button 
                      className="cancel-btn"
                      onClick={() => handleCancelAppointment(app.id)}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Usuarios */}
      {activeTab === 'users' && (
        <div className="admin-card">
          <h3>Usuarios Registrados</h3>
          {users.length === 0 ? (
            <p>No hay usuarios registrados</p>
          ) : (
            <div className="users-list">
              {users.map(userItem => (
                <div key={userItem.id} className="user-item">
                  <div>
                    <strong>{userItem.name}</strong>
                    <p>Email: {userItem.email}</p>
                    <p>Rol: {userItem.role}</p>
                    <p>Citas: {userItem.Appointments?.length || 0}</p>
                    {userItem.Appointments && userItem.Appointments.length > 0 && (
                      <div className="user-appointments">
                        <strong>Sus citas:</strong>
                        {userItem.Appointments.map(apt => (
                          <div key={apt.id} className="mini-appointment">
                            {apt.Service?.name} - {formatDateShort(apt.date)} {apt.time && `- ${apt.time}`}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Servicios */}
      {activeTab === 'services' && (
        <div className="admin-card">
          <h3>Gestión de Servicios</h3>
          <button 
            className="create-btn"
            onClick={() => setShowServiceForm(!showServiceForm)}
          >
            {showServiceForm ? 'Cancelar' : 'Crear Nuevo Servicio'}
          </button>

          {showServiceForm && (
            <form onSubmit={handleCreateService} className="service-form" encType="multipart/form-data">
              <input
                type="text"
                placeholder="Nombre del servicio"
                value={serviceForm.name}
                onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Descripción (opcional)"
                value={serviceForm.description}
                onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
              />
              <input
                type="number"
                placeholder="Duración (minutos)"
                value={serviceForm.duration}
                onChange={(e) => setServiceForm({...serviceForm, duration: e.target.value})}
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Precio"
                value={serviceForm.price}
                onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                required
              />
              <div className="image-upload-section">
                <label htmlFor="service-image" className="image-upload-label">
                  Imagen del servicio (opcional)
                </label>
                <input
                  type="file"
                  id="service-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ marginBottom: '10px' }}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', marginTop: '10px' }}
                    />
                  </div>
                )}
              </div>
              <button type="submit" disabled={loading}>Crear Servicio</button>
            </form>
          )}

          <div className="services-list">
            {services.map(service => (
              <div key={service.id} className="service-item">
                <div>
                  <strong>{service.name}</strong>
                  {service.description && <p>{service.description}</p>}
                  <p>Duración: {service.duration} minutos</p>
                  <p>Precio: ${service.price}</p>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteService(service.id)}
                  disabled={loading}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Fechas Bloqueadas */}
      {activeTab === 'blocked' && (
        <div className="admin-card">
          <h3>Fechas y Horarios Bloqueados</h3>
          <button 
            className="create-btn"
            onClick={() => setShowBlockForm(!showBlockForm)}
          >
            {showBlockForm ? 'Cancelar' : 'Bloquear Fecha/Horario'}
          </button>

          {showBlockForm && (
            <form onSubmit={handleBlockDate} className="block-form">
              <input
                type="date"
                value={blockForm.date}
                onChange={(e) => setBlockForm({...blockForm, date: e.target.value})}
                required
              />
              <input
                type="time"
                value={blockForm.time}
                onChange={(e) => setBlockForm({...blockForm, time: e.target.value})}
                placeholder="Dejar vacío para bloquear todo el día"
              />
              <input
                type="text"
                placeholder="Razón (opcional)"
                value={blockForm.reason}
                onChange={(e) => setBlockForm({...blockForm, reason: e.target.value})}
              />
              <button type="submit" disabled={loading}>Bloquear</button>
            </form>
          )}

          <div className="blocked-dates-list">
            {blockedDates.length === 0 ? (
              <p>No hay fechas bloqueadas</p>
            ) : (
              blockedDates.map(blocked => (
                <div key={blocked.id} className="blocked-item">
                  <div>
                    <strong>Fecha: {formatDateLocal(blocked.date)}</strong>
                    {blocked.time ? (
                      <p>Hora: {blocked.time}</p>
                    ) : (
                      <p>Todo el día bloqueado</p>
                    )}
                    {blocked.reason && <p>Razón: {blocked.reason}</p>}
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleUnblockDate(blocked.id)}
                    disabled={loading}
                  >
                    Desbloquear
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
