const Clases = require('../models/clases.models');

class ClasesController {

    static async obtenerClases(req, res) {
    try {
        const idUsuario = req.usuario.id_usuario;
        const rol = Number(req.usuario.rol);

        let clases;

        if (rol === 1) {
            clases = await Clases.obtenerTodos();
        } 
        else {
            clases = await Clases.obtenerClasesPorUsuario(idUsuario);
        }
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
        const { id } = req.params;
        const idUsuario = req.usuario.id_usuario;
        const rol = Number(req.usuario.rol);

        const clase = await Clases.obtenerPorId(id);

        if (!clase) {
            return res.status(404).json({ mensaje: "Clase no encontrada" });
        }
        if (rol === 1) {
            return res.json(clase);
        }
        const clasesUsuario = await Clases.obtenerClasesPorUsuario(idUsuario);
        const tieneClase = clasesUsuario.some(c => c.IdClase_PK === id);

        if (!tieneClase) {
            return res.status(403).json({
                mensaje: "No tienes acceso a esta clase"
            });
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