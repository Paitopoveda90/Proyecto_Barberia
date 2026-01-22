const { BlockedDate } = require('../models');

// Obtener todas las fechas y horarios bloqueados
exports.getAll = async (req, res) => {
  try {
    const blockedDates = await BlockedDate.findAll({
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    res.json(blockedDates);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener fechas bloqueadas', error: error.message });
  }
};

// Crear una nueva fecha u horario bloqueado
exports.create = async (req, res) => {
  try {
    const { date, time, reason } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'La fecha es requerida' });
    }

    // Verificar si ya existe
    const existing = await BlockedDate.findOne({
      where: { date, time: time || null }
    });

    if (existing) {
      return res.status(400).json({ message: 'Esta fecha/horario ya está bloqueado' });
    }

    const blockedDate = await BlockedDate.create({
      date,
      time: time || null,
      reason: reason || null
    });

    res.status(201).json(blockedDate);
  } catch (error) {
    res.status(500).json({ message: 'Error al bloquear fecha', error: error.message });
  }
};

// Eliminar un bloqueo de fecha u horario
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const blockedDate = await BlockedDate.findByPk(id);
    if (!blockedDate) {
      return res.status(404).json({ message: 'Bloqueo no encontrado' });
    }

    await blockedDate.destroy();
    res.json({ message: 'Bloqueo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar bloqueo', error: error.message });
  }
};
