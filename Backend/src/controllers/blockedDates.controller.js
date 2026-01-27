const { BlockedDate } = require('../models');

// Obtener todas las fechas y horarios bloqueados
exports.getAll = async (req, res) => {
  try {
    // Verificar que el modelo esté disponible
    if (!BlockedDate) {
      console.error('BlockedDate model is not available');
      return res.status(500).json({ message: 'Error: Modelo no disponible' });
    }
    
    const blockedDates = await BlockedDate.findAll({
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    
    // Formatear las fechas a YYYY-MM-DD para evitar problemas de zona horaria
    const formattedDates = blockedDates.map(blocked => {
      const date = blocked.date;
      // Si date es un objeto Date, formatearlo; si es string, asegurar formato YYYY-MM-DD
      let dateStr;
      if (date instanceof Date) {
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
        id: blocked.id,
        date: dateStr,
        time: blocked.time,
        reason: blocked.reason,
        created_at: blocked.created_at,
        updated_at: blocked.updated_at
      };
    });
    
    res.json(formattedDates);
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
