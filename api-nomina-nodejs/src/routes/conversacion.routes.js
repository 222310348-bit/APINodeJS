// Etapa 6, Paso 6.1
// Aquí le diremos a Express qué URL conectará con qué Controlador.

const express = require('express');
// Importamos nuestro Chef (el Controlador)
const conversacionController = require('../controllers/conversacion.controller');

// Creamos un "Enrutador" (Es como una libreta para el mesero)
const router = express.Router();


// ==========================================
// DEFINIMOS LAS RUTAS (Los caminos o URLs)
// ==========================================

// Cuando alguien haga una petición POST a la raíz de esta ruta,
// llama a la función 'crearConversacion' del controlador.
router.post('/', conversacionController.crearConversacion);

// NUEVAS RUTAS
// Usamos :id como un comodín. Express entenderá que lo que vaya ahí es el ID.
// Usamos PUT porque estamos actualizando/modificando un registro existente.

// Agregar Participante
router.put('/:id/participantes', conversacionController.agregarParticipante);

// Agregar Administrador Designado
router.put('/:id/administradores', conversacionController.agregarAdministrador);

// Desactivar (Archivar) Conversación
// Usamos PATCH porque es una modificación pequeña a un solo campo (activa: false)
router.patch('/:id/desactivar', conversacionController.desactivarConversacion);


// Exportamos las rutas para que app.js pueda leerlas
module.exports = router;