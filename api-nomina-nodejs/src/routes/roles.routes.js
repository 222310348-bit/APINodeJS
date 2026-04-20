const express = require('express');
const router = express.Router();
const RolesController = require('../controllers/roles.controller');
const { verificarToken, verificarRol } = require('../middlewares/auth.middleware');
const AuthController = require('../controllers/auth.controller');

router.get('/',verificarToken, verificarRol(1), RolesController.obtenerRoles);
router.post('/',verificarToken, verificarRol(1), RolesController.InsertarRol);
router.delete('/:id',verificarToken, verificarRol(1), RolesController.EliminaRol);
module.exports = router;
