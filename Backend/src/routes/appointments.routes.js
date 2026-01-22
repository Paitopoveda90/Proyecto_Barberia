const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointments.controller');
const auth = require('../middlewares/auth.middleware');


// Rutas de citas para usuarios autenticados
router.post('/', auth, controller.create); // Crear cita
router.get('/me', auth, controller.myAppointments); // Listar citas propias
router.delete('/:id', auth, controller.delete); // Eliminar cita propia

module.exports = router;
