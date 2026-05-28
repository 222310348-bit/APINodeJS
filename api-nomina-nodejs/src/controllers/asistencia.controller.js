const Asistencia = require('../models/asistencia.models');
const Usuario = require('../models/usuario.models');
const Usuario_Clase = require('../models/usuario_clase.models');

class AsistenciaController {

    static async obtenerAsistencias(req, res) {
    try {
        const idUsuario = req.usuario.id_usuario;
        const rol = Number(req.usuario.rol);
        const { CodigoClase } = req.query; 

        let asistencias;

        if (rol === 1) {
            if (CodigoClase) {
                asistencias = await Asistencia.obtenerAsitenciaClase([CodigoClase]);
            } else {
                return res.status(404).json({
                    mensaje: "Ingresa el codigo de la clase que quiere ver las asistencias"
                });
            }
        }

        else if (rol === 2) {
            if (CodigoClase) {
                asistencias = await Asistencia.obtenerAsistenciaAlumnoPorClase(idUsuario, CodigoClase);
            } else {
                asistencias = await Asistencia.obtenerAsitenciaAlumno(idUsuario);
            }
        }

        else if (rol === 3) {
            const clases = await Usuario_Clase.obtenerClasesPorUsuario(idUsuario);

            if (!clases.length) {
                return res.status(404).json({
                    mensaje: "No tienes clases asignadas"
                });
            }
            const idsClases = clases.map(c => c.IdClase_FK);

            if (CodigoClase) {
                if (!idsClases.includes(CodigoClase)) {
                    return res.status(403).json({
                        mensaje: "No tienes acceso a esta clase"
                    });
                }
                asistencias = await Asistencia.obtenerAsitenciaClase([CodigoClase]);
            } 
            else {
                return res.status(404).json({
                    mensaje: "Ingresa el codigo de la clase que quiere ver las asistencias"
                });
            }
        }
        res.json({ data: asistencias });
    } 
    catch (error) {
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