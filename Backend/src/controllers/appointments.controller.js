const { Appointment, Service } = require('../models');

// Crear una nueva cita para el usuario autenticado
exports.create = async (req, res) => {
  try {
    const { service_id, date, time } = req.body;

    if (!service_id || !date || !time) {
      return res.status(400).json({ message: 'Faltan campos requeridos: service_id, date, time' });
    }

    const appointment = await Appointment.create({
      user_id: req.user.id,
      service_id,
      date,
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

    res.json(appointmentWithService);
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

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las citas', error: error.message });
  }
};
