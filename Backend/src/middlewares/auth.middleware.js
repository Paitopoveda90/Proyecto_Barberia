// Middleware para verificar el token JWT y autenticar al usuario
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No autorizado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Se agrega el usuario decodificado al request
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
};
