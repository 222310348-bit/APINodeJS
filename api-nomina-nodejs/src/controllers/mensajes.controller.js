const Mensaje = require('../models/mensajes.models');
const Conversacion = require('../models/conversacion.models');

const enviarMensaje = async (req, res) => {
    try {
        const { conversacionId, contenido } = req.body;
        const usuario = req.usuario;

        //Validar conversación
        const conversacion = await Conversacion.findById(conversacionId);

        if (!conversacion || !conversacion.activa) {
            return res.status(404).json({
                mensaje: 'Conversación no válida'
            });
        }

        //Validar que el usuario pertenece a la conversación
        if (!conversacion.participantes.includes(Number(usuario.id_usuario))) {
            return res.status(403).json({
                mensaje: 'No perteneces a esta conversación'
            });
        }

        const nuevoMensaje = new Mensaje({
            conversacionId,
            emisorId: usuario.id_usuario, //El id se obtiene mediante el token
            contenido
        });

        const mensajeGuardado = await nuevoMensaje.save();

        res.status(201).json({
            mensaje: 'Mensaje enviado',
            datos: mensajeGuardado
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al enviar mensaje',
            error: error.message
        });
    }
};


// EDITAR MENSAJE
const editarMensaje = async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevoContenido } = req.body;
        const usuario = req.usuario;

        const mensajeOriginal = await Mensaje.findById(id);

        if (!mensajeOriginal) {
            return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
        }

        //SOLO EL EMISOR PUEDE EDITAR
        if (mensajeOriginal.emisorId !== usuario.id_usuario) {
            return res.status(403).json({
                mensaje: 'No puedes editar este mensaje'
            });
        }

        const versionAnterior = {
            contenidoAnterior: mensajeOriginal.contenido,
            fechaEdicion: new Date(),
            numeroEdicion: mensajeOriginal.totalEdiciones + 1
        };

        mensajeOriginal.contenido = nuevoContenido;
        mensajeOriginal.editado = true;
        mensajeOriginal.totalEdiciones += 1;
        mensajeOriginal.historialEdiciones.push(versionAnterior);

        const mensajeActualizado = await mensajeOriginal.save();

        res.json({
            mensaje: 'Mensaje editado',
            datos: mensajeActualizado
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al editar',
            error: error.message
        });
    }
};


//ELIMINAR MENSAJE
const eliminarMensaje = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = req.usuario;

        const mensaje = await Mensaje.findById(id);

        if (!mensaje) {
            return res.status(404).json({
                mensaje: 'Mensaje no encontrado'
            });
        }

        // Solo emisor o admin
        if (
            mensaje.emisorId !== usuario.id_usuario &&
            usuario.rol !== 1
        ) {
            return res.status(403).json({
                mensaje: 'No tienes permiso para eliminar este mensaje'
            });
        }

        mensaje.eliminado = true;
        mensaje.visible = false;

        await mensaje.save();

        res.json({
            mensaje: 'Mensaje eliminado'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar',
            error: error.message
        });
    }
};


// REPORTAR MENSAJE
const reportarMensaje = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo } = req.body;
        const usuario = req.usuario;

        const mensaje = await Mensaje.findById(id);

        if (!mensaje) {
            return res.status(404).json({
                mensaje: 'Mensaje no encontrado'
            });
        }

        // Evitar que se reporte a sí mismo
        if (mensaje.emisorId === usuario.id_usuario) {
            return res.status(400).json({
                mensaje: 'No puedes reportar tu propio mensaje'
            });
        }

        mensaje.reportes.push({
            reportadoPor: usuario.id_usuario,
            motivo,
            fecha: new Date()
        });

        await mensaje.save();

        res.json({
            mensaje: 'Mensaje reportado'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al reportar',
            error: error.message
        });
    }
};


module.exports = {
    enviarMensaje,
    editarMensaje,
    eliminarMensaje,
    reportarMensaje
};