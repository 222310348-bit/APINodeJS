const express = require('express');
const router = express.Router();
const conversacionController = require('../controllers/conversacion.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const AuthController = require('../controllers/auth.controller');


router.post('/', verificarToken, verificarRol(1,2,3), conversacionController.crearConversacion);
router.get('/', verificarToken, verificarRol(1,2,3), conversacionController.obtenerMisConversaciones);
router.get('/:id', verificarToken, verificarRol(1,2,3), conversacionController.obtenerConversacionPorId);
router.put('/:id/participantes', verificarToken, verificarRol(1,3), conversacionController.agregarParticipante);
router.put('/:id/administradores', verificarToken, verificarRol(1,3), conversacionController.agregarAdministrador);
router.patch('/:id/desactivar', verificarToken, verificarRol(1,3), conversacionController.desactivarConversacion);

module.exports = router;