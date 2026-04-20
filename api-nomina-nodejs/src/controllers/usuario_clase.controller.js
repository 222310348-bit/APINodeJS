const Usuario_Clase = require('../models/usuario_clase.models');
const Usuario = require('../models/usuario.models');
const Clases = require('../models/clases.models');

class Usuario_ClaseController {
    static async obtenerInscripciones(req, res) {
        try {
            const inscripciones = await Usuario_Clase.obtenerTodos();
            res.json(inscripciones);
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener inscripciones",
                error: error.message
            });
        }
    }

    static async obtenerInscripcion(req, res) {
        try {
            const { id } = req.params;
            const inscripcion = await Usuario_Clase.obtenerPorId(id);

            if (!inscripcion) {
                return res.status(404).json({ mensaje: "Inscripción no encontrada" });
            }

            res.json(inscripcion);
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener inscripción",
                error: error.message
            });
        }
    }

    static async InscripcionClase(req, res) {
        try {
            const { IdUsuario_FK, IdClase_FK } = req.body;

            if (!IdUsuario_FK || !IdClase_FK) {
                return res.status(400).json({ mensaje: "IdUsuario_FK e IdClase_FK son requeridos" });
            }

            const usuario = await Usuario.obtenerPorId(IdUsuario_FK);
            if (!usuario) {
                return res.status(404).json({ mensaje: "Usuario no encontrado" });
            }

            if (usuario.IdRol_FK !== 2 && usuario.IdRol_FK !== 3) {
                return res.status(400).json({ mensaje: "Solo usuarios con rol Alumno o Docente pueden inscribirse" });
            }

            const clase = await Clases.obtenerPorId(IdClase_FK);
            if (!clase) {
                return res.status(404).json({ mensaje: "Clase no encontrada" });
            }

            const yaInscrito = await Usuario_Clase.existeInscripcion(IdUsuario_FK, IdClase_FK);
            if (yaInscrito) {
                return res.status(400).json({ mensaje: "El usuario ya está inscrito en esta clase" });
            }

            const nuevaInscripcion = await Usuario_Clase.crear({ IdUsuario_FK, IdClase_FK });
            res.status(201).json({
                mensaje: "Inscripción creada correctamente",
                data: nuevaInscripcion
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al crear inscripción",
                error: error.message
            });
        }
    }

    static async eliminarInscripcion(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await Usuario_Clase.eliminar(id);

            if (!eliminado) {
                return res.status(404).json({ mensaje: "Inscripción no encontrada" });
            }

            res.json({
                mensaje: "Inscripción eliminada correctamente",
                data: eliminado
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al eliminar la inscripción",
                error: error.message
            });
        }
    }

    static async BajaClase(req, res) {
        try {
            const { idInscripcion } = req.params;
            const { idUsuarioSolicitante } = req.body;

            if (!idUsuarioSolicitante) {
                return res.status(400).json({ mensaje: "idUsuarioSolicitante es requerido" });
            }

            const inscripcion = await Usuario_Clase.obtenerInscripcionConDetalles(idInscripcion);
            if (!inscripcion) {
                return res.status(404).json({ mensaje: "Inscripción no encontrada" });
            }

            const usuarioSolicitante = await Usuario.obtenerPorId(idUsuarioSolicitante);
            if (!usuarioSolicitante) {
                return res.status(404).json({ mensaje: "Usuario solicitante no encontrado" });
            }

            const esAlumnoMismo = inscripcion.IdUsuario_FK === idUsuarioSolicitante && usuarioSolicitante.IdRol_FK === 2;
            const esDocente = usuarioSolicitante.IdRol_FK === 3;

            if (!esAlumnoMismo && !esDocente) {
                return res.status(403).json({ 
                    mensaje: "No tienes permisos para dar de baja esta inscripción. Solo el alumno o un docente pueden hacerlo" 
                });
            }

            if (esDocente) {
                const docentesClase = await Usuario_Clase.obtenerDocentesClase(inscripcion.IdClase_FK);
                if (!docentesClase.includes(idUsuarioSolicitante)) {
                    return res.status(403).json({ 
                        mensaje: "Solo los docentes de esta clase pueden dar de baja a los alumnos" 
                    });
                }
            }

            const eliminado = await Usuario_Clase.eliminar(idInscripcion);
            if (!eliminado) {
                return res.status(500).json({ mensaje: "No se pudo procesar la baja" });
            }

            res.json({
                mensaje: "Baja de clase realizada correctamente",
                data: {
                    alumno: `${inscripcion.NombresU} ${inscripcion.ApellidosU}`,
                    clase: inscripcion.NombreC
                }
            });
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al procesar la baja de clase",
                error: error.message
            });
        }
    }
}

module.exports = Usuario_ClaseController;