// Configuración principal de la app Express
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const appointmentRoutes = require('./routes/appointments.routes');
const serviceRoutes = require('./routes/services.routes');
const adminRoutes = require('./routes/admin.routes');
const blockedDatesRoutes = require('./routes/blockedDates.routes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas principales
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/services', serviceRoutes);
app.use('/admin', adminRoutes);
app.use('/blocked-dates', blockedDatesRoutes);

module.exports = app;
