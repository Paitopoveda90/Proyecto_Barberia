// Middleware para verificar si el usuario autenticado es administrador
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    // req.user viene del middleware de auth
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    // Obtener el usuario completo de la base de datos para verificar el rol
    const user = await User.findByPk(req.user.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar permisos', error: error.message });
  }
};
