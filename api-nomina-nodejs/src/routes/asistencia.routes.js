const express = require('express');
const router = express.Router();
const AsistenciaController = require('../controllers/asistencia.controller');

router.get('/', AsistenciaController.obtenerAsistencias);
router.post('/', AsistenciaController.CrearAsistencia);
router.put('/:id', AsistenciaController.ModificarAsistencia);
router.put('/Estado/:id', AsistenciaController.ModificarEstadoAsistencia);
router.delete('/:id', AsistenciaController.EliminarAsistenciaC);
module.exports = router;