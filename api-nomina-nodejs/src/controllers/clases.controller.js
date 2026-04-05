const Clases = require('../models/clases.model');

class ClasesController {

    static async obtenerClases(req, res) {
        try {
            const clases = await Clases.obtenerTodos();
            res.json(clases);
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener clases",
                error: error.message
            });
        }    
    }


    static async obtenerClase(req, res) {
        try {
            const { nombre } = req.params;
            const clase = await Clases.obtenerPorNombre(nombre);

            if (!clase) {
                return res.status(404).json({ mensaje: "Clase no encontrada"});
            }

            res.json(clase);
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener clase",
                error: error.message
            });
        }
    }

    static async crearClase(req, res) {
        try {
            
            const nuevaClase = await Clases.crear(req.body);


            res.status(201).json({
                mensaje: "Clase creada correctamente",
                data: nuevaClase
            });

        } catch (error) {
            res.status(500).json({
                mensaje: "Error al crear clase",
                error: error.message
            });
        }
    }

    static async eliminarClase(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await Clases.eliminar(id);

            res.status(201).json({ 
                mensaje: "Clase eliminada correctamente",
                data: eliminado
            });

        } catch (error) {
            res.status(500).json({
                mensaje: "Error al eliminar la clase",
                error: error.message
            });
        }
    }
}

module.exports = ClasesController;