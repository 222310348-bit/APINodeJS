// Etapa 7, Paso 7.2
// Definimos la puerta de entrada para los mensajes.

const express = require('express');
const router = express.Router();
const mensajeController = require('../controllers/mensaje.controller');

// Ruta para enviar un mensaje
// URL final: POST http://localhost:4000/api/mensajes
router.post('/', mensajeController.enviarMensaje);

// NUEVAS RUTAS
// Editar mensaje (PUT porque modificamos todo el cuerpo del mensaje y el historial)
router.put('/:id/editar', mensajeController.editarMensaje);

// Eliminar mensaje (PATCH porque solo tocamos dos pequeñas banderas: eliminado y visible)
router.patch('/:id/eliminar', mensajeController.eliminarMensaje);

// Reportar mensaje (POST porque estamos "creando" un reporte nuevo dentro del mensaje)
router.post('/:id/reportar', mensajeController.reportarMensaje);

module.exports = router;
