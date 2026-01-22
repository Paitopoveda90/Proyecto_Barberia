// Configuración principal de la app Express
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const appointmentRoutes = require('./routes/appointments.routes');
const serviceRoutes = require('./routes/services.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/services', serviceRoutes);
app.use('/admin', adminRoutes);

module.exports = app;
