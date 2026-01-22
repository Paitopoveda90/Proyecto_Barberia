// Modelo de usuario para la autenticación y gestión de roles
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: DataTypes.STRING, // Nombre del usuario
  email: { type: DataTypes.STRING, unique: true }, // Email único
  password: DataTypes.STRING, // Contraseña hasheada
  role: { type: DataTypes.STRING, defaultValue: 'client' } // Rol: client o admin
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = User;
