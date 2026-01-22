// Controlador de administración: gestiona usuarios y citas
const { User, Appointment, Service } = require('../models');

// Obtener todos los usuarios con sus citas y servicios asociados
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: {
        model: Appointment,
        include: {
          model: Service,
          attributes: ['id', 'name', 'price']
        },
        order: [['date', 'ASC'], ['time', 'ASC']]
      },
      order: [['created_at', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

// Obtener todas las citas con información de usuario y servicio
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Service,
          attributes: ['id', 'name', 'price', 'duration']
        }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener citas', error: error.message });
  }
};

// Cancelar una cita (solo admin)
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Cita cancelada exitosamente', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error al cancelar la cita', error: error.message });
  }
};
