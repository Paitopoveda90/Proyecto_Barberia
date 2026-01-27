import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAppointmentStore } from '../store/appointmentStore';
import { useServiceStore } from '../store/serviceStore';
import '../styles/bookAppointment.css';

// Configuración de idioma español para el calendario
const esLocale = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
  firstDayOfWeek: 1, // Lunes como primer día
};

// Horarios disponibles en formato 24h
const availableTimes24h = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30'
];

// Convertir hora de 24h a 12h (AM/PM)
const formatTime12h = (time24h) => {
  const [hours, minutes] = time24h.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export default function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [serviceId, setServiceId] = useState('');
  const navigate = useNavigate();

  const { createAppointment, loading, error, blockedDates, fetchBlockedDates } = useAppointmentStore();
  const { services, fetchServices } = useServiceStore();

  useEffect(() => {
    fetchServices();
    fetchBlockedDates();
  }, [fetchServices, fetchBlockedDates]);

  // Formatear fecha a YYYY-MM-DD sin problemas de zona horaria
  // Usa métodos locales (getFullYear, getMonth, getDate) para evitar conversiones UTC
  const formatDateToString = (date) => {
    if (!date) return '';
    
    // Si es string, devolverlo tal cual si ya está en formato YYYY-MM-DD
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    
    // Si es Date, usar métodos locales (no UTC) para evitar cambios de día
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    return '';
  };

  // Normalizar fecha para comparación (puede venir como string o Date)
  const normalizeDate = (dateValue) => {
    if (!dateValue) return '';
    
    // Si es string, extraer solo la parte de fecha (YYYY-MM-DD)
    if (typeof dateValue === 'string') {
      // Puede venir como "2024-01-15" o "2024-01-15T00:00:00.000Z"
      const datePart = dateValue.split('T')[0];
      // Validar formato YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
        return datePart;
      }
    }
    
    // Si es Date, formatearlo
    if (dateValue instanceof Date) {
      return formatDateToString(dateValue);
    }
    
    // Si es un objeto con propiedades de fecha (de Sequelize)
    if (dateValue && typeof dateValue === 'object') {
      // Intentar extraer la fecha si es un objeto Date dentro
      if (dateValue.getFullYear) {
        return formatDateToString(dateValue);
      }
    }
    
    return '';
  };

  // Debug: mostrar fechas bloqueadas cuando cambien (después de declarar normalizeDate)
  useEffect(() => {
    if (blockedDates && blockedDates.length > 0) {
      console.log('Fechas bloqueadas recibidas:', blockedDates);
      // Usar normalizeDate directamente en el map (función pura, no necesita estar en dependencias)
      const normalizeDateForLog = (dateValue) => {
        if (!dateValue) return '';
        if (typeof dateValue === 'string') {
          const datePart = dateValue.split('T')[0];
          if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
            return datePart;
          }
        }
        if (dateValue instanceof Date) {
          return formatDateToString(dateValue);
        }
        return '';
      };
      console.log('Fechas bloqueadas normalizadas:', blockedDates.map(b => ({
        id: b.id,
        date: b.date,
        dateNormalized: normalizeDateForLog(b.date),
        time: b.time
      })));
    } else {
      console.log('No hay fechas bloqueadas');
    }
  }, [blockedDates]);

  // Verificar si una fecha está bloqueada
  const isDateBlocked = (date) => {
    if (!blockedDates || blockedDates.length === 0) return false;
    if (!date) return false;
    
    const dateStr = formatDateToString(date);
    
    const isBlocked = blockedDates.some(blocked => {
      const blockedDateStr = normalizeDate(blocked.date);
      
      // Comparar fechas normalizadas
      if (blockedDateStr === dateStr) {
        // Si time es null o undefined, todo el día está bloqueado
        return blocked.time === null || blocked.time === undefined;
      }
      return false;
    });
    
    return isBlocked;
  };

  // Verificar si un horario específico está bloqueado
  const isTimeBlocked = (time) => {
    if (!selectedDate || !blockedDates || blockedDates.length === 0) return false;
    
    const dateStr = formatDateToString(selectedDate);
    return blockedDates.some(blocked => {
      const blockedDateStr = normalizeDate(blocked.date);
      if (blockedDateStr === dateStr) {
        // Si time es null, todo el día está bloqueado
        if (blocked.time === null) return true;
        // Si hay un time específico, verificar si coincide (normalizar formato de hora)
        const blockedTime = blocked.time ? blocked.time.substring(0, 5) : null; // Asegurar formato HH:MM
        return blockedTime === time;
      }
      return false;
    });
  };

  // Obtener horarios disponibles para la fecha seleccionada
  const getAvailableTimes = () => {
    if (!selectedDate) return availableTimes24h;
    
    return availableTimes24h.filter(time => !isTimeBlocked(time));
  };

  // Obtener fecha mínima (mañana)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  // Obtener fecha máxima (3 meses adelante)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Resetear hora al cambiar fecha
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !serviceId || !selectedTime) {
      alert('Por favor, completa todos los campos: servicio, fecha y hora');
      return;
    }

    // Validar que la fecha no sea en el pasado
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(parseInt(selectedTime.split(':')[0]));
    selectedDateTime.setMinutes(parseInt(selectedTime.split(':')[1]));
    const now = new Date();
    
    if (selectedDateTime <= now) {
      alert('Por favor, selecciona una fecha y hora futuras');
      return;
    }

    // Validar que la fecha/hora no esté bloqueada
    if (isDateBlocked(selectedDate) || isTimeBlocked(selectedTime)) {
      alert('Esta fecha u horario no está disponible');
      return;
    }

    // Formatear fecha sin problemas de zona horaria
    // Asegurar que usamos la fecha local seleccionada
    const dateStr = formatDateToString(selectedDate);
    
    // Log para debug (puedes removerlo después)
    console.log('Fecha seleccionada (Date):', selectedDate);
    console.log('Fecha formateada (YYYY-MM-DD):', dateStr);
    
    const result = await createAppointment({
      service_id: parseInt(serviceId),
      date: dateStr,
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
        <div className="form-group calendar-group">
          <label>Fecha *</label>
          <div className="calendar-wrapper">
            <Calendar
              key={`calendar-${blockedDates.length}-${blockedDates.map(b => b.id).join('-')}`}
              onChange={handleDateChange}
              value={selectedDate}
              minDate={getMinDate()}
              maxDate={getMaxDate()}
              formatShortWeekday={(locale, date) => {
                return esLocale.dayNamesShort[date.getDay()];
              }}
              formatMonthYear={(locale, date) => {
                return `${esLocale.monthNames[date.getMonth()]} ${date.getFullYear()}`;
              }}
              formatDay={(locale, date) => {
                return date.getDate().toString();
              }}
              tileDisabled={({ date }) => {
                // Deshabilitar fechas pasadas y bloqueadas
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const checkDate = new Date(date);
                checkDate.setHours(0, 0, 0, 0);
                const blocked = isDateBlocked(date);
                return checkDate < today || blocked;
              }}
              tileClassName={({ date, view }) => {
                if (view === 'month') {
                  const dateStr = formatDateToString(date);
                  const isBlocked = isDateBlocked(date);
                  
                  if (isBlocked) {
                    return 'react-calendar__tile--blocked';
                  }
                  
                  if (selectedDate) {
                    const selectedDateStr = formatDateToString(selectedDate);
                    if (dateStr === selectedDateStr) {
                      return 'react-calendar__tile--selected';
                    }
                  }
                }
                return null;
              }}
              className="custom-calendar"
            />
          </div>
          {selectedDate && (
            <p className="selected-date">
              Fecha seleccionada: {selectedDate.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          )}
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
            {getAvailableTimes().map(time => (
              <option key={time} value={time} disabled={isTimeBlocked(time)}>
                {formatTime12h(time)}
              </option>
            ))}
          </select>
          {selectedDate && getAvailableTimes().length === 0 && (
            <p className="unavailable-text">No hay horarios disponibles para esta fecha</p>
          )}
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

      {/* Leyenda del calendario */}
      <div className="calendar-legend">
        <span>
          <i className="legend-available"></i>
          Disponible
        </span>
        <span>
          <i className="legend-blocked"></i>
          Bloqueado
        </span>
        <span>
          <i className="legend-selected"></i>
          Seleccionado
        </span>
      </div>
    </div>
  );
}
