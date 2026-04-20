const Conversacion = require('../models/conversacion.models');

const crearConversacion = async (req, res) => {
    try {
        const usuario = req.usuario;

        const { 
            nombreConversacion, 
            claseId, 
            esDirect, 
            participanteId,
            participantes: participantesBody
        } = req.body;

        //  VALIDACIONES
        if (esDirect) {
            if (!participanteId) {
                return res.status(400).json({
                    mensaje: 'Debes enviar el id del otro participante'
                });
            }

            if (participanteId === usuario.id_usuario) {
                return res.status(400).json({
                    mensaje: 'No puedes crear una conversación contigo mismo'
                });
            }

            //  EVITAR DUPLICADOS
            const existente = await Conversacion.findOne({
                esDirect: true,
                participantes: {
                    $all: [usuario.id_usuario, participanteId]
                }
            });

            if (existente) {
                return res.status(400).json({
                    mensaje: 'Ya existe una conversación entre estos usuarios'
                });
            }
        }

        if (usuario.rol === 2 && !esDirect) {
            return res.status(403).json({
                mensaje: 'Un alumno solo puede crear conversaciones directas'
            });
        }

        if (!esDirect && !claseId) {
            return res.status(400).json({
                mensaje: 'Las conversaciones grupales deben tener claseId'
            });
        }

        //  PARTICIPANTES AUTOMÁTICOS
        let participantes = [];

        if (esDirect) {
            participantes = [
            usuario.id_usuario,
            participanteId];
        } 
        else {
            if (!Array.isArray(participantesBody) || participantesBody.length === 0) {
                return res.status(400).json({
                    mensaje: 'Debes enviar participantes para la conversación grupal'
                });
            }

            //  Agregar al creador + los demás
            participantes = [
                usuario.id_usuario,
                ...participantesBody
            ];

            // Eliminar duplicados
            participantes = [...new Set(participantes)];
        }

        const nuevaConversacion = new Conversacion({
            nombreConversacion,
            claseId: esDirect ? null : claseId,
            esDirect,
            participantes,
            administradores: {
                principal: usuario.id_usuario,
                designados: []
            }
        });

        const conversacionGuardada = await nuevaConversacion.save();

        res.status(201).json({
            mensaje: 'Conversación creada exitosamente',
            conversacion: conversacionGuardada
        });

    } catch (error) {
        console.error('Error al crear conversación:', error);
        res.status(500).json({
            mensaje: 'Error al intentar crear la conversación',
            error: error.message
        });
    }
};

//  AGREGAR PARTICIPANTE
const agregarParticipante = async (req, res) => {
    try {
        const { id } = req.params;
        const { idUsuario } = req.body;

        const conversacion = await Conversacion.findById(id);

        if (!conversacion) {
            return res.status(404).json({ mensaje: 'Conversación no encontrada' });
        }

        if (conversacion.participantes.includes(idUsuario)) {
            return res.status(400).json({ mensaje: 'El usuario ya está en la conversación' });
        }

        conversacion.participantes.push(idUsuario);
        await conversacion.save();

        res.json({
            mensaje: 'Participante agregado',
            conversacion
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al agregar participante',
            error: error.message
        });
    }
};


//  AGREGAR ADMINISTRADOR
const agregarAdministrador = async (req, res) => {
    try {
        const { id } = req.params;
        const { idUsuario } = req.body;

        const conversacion = await Conversacion.findById(id);

        if (!conversacion) {
            return res.status(404).json({ mensaje: 'Conversación no encontrada' });
        }

        if (!conversacion.participantes.includes(idUsuario)) {
            return res.status(400).json({
                mensaje: 'El usuario debe ser participante para ser administrador'
            });
        }

        conversacion.administradores.designados.push(idUsuario);
        await conversacion.save();

        res.json({
            mensaje: 'Administrador agregado',
            conversacion
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al agregar administrador',
            error: error.message
        });
    }
};


//  DESACTIVAR CONVERSACIÓN
const desactivarConversacion = async (req, res) => {
    try {
        const { id } = req.params;

        const conversacion = await Conversacion.findByIdAndUpdate(
            id,
            { activa: false },
            { new: true }
        );

        if (!conversacion) {
            return res.status(404).json({ mensaje: 'Conversación no encontrada' });
        }

        res.json({
            mensaje: 'Conversación desactivada',
            conversacion
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al desactivar',
            error: error.message
        });
    }
};


//  OBTENER CONVERSACIONES DEL USUARIO
const obtenerMisConversaciones = async (req, res) => {
    try {
        const idUsuario = req.usuario.id_usuario;

        const conversaciones = await Conversacion.find({
            participantes: idUsuario,
            activa: true
        });

        res.json({
            data: conversaciones
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener conversaciones',
            error: error.message
        });
    }
};

module.exports = {
    crearConversacion,
    agregarParticipante,
    agregarAdministrador,
    desactivarConversacion,
    obtenerMisConversaciones
};