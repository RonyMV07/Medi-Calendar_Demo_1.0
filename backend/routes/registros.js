const express = require('express');
const router = express.Router();
const registrosController = require('../controllers/registrosController');
const auth = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(auth);

// POST /api/registros - Crear nuevo registro diario
router.post('/', registrosController.crearRegistro);

// GET /api/registros - Obtener todos los registros del usuario
router.get('/', registrosController.obtenerRegistros);

// GET /api/registros/:fecha - Obtener registro por fecha
router.get('/:fecha', registrosController.obtenerRegistroPorFecha);

// DELETE /api/registros/:id - Eliminar registro
router.delete('/:id', registrosController.eliminarRegistro);

module.exports = router;
