// Modelo de fechas y horarios bloqueados (no disponibles para citas)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlockedDate = sequelize.define('BlockedDate', {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false // Fecha bloqueada
  },
  time: {
    type: DataTypes.TIME,
    allowNull: true, // Si es null, bloquea todo el día
    comment: 'Si es null, bloquea todo el día'
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true // Razón del bloqueo
  }
}, {
  tableName: 'blocked_dates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = BlockedDate;
