const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const AuthController = require('../controllers/auth.controller');

router.get('/', verificarToken, verificarRol(1), UsuarioController.obtenerTodos);
router.get('/:id', verificarToken,verificarRol(1), UsuarioController.obtenerPorIdC);
router.post('/', verificarToken, verificarRol(1), UsuarioController.crearUsuarioC);
router.put('/:id', verificarToken, verificarRol(1), UsuarioController.ModificarUsuario);
router.delete('/:id', verificarToken, verificarRol(1), UsuarioController.EliminarUsuarioC);
router.post('/login', AuthController.login);
router.post('/restablecer-password', AuthController.RestablecerPasswordPorCorreo);
//Esta ruta en el Front no se usa, pero la deje por si acaso, debido a que ocn esa ruta para cambiar la 
//contraseña se necesita estar logeado, cosa que es comun.
router.post('/contrasena', verificarToken, verificarRol(1), UsuarioController.ModificarContraseña);
module.exports = router;


