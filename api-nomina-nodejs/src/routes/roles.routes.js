const express = require('express');
const router = express.Router();
const RolesController = require('../controllers/roles.controller');

router.get('/', RolesController.obtenerRoles);
router.post('/', RolesController.InsertarRol);
router.delete('/:id', RolesController.EliminaRol);
module.exports = router;
