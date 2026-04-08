const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.controller');

router.get('/', UsuarioController.obtenerTodos);
router.get('/:id', UsuarioController.obtenerPorIdC);
router.post('/', UsuarioController.crearUsuarioC);
router.put('/:id', UsuarioController.ModificarUsuario);
router.delete('/:id', UsuarioController.EliminarUsuarioC);
router.post('/login', UsuarioController.IniciarSesion);
router.post('/contrasena', UsuarioController.ModificarContraseña);
module.exports = router;