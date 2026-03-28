// Redactar ruta
const express = require('express');
const router =  express.Router();
const UsuarioController = require('../controllers/usuario.controller');

router.get('/', UsuarioController.obtenerUsuarios);
router.get('/:id', UsuarioController.obtenerUsuario);
router.post('/', UsuarioController.crearUsuario);
router.put('/:id', UsuarioController.actualizarUsuario);
router.delete('/:id', UsuarioController.eliminarUsuario);



module.exports = router;