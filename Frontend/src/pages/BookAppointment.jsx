import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointmentStore } from '../store/appointmentStore';
import { useServiceStore } from '../store/serviceStore';
import '../styles/bookAppointment.css';

// Horarios disponibles
const availableTimes = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30'
];

export default function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [serviceId, setServiceId] = useState('');
  const navigate = useNavigate();

  const { createAppointment, loading, error } = useAppointmentStore();
  const { services, fetchServices } = useServiceStore();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Obtener fecha mínima (hoy)
  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Al menos un día después
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !serviceId || !selectedTime) {
      alert('Por favor, completa todos los campos: servicio, fecha y hora');
      return;
    }

    // Validar que la fecha no sea en el pasado
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const now = new Date();
    if (selectedDateTime <= now) {
      alert('Por favor, selecciona una fecha y hora futuras');
      return;
    }

    const result = await createAppointment({
      service_id: parseInt(serviceId),
      date: selectedDate,
      time: selectedTime
    });

    if (result.success) {
      alert('¡Cita reservada correctamente!');
      navigate('/dashboard');
    } else {
      alert(result.error || 'Error al reservar la cita');
    }
  };

  return (
    <div className="appointment-container">
      <h2>Reservar Cita</h2>

      <form className="appointment-card" onSubmit={handleSubmit}>
        {/* SERVICIOS */}
        <div className="form-group">
          <label>Servicio *</label>
          <select 
            value={serviceId} 
            onChange={e => setServiceId(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Selecciona un servicio</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} {s.price && `- $${s.price}`}
              </option>
            ))}
          </select>
        </div>

        {/* CALENDARIO */}
        <div className="form-group">
          <label>Fecha *</label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            min={getMinDate()}
            required
            disabled={loading}
          />
        </div>

        {/* HORA */}
        <div className="form-group">
          <label>Hora *</label>
          <select 
            value={selectedTime} 
            onChange={e => setSelectedTime(e.target.value)}
            required
            disabled={loading || !selectedDate}
          >
            <option value="">Selecciona una hora</option>
            {availableTimes.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <button
          className="btn-reserve"
          type="submit"
          disabled={loading || !selectedDate || !serviceId || !selectedTime}
        >
          {loading ? 'Reservando...' : 'Reservar Cita'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="btn-cancel"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
