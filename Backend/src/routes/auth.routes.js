const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


// Rutas de autenticación
router.post('/register', authController.register); // Registro
router.post('/login', authController.login); // Login
router.get('/me', authController.me); // Obtener usuario autenticado

module.exports = router;
