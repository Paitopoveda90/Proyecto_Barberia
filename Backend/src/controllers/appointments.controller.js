const { Appointment, Service } = require('../models');

// Crear una nueva cita para el usuario autenticado
exports.create = async (req, res) => {
  try {
    const { service_id, date, time } = req.body;

    if (!service_id || !date || !time) {
      return res.status(400).json({ message: 'Faltan campos requeridos: service_id, date, time' });
    }

    // Asegurar que la fecha esté en formato YYYY-MM-DD (sin hora)
    let dateFormatted = date;
    if (typeof date === 'string') {
      // Si viene con hora o timestamp, tomar solo la parte de fecha
      dateFormatted = date.split('T')[0];
    }
    
    // Log temporal para debug (puedes removerlo después)
    console.log('Fecha recibida del frontend:', date);
    console.log('Fecha formateada para guardar:', dateFormatted);

    const appointment = await Appointment.create({
      user_id: req.user.id,
      service_id,
      date: dateFormatted,
      time,
      status: 'scheduled'
    });

    // Incluir el servicio en la respuesta
    const appointmentWithService = await Appointment.findByPk(appointment.id, {
      include: {
        model: Service,
        attributes: ['id', 'name', 'description', 'price', 'duration']
      }
    });

    // Formatear la fecha a YYYY-MM-DD para evitar problemas de zona horaria
    const formattedAppointment = {
      ...appointmentWithService.toJSON(),
      date: dateFormatted // Usar la fecha ya formateada
    };

    res.json(formattedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la cita', error: error.message });
  }
};
// Eliminar una cita del usuario autenticado
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findOne({
      where: { id, user_id: req.user.id }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    await appointment.destroy();

    res.json({ message: 'Cita eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la cita', error: error.message });
  }
};
// Obtener todas las citas del usuario autenticado
exports.myAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { user_id: req.user.id },
      include: {
        model: Service,
        attributes: ['id', 'name', 'description', 'price', 'duration']
      },
      order: [['date', 'ASC'], ['time', 'ASC']]
    });

    // Formatear las fechas a YYYY-MM-DD para evitar problemas de zona horaria
    const formattedAppointments = appointments.map(appointment => {
      const appointmentData = appointment.toJSON();
      const date = appointmentData.date;
      
      // Formatear la fecha
      let dateStr;
      if (date instanceof Date) {
        // Usar métodos locales (no UTC) para evitar cambios de día
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        dateStr = `${year}-${month}-${day}`;
      } else if (typeof date === 'string') {
        // Si viene como string, tomar solo la parte de fecha (YYYY-MM-DD)
        dateStr = date.split('T')[0];
      } else {
        dateStr = date;
      }
      
      return {
        ...appointmentData,
        date: dateStr
      };
    });

    res.json(formattedAppointments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las citas', error: error.message });
  }
};
