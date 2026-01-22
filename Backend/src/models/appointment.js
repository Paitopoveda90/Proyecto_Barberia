// Modelo de cita para agendar servicios
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  date: DataTypes.DATEONLY, // Fecha de la cita
  time: DataTypes.TIME,     // Hora de la cita
  status: DataTypes.STRING  // Estado: scheduled, completed, cancelled
}, {
  tableName: 'appointments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Appointment;
