const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');
const { verificarToken} = require('../middlewares/auth.middleware');

router.post('/login', AuthController.login);
router.get('/profile', verificarToken, AuthController.perfil);
router.post('/restablecer-password', AuthController.RestablecerPasswordPorCorreo);
router.post('/cambiar-password', verificarToken, AuthController.cambiarPassword);

module.exports = router;