const express = require('express');
const router =  express.Router();
const ClasesController = require('../controllers/clases.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const AuthController = require('../controllers/auth.controller');

router.get('/', verificarToken, verificarRol(1,2,3), ClasesController.obtenerClases);
router.get('/:id', verificarToken, verificarRol(1,2,3), ClasesController.obtenerClase);
router.post('/', verificarToken, verificarRol(1,3), ClasesController.crearClase);
router.put('/:codigo', verificarToken, verificarRol(1,3), ClasesController.actualizarClaseC);
router.delete('/:codigo', verificarToken, verificarRol(1), ClasesController.eliminarClaseC);
router.get('/mis-clases', verificarToken,verificarRol(1,2,3), ClasesController.obtenerMisClases);

module.exports = router;