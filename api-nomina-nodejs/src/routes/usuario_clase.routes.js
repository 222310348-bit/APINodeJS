const express = require('express');
const router = express.Router();
const Usuario_ClaseController = require('../controllers/usuario_clase.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');

router.get('/', verificarToken, verificarRol(1), Usuario_ClaseController.obtenerInscripciones);
router.get('/:id', verificarToken, verificarRol(1), Usuario_ClaseController.obtenerInscripcion);
router.post('/', verificarToken, verificarRol(1), Usuario_ClaseController.InscripcionClase);
router.delete('/:id', verificarToken, verificarRol(1,3), Usuario_ClaseController.eliminarInscripcion);
router.post('/baja/:idInscripcion', verificarToken, verificarRol(2,3), Usuario_ClaseController.BajaClase);
module.exports = router;