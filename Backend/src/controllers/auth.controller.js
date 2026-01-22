const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash
    });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);

    res.json({ user, token });

  } catch (error) {
    res.status(400).json({ message: 'Error al registrar' });
  }
};

// Iniciar sesión de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Usuario no existe' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);

    // Excluir la contraseña de la respuesta
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    };

    res.json({ user: userResponse, token });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error servidor' });
  }
};


// Obtener información del usuario autenticado a partir del token
exports.me = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token requerido' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token inválido' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};