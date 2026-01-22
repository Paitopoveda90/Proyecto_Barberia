const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const admin = require('../middlewares/admin.middleware');
const adminController = require('../controllers/admin.controller');
const blockedDatesController = require('../controllers/blockedDates.controller');
const servicesController = require('../controllers/services.controller');


// Rutas de administración - todas requieren autenticación y rol admin
// Usuarios y citas
router.get('/users', auth, admin, adminController.getAllUsers); // Listar usuarios
router.get('/appointments', auth, admin, adminController.getAllAppointments); // Listar citas
router.put('/appointments/:id/cancel', auth, admin, adminController.cancelAppointment); // Cancelar cita

// Fechas bloqueadas
router.get('/blocked-dates', auth, admin, blockedDatesController.getAll); // Listar fechas bloqueadas
router.post('/blocked-dates', auth, admin, blockedDatesController.create); // Bloquear fecha
router.delete('/blocked-dates/:id', auth, admin, blockedDatesController.delete); // Desbloquear fecha

// Servicios (CRUD completo para admin)
router.post('/services', auth, admin, servicesController.create); // Crear servicio
router.put('/services/:id', auth, admin, servicesController.update); // Actualizar servicio
router.delete('/services/:id', auth, admin, servicesController.delete); // Eliminar servicio

module.exports = router;
