const express = require('express');
const router =  express.Router();
const ClasesController = require('../controllers/clases.controller');
const conversacionController = require('../controllers/conversacion.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const AuthController = require('../controllers/auth.controller');

router.get('/', verificarToken, verificarRol(1,2,3), ClasesController.obtenerClases);
router.get('/mis-clases', verificarToken, verificarRol(1,2,3), ClasesController.obtenerMisClases);
router.post('/unirse/:codigo', verificarToken, verificarRol(2), ClasesController.unirseClase);
router.get('/:codigo/conversaciones', verificarToken, verificarRol(1,2,3), conversacionController.obtenerConversacionesPorClase);
router.get('/:codigo/mis-asistencias', verificarToken, verificarRol(2), ClasesController.obtenerMisAsistenciasClase);
router.get('/:codigo/asistencias-alumnos', verificarToken, verificarRol(3), ClasesController.obtenerAsistenciasAlumnosClase);
router.get('/:id', verificarToken, verificarRol(1,2,3), ClasesController.obtenerClase);
router.post('/', verificarToken, verificarRol(1,3), ClasesController.crearClase);
router.put('/:codigo', verificarToken, verificarRol(1,3), ClasesController.actualizarClaseC);
router.delete('/:codigo', verificarToken, verificarRol(1), ClasesController.eliminarClaseC);

module.exports = router;