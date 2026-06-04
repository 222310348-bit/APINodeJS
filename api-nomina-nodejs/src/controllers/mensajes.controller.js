const Mensaje = require('../models/mensajes.models');
const Conversacion = require('../models/conversacion.models');
const { mysqlPool } = require('../config/mysql'); // Puente con el pool de MySQL

// ENVIAR MENSAJE
const enviarMensaje = async (req, res) => {
    try {
        const { conversacionId, contenido } = req.body;
        const emisorId = req.usuario.id_usuario; // Extraído del token inyectado por verificarToken

        if (!contenido || contenido.trim() === '') {
            return res.status(400).json({ 
                status: 'error', 
                mensaje: 'El contenido del mensaje no puede estar vacío' 
            });
        }

        const nuevoMensaje = new Mensaje({
            conversacionId,
            emisorId,
            contenido
        });

        await nuevoMensaje.save();

        res.status(201).json({
            status: 'success',
            mensaje: 'Mensaje enviado con éxito',
            data: nuevoMensaje
        });

    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({
            status: 'error',
            mensaje: 'Hubo un error al procesar el mensaje',
            error: error.message
        });
    }
};

// OBTENER MENSAJES POR CONVERSACIÓN (CON PUENTE HÍBRIDO)
const obtenerMensajesPorConversacion = async (req, res) => {
    try {
        const { id } = req.params; // ID de la conversación (ObjectId)
        const usuario = req.usuario;

        // 1. Verificar que la conversación exista y que el usuario pertenezca a ella
        const conversacion = await Conversacion.findById(id);
        if (!conversacion || !conversacion.activa) {
            return res.status(404).json({ mensaje: 'Conversación no encontrada' });
        }

        if (!conversacion.participantes.includes(Number(usuario.id_usuario))) {
            return res.status(403).json({ mensaje: 'No perteneces a esta conversación' });
        }

        // 2. Traer los mensajes de MongoDB
        const mensajes = await Mensaje.find({ conversacionId: id, visible: true }).sort({ fechaCreacion: 1 });
        
        if (!mensajes || mensajes.length === 0) {
            return res.json({ status: 'success', data: [] });
        }

        // 3. Extraer IDs únicos de MySQL que están presentes en este chat
        const idsEmisores = [...new Set(mensajes.map(m => m.emisorId))];

        // 4. Consultar los datos de identidad relacional en Azure MySQL
        const [usuariosSQL] = await mysqlPool.query(
            "SELECT IdUsuario_PK, NombresU, ApellidosU FROM Usuarios WHERE IdUsuario_PK IN (?)",
            [idsEmisores]
        );

        // 5. Mapear los resultados de SQL en un diccionario plano de JS
        const nombresMap = {};
        usuariosSQL.forEach(u => {
            nombresMap[u.IdUsuario_PK] = `${u.NombresU} ${u.ApellidosU}`;
        });

        // 6. Inyectar la propiedad dinamica nombreEmisor a cada documento NoSQL
        const mensajesEnriquecidos = mensajes.map(m => {
            const msgObj = m.toObject(); // Forzamos conversión a objeto manipulable
            msgObj.nombreEmisor = nombresMap[m.emisorId] || `Usuario ${m.emisorId}`;
            return msgObj;
        });

        res.json({ 
            status: 'success', 
            data: mensajesEnriquecidos 
        });

    } catch (error) {
        console.error('Error al obtener mensajes por conversación:', error);
        res.status(500).json({ mensaje: 'Error al obtener mensajes', error: error.message });
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

        if (mensajeOriginal.emisorId !== usuario.id_usuario) {
            return res.status(403).json({ mensaje: 'No puedes editar este mensaje' });
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
        res.json({ mensaje: 'Mensaje editado', datos: mensajeActualizado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al editar', error: error.message });
    }
};

// ELIMINAR MENSAJE
const eliminarMensaje = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = req.usuario;

        const mensaje = await Mensaje.findById(id);
        if (!mensaje) {
            return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
        }

        if (mensaje.emisorId !== usuario.id_usuario && usuario.rol !== 1) {
            return res.status(403).json({ mensaje: 'No tienes permiso para eliminar este mensaje' });
        }

        mensaje.eliminado = true;
        mensaje.visible = false;
        await mensaje.save();

        res.json({ mensaje: 'Mensaje eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar', error: error.message });
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
            return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
        }

        if (mensaje.emisorId === usuario.id_usuario) {
            return res.status(400).json({ mensaje: 'No puedes reportar tu propio mensaje' });
        }

        mensaje.reportes.push({
            reportadoPor: usuario.id_usuario,
            motivo,
            fecha: new Date()
        });

        await mensaje.save();
        res.json({ mensaje: 'Mensaje reportado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al reportar', error: error.message });
    }
};

module.exports = {
    enviarMensaje,
    editarMensaje,
    eliminarMensaje,
    reportarMensaje,
    obtenerMensajesPorConversacion
};