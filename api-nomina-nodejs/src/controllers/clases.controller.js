const Clases = require('../models/clases.models');

class ClasesController {
    //Obtener todas las clases
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
    //Obtener solo una clase
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
        const tieneClase = clasesUsuario.some(c => c.Codigo_PK === id);

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

    static async obtenerMisClases(req, res) {
    try {
        // Extraemos los datos del token
        const idUsuario = req.usuario.id_usuario;
        const rol = Number(req.usuario.rol);
        
        let clases;

        // Verificamos el rol para decidir qué método del modelo llamar
        if (rol === 1) {
            clases = await Clases.obtenerClasesPorUsuarioTipoAdmin();
        } else {
            // Si es Docente (2) o Alumno (3)
            clases = await Clases.obtenerClasesPorUsuario(idUsuario);
        }

        res.json(clases);
    } catch (error) {
        console.error("Error al obtener mis clases:", error);
        res.status(500).json({
            mensaje: "Error al obtener la lista de clases",
            error: error.message
        });
    }
}

static async crearClase(req, res) {
    try {
        const { NombreC, IdClase, IdDocenteSeleccionado } = req.body;
        const idUsuarioToken = req.usuario.id_usuario;
        const rolToken = Number(req.usuario.rol);

        // Si es Admin, usa el ID que eligió del select y si es Docente, usa su propio ID del token.
        const idProfeFinal = IdDocenteSeleccionado || req.usuario.id_usuario;

        if (!idProfeFinal) {
            return res.status(400).json({ mensaje: "Debes asignar un docente a la clase" });
        }

        const codigoGenerado = await Clases.crearClaseCompleta(NombreC, IdClase, idProfeFinal);

        res.status(201).json({
                mensaje: "Clase creada exitosamente",
                codigo: codigoGenerado
            });
        } catch (error) {
            res.status(500).json({ mensaje: "Error", error: error.message });
        }
    }

    static async actualizarClaseC(req, res) {
        try {
            const { codigo } = req.params;
            const { NombreC, IdClase, IdDocenteSeleccionado } = req.body;
        
            // Si no viene docente de la web, usamos el del token para que no falle el SQL
            const docente = IdDocenteSeleccionado || req.usuario.id_usuario;

            await Clases.actualizarClaseCompleta(codigo, NombreC, IdClase, docente);
            res.json({ mensaje: "Actualizado con éxito" });
        } catch (error) {
            res.status(500).json({ mensaje: "Error", error: error.message });
        }
    }

    static async eliminarClaseC(req, res) {
        try {
            const { codigo } = req.params;
            if (!codigo) throw new Error("Código no proporcionado");

            await Clases.eliminarClaseCompleta(codigo);
            res.json({ mensaje: "Eliminado con éxito" });
        } catch (error) {
            console.error("Error en borrar:", error.message);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ClasesController;