const express = require('express');
const router = express.Router();
const AsistenciaController = require('../controllers/asistencia.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const AuthController = require('../controllers/auth.controller');


router.get('/',verificarToken, verificarRol(1,2,3), AsistenciaController.obtenerAsistencias);
router.post('/',verificarToken, verificarRol(1,3), AsistenciaController.CrearAsistencia);
router.put('/:id',verificarToken, verificarRol(1,3), AsistenciaController.ModificarAsistencia);
router.put('/Estado/:id',verificarToken, verificarRol(1,3), AsistenciaController.ModificarEstadoAsistencia);
router.delete('/:id',verificarToken, verificarRol(1,3), AsistenciaController.EliminarAsistenciaC);
module.exports = router;