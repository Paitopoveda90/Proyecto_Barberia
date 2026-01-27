const express = require('express');
const router = express.Router();
const controller = require('../controllers/blockedDates.controller');

// Ruta pública para obtener fechas bloqueadas (sin autenticación)
router.get('/', controller.getAll);

module.exports = router;
