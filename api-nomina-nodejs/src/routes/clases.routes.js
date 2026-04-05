const express = require('express');
const router =  express.Router();
const ClasesController = require('../controllers/clases.controller');

router.get('/', ClasesController.obtenerClases);
router.get('/:nombre', ClasesController.obtenerClase);
router.post('/', ClasesController.crearClase);
router.delete('/:id', ClasesController.eliminarClase);



module.exports = router;