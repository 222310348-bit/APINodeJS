const express = require('express');
const router = express.Router();
const Usuario_ClaseController = require('../controllers/usuario_clase.controller');

router.get('/', Usuario_ClaseController.obtenerInscripciones);
router.get('/:id', Usuario_ClaseController.obtenerInscripcion);
router.post('/', Usuario_ClaseController.InscripcionClase);
router.delete('/:id', Usuario_ClaseController.eliminarInscripcion);
router.post('/baja/:idInscripcion', Usuario_ClaseController.BajaClase);

module.exports = router;
