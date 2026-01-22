// Relaciona y exporta todos los modelos de la aplicación
const User = require('./user');
const Service = require('./service');
const Appointment = require('./appointment');
const BlockedDate = require('./blockedDate');

// Un usuario puede tener muchas citas
User.hasMany(Appointment, { foreignKey: 'user_id' });
Appointment.belongsTo(User, { foreignKey: 'user_id' });

// Un servicio puede estar en muchas citas
Service.hasMany(Appointment, { foreignKey: 'service_id' });
Appointment.belongsTo(Service, { foreignKey: 'service_id' });

module.exports = { User, Service, Appointment, BlockedDate };
