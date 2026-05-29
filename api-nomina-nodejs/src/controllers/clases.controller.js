const Clases = require('../models/clases.models');
const Usuario = require('../models/usuario.models');
const Usuario_Clase = require('../models/usuario_clase.models');
const Asistencia = require('../models/asistencia.models');
const Conversacion = require('../models/conversacion.models');

class ClasesController {
    static async obtenerClases(req, res) {
        try {
            const idUsuario = req.usuario.id_usuario;
            const rol = Number(req.usuario.rol);

            let clases;
            if (rol === 1) {
                clases = await Clases.obtenerTodos();
            } else {
                clases = await Clases.obtenerClasesPorUsuario(idUsuario);
            }

            res.json(clases);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener clases',
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
                return res.status(404).json({ mensaje: 'Clase no encontrada' });
            }

            if (rol === 1) {
                return res.json(clase);
            }

            const clasesUsuario = await Clases.obtenerClasesPorUsuario(idUsuario);
            const tieneClase = clasesUsuario.some(c => c.Codigo_PK === id);
            if (!tieneClase) {
                return res.status(403).json({ mensaje: 'No tienes acceso a esta clase' });
            }

            res.json(clase);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener clase',
                error: error.message
            });
        }
    }

    static async obtenerMisClases(req, res) {
        try {
            const idUsuario = req.usuario.id_usuario;
            const rol = Number(req.usuario.rol);

            let clases;
            if (rol === 1) {
                clases = await Clases.obtenerClasesPorUsuarioTipoAdmin();
            } else {
                clases = await Clases.obtenerClasesPorUsuario(idUsuario);
            }

            res.json(clases);
        } catch (error) {
            console.error('Error al obtener mis clases:', error);
            res.status(500).json({
                mensaje: 'Error al obtener la lista de clases',
                error: error.message
            });
        }
    }

    static async crearClase(req, res) {
        try {
            const { NombreC, IdClase, IdDocenteSeleccionado } = req.body;
            const idProfeFinal = IdDocenteSeleccionado || req.usuario.id_usuario;

            if (!idProfeFinal) {
                return res.status(400).json({ mensaje: 'Debes asignar un docente a la clase' });
            }

            const codigoGenerado = await Clases.crearClaseCompleta(NombreC, IdClase, idProfeFinal);
            // Crear conversación grupal asociada a la clase
            try {
                const nuevaConv = new Conversacion({
                    nombreConversacion: `Clase: ${NombreC}`,
                    claseId: codigoGenerado,
                    esDirect: false,
                    participantes: [idProfeFinal],
                    administradores: { principal: idProfeFinal, designados: [] }
                });

                await nuevaConv.save();
            } catch (convErr) {
                console.error('Error creando conversación de clase automáticamente:', convErr);
                // No abortamos la creación de la clase por este error, pero lo registramos.
            }

            res.status(201).json({
                mensaje: 'Clase creada exitosamente',
                codigo: codigoGenerado
            });
        } catch (error) {
            res.status(500).json({ mensaje: 'Error', error: error.message });
        }
    }

    static async unirseClase(req, res) {
        try {
            const { codigo } = req.params;
            const idUsuario = req.usuario.id_usuario;

            const clase = await Clases.obtenerPorId(codigo);
            if (!clase) {
                return res.status(404).json({ mensaje: 'Clase no encontrada' });
            }

            const yaInscrito = await Usuario_Clase.existeInscripcion(idUsuario, codigo);
            if (yaInscrito) {
                return res.status(400).json({ mensaje: 'Ya estás inscrito en esta clase' });
            }

            const nuevaInscripcion = await Usuario_Clase.crear({ IdUsuario_FK: idUsuario, Codigo_FK: codigo });
            res.status(201).json({
                mensaje: 'Te has unido a la clase correctamente',
                data: nuevaInscripcion
            });
        } catch (error) {
            console.error('Error al unirse a la clase:', error);
            res.status(500).json({ mensaje: 'Error al unirse a la clase', error: error.message });
        }
    }

    static async obtenerMisAsistenciasClase(req, res) {
        try {
            const { codigo } = req.params;
            const idUsuario = req.usuario.id_usuario;

            const estaInscrito = await Usuario_Clase.existeInscripcion(idUsuario, codigo);
            if (!estaInscrito) {
                return res.status(403).json({ mensaje: 'No tienes acceso a esta clase' });
            }

            const asistencias = await Asistencia.obtenerAsistenciaAlumnoPorClase(idUsuario, codigo);
            res.json(asistencias);
        } catch (error) {
            console.error('Error al obtener asistencias del alumno por clase:', error);
            res.status(500).json({ mensaje: 'Error al obtener asistencias', error: error.message });
        }
    }

    static async obtenerAsistenciasAlumnosClase(req, res) {
        try {
            const { codigo } = req.params;
            const idUsuario = req.usuario.id_usuario;

            const estaInscrito = await Usuario_Clase.existeInscripcion(idUsuario, codigo);
            if (!estaInscrito) {
                return res.status(403).json({ mensaje: 'No tienes acceso a esta clase' });
            }

            const asistencias = await Asistencia.obtenerAsitenciaClase([codigo]);
            res.json(asistencias);
        } catch (error) {
            console.error('Error al obtener asistencias de alumnos por clase:', error);
            res.status(500).json({ mensaje: 'Error al obtener asistencias', error: error.message });
        }
    }

    static async obtenerAlumnosClase(req, res) {
        try {
            const { codigo } = req.params;
            const idUsuario = req.usuario.id_usuario;

            const estaInscrito = await Usuario_Clase.existeInscripcion(idUsuario, codigo);
            if (!estaInscrito) {
                return res.status(403).json({ mensaje: 'No tienes acceso a esta clase' });
            }

            const alumnos = await Usuario_Clase.obtenerAlumnosClase(codigo);
            res.json({ data: alumnos });
        } catch (error) {
            console.error('Error al obtener alumnos de la clase:', error);
            res.status(500).json({ mensaje: 'Error al obtener alumnos', error: error.message });
        }
    }

    static async agregarAlumnosClase(req, res) {
        try {
            const { codigo } = req.params;
            const idUsuario = req.usuario.id_usuario;
            const { emails } = req.body;

            const estaInscrito = await Usuario_Clase.existeInscripcion(idUsuario, codigo);
            if (!estaInscrito) {
                return res.status(403).json({ mensaje: 'No tienes acceso a esta clase' });
            }

            if (!Array.isArray(emails) || !emails.length) {
                return res.status(400).json({ mensaje: 'Debes enviar una lista de correos válida.' });
            }

            const correosUnicos = [...new Set(emails.map((email) => String(email).trim().toLowerCase()).filter(Boolean))];
            const usuarios = await Promise.all(correosUnicos.map((correo) => Usuario.obtenerPorCorreo(correo)));

            const invalidos = [];
            const noAlumnos = [];
            const yaInscritos = [];
            const agregados = [];

            for (let i = 0; i < correosUnicos.length; i++) {
                const correo = correosUnicos[i];
                const usuario = usuarios[i];

                if (!usuario) {
                    invalidos.push(correo);
                    continue;
                }

                if (Number(usuario.IdRol_FK) !== 2) {
                    noAlumnos.push(correo);
                    continue;
                }

                const inscrito = await Usuario_Clase.existeInscripcion(usuario.IdUsuario_PK, codigo);
                if (inscrito) {
                    yaInscritos.push(correo);
                    continue;
                }

                await Usuario_Clase.crear({ IdUsuario_FK: usuario.IdUsuario_PK, Codigo_FK: codigo });
                agregados.push(correo);
            }

            if (invalidos.length > 0 || noAlumnos.length > 0) {
                return res.status(400).json({
                    mensaje: 'Algunos correos no pudieron agregarse.',
                    invalidos,
                    noAlumnos,
                    yaInscritos,
                    agregados
                });
            }

            res.json({ mensaje: 'Alumnos agregados correctamente', agregados, yaInscritos });
        } catch (error) {
            console.error('Error al agregar alumnos a la clase:', error);
            res.status(500).json({ mensaje: 'Error al agregar alumnos a la clase', error: error.message });
        }
    }

    static async desasignarAlumnoClase(req, res) {
        try {
            const { codigo, idAlumno } = req.params;
            const idUsuario = req.usuario.id_usuario;

            const estaInscrito = await Usuario_Clase.existeInscripcion(idUsuario, codigo);
            if (!estaInscrito) {
                return res.status(403).json({ mensaje: 'No tienes acceso a esta clase' });
            }

            const eliminado = await Usuario_Clase.desasignarAlumnoClase(idAlumno, codigo);
            if (!eliminado) {
                return res.status(404).json({ mensaje: 'Alumno no encontrado en esta clase' });
            }

            res.json({ mensaje: 'Alumno desasignado correctamente' });
        } catch (error) {
            console.error('Error al desasignar alumno de la clase:', error);
            res.status(500).json({ mensaje: 'Error al desasignar alumno de la clase', error: error.message });
        }
    }

    static async actualizarClaseC(req, res) {
        try {
            const { codigo } = req.params;
            const { NombreC, IdClase, IdDocenteSeleccionado } = req.body;
            const idUsuario = req.usuario.id_usuario;
            const rol = Number(req.usuario.rol);

            const clase = await Clases.obtenerPorId(codigo);
            if (!clase) {
                return res.status(404).json({ mensaje: 'Clase no encontrada' });
            }

            if (rol === 3) {
                const estaInscrito = await Usuario_Clase.existeInscripcion(idUsuario, codigo);
                if (!estaInscrito) {
                    return res.status(403).json({ mensaje: 'No tienes permiso para actualizar esta clase' });
                }
            }

            const idDocenteFinal = IdDocenteSeleccionado || req.usuario.id_usuario;
            await Clases.actualizarClaseCompleta(codigo, NombreC, IdClase, idDocenteFinal);
            res.json({ mensaje: 'Clase actualizada correctamente' });
        } catch (error) {
            console.error('Error al actualizar clase:', error);
            res.status(500).json({ mensaje: 'Error al actualizar la clase', error: error.message });
        }
    }

    static async eliminarClaseC(req, res) {
        try {
            const { codigo } = req.params;
            const idUsuario = req.usuario.id_usuario;
            const rol = Number(req.usuario.rol);

            const clase = await Clases.obtenerPorId(codigo);
            if (!clase) {
                return res.status(404).json({ mensaje: 'Clase no encontrada' });
            }

            if (rol === 3) {
                const estaInscrito = await Usuario_Clase.existeInscripcion(idUsuario, codigo);
                if (!estaInscrito) {
                    return res.status(403).json({ mensaje: 'No tienes permiso para eliminar esta clase' });
                }
            }

            const result = await Clases.eliminarClaseCompleta(codigo);

            // Intentar eliminar la conversación asociada en MongoDB
            try {
                const convEliminada = await Conversacion.findOneAndDelete({ claseId: codigo });
                if (convEliminada) {
                    console.log('Conversación vinculada a la clase eliminada:', convEliminada._id);
                }
            } catch (convErr) {
                console.error('Error al eliminar conversación vinculada a la clase:', convErr.message);
                // No fallamos la operación principal por esto
            }

            res.json({ mensaje: 'Clase eliminada correctamente', affectedRows: result.affectedRows || 0 });
        } catch (error) {
            console.error('Error al eliminar clase:', error);
            res.status(500).json({ mensaje: 'Error al eliminar la clase', error: error.message });
        }
    }
}

module.exports = ClasesController;
