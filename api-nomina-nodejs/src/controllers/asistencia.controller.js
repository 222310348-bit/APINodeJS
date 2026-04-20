const Asistencia = require('../models/asistencia.models');
const Usuario = require('../models/usuario.models');
const Usuario_Clase = require('../models/usuario_clase.models');

class AsistenciaController {

    static async obtenerAsistencias(req, res) {
    try {
        const { idUsuario } = req.body;
        const usuario = await Usuario.obtenerPorId(idUsuario);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }
        let asistencias;

        switch (usuario.IdRol_FK) {
            case 1: // Administrador
                asistencias = await Asistencia.obtenerTodos();
                break;
            case 2: // Estudiante
                asistencias = await Asistencia.obtenerAsitenciaAlumno(idUsuario);
                break;
            case 3: // Docente
                const clases = await Usuario_Clase.obtenerClasesPorUsuario(idUsuario);
                if (!clases || clases.length === 0) {
                    return res.status(404).json({
                        mensaje: "El docente no tiene clases asignadas"
                    });
                }

                const idsClases = clases.map(c => c.IdClase_FK);

                asistencias = await Asistencia.obtenerAsitenciaClase(idsClases);
                break;
            default:
                return res.status(403).json({
                    mensaje: "Rol no autorizado"
                });
        }
        res.json({
            data: asistencias
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener las asistencias",
            error: error.message
            });
        }
    }

    static async CrearAsistencia(req, res) {
        try{
            const nuevaAsistencia = await Asistencia.IngresarAsistencia(req.body)
            
            res.status(201).json({
            mensaje: "Asistencia creado exitosamente",
            data: nuevaAsistencia
            });
        }catch (error){
            res.status(500).json({
            mensaje: "Error al crear la asistencia",
            error: error.message
            });
        }
    }

    static async ModificarAsistencia(req, res) {
        try{
            const {id} = req.params
            const actualizado = await Asistencia.EditarAsistencia(id, req.body)
            if (actualizado) {
                res.json({
                mensaje: "Asistencia actualizado exitosamente",
                data: actualizado
                });
            } else {
                res.status(404).json({
                mensaje: "Asistencia no encontrada"
                });
            }   
        }catch (error){
            res.status(500).json({
            mensaje: "Error al modificar la asistencia",
            error: error.message
            });
        }
    }

    static async ModificarEstadoAsistencia(req, res) {
        try{
            const {id} = req.params
            const actualizado = await Asistencia.EditarEstadoAsistencia(id, req.body)
            if (actualizado) {
                res.json({
                mensaje: "Asistencia actualizado exitosamente",
                data: actualizado
                });
            } else {
                res.status(404).json({
                mensaje: "Asistencia no encontrada"
                });
            }   
        }catch (error){
            res.status(500).json({
            mensaje: "Error al modificar la asistencia",
            error: error.message
            });
        }
    }

    static async EliminarAsistenciaC(req, res) {
        try{
            const {id} = req.params
            const eliminado = await Asistencia.EliminarAsistencia(id)
            if (eliminado) {
                res.json({
                mensaje: "Asistencia eliminado exitosamente"
                });
            } else {
                res.status(404).json({
                mensaje: "Asistencia no encontrada"
                });
            }
        }catch (error){
            res.status(500).json({
            mensaje: "Error al eliminar la asistencia",
            error: error.message
            });
        }
    }
}

module.exports = AsistenciaController;