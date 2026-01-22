const express = require('express');
const router = express.Router();
const controller = require('../controllers/services.controller');


// Ruta pública para obtener servicios
router.get('/', controller.getAll);

module.exports = router;
