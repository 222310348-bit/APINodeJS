const Conversacion = require('../models/conversacion.models');
const Usuario_Clase = require('../models/usuario_clase.models');
const Usuario = require('../models/usuario.models');

const crearConversacion = async (req, res) => {
    try {
        const usuario = req.usuario;

        const { 
            nombreConversacion, 
            claseId, 
            esDirect, 
            participanteId,
            participanteCorreo,
            participantes: participantesBody
        } = req.body;

        //  VALIDACIONES
        if (esDirect) {
            let participanteFinal = participanteId;
            if (!participanteFinal && participanteCorreo) {
                const usuarioEncontrado = await Usuario.obtenerPorCorreo(participanteCorreo);
                if (!usuarioEncontrado) {
                    return res.status(404).json({
                        mensaje: 'No existe un usuario con ese correo'
                    });
                }
                participanteFinal = usuarioEncontrado.IdUsuario_PK;
            }

            if (!participanteFinal) {
                return res.status(400).json({
                    mensaje: 'Debes enviar el id o el correo del otro participante'
                });
            }

            if (participanteFinal === usuario.id_usuario) {
                return res.status(400).json({
                    mensaje: 'No puedes crear una conversación contigo mismo'
                });
            }

            //  EVITAR DUPLICADOS
            const existente = await Conversacion.findOne({
                esDirect: true,
                participantes: {
                    $all: [usuario.id_usuario, participanteFinal]
                }
            });

            if (existente) {
                return res.status(400).json({
                    mensaje: 'Ya existe una conversación entre estos usuarios'
                });
            }

            req.body.participanteId = participanteFinal;
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
                participanteFinal
            ];
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

        const conversacionesEnriquecidas = await Promise.all(conversaciones.map(async (conv) => {
            if (conv.esDirect && Array.isArray(conv.participantes)) {
                const otroId = conv.participantes.find((participante) => participante !== Number(idUsuario));
                if (otroId) {
                    const otroUsuario = await Usuario.obtenerPorId(otroId);
                    return {
                        ...conv.toObject(),
                        otroParticipante: otroUsuario ? {
                            id: otroUsuario.IdUsuario_PK,
                            nombres: otroUsuario.NombresU,
                            apellidos: otroUsuario.ApellidosU,
                            correo: otroUsuario.Correo
                        } : null
                    };
                }
            }
            return conv;
        }));

        res.json({
            data: conversacionesEnriquecidas
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener conversaciones',
            error: error.message
        });
    }
};

const obtenerConversacionPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const idUsuario = req.usuario.id_usuario;

        const conversacion = await Conversacion.findById(id);
        if (!conversacion || !conversacion.activa) {
            return res.status(404).json({ mensaje: 'Conversación no encontrada' });
        }

        if (!conversacion.participantes.includes(Number(idUsuario))) {
            return res.status(403).json({ mensaje: 'No perteneces a esta conversación' });
        }

        let enriched = conversacion.toObject();
        if (enriched.esDirect && Array.isArray(enriched.participantes)) {
            const otroId = enriched.participantes.find((participante) => participante !== Number(idUsuario));
            if (otroId) {
                const otroUsuario = await Usuario.obtenerPorId(otroId);
                enriched.otroParticipante = otroUsuario ? {
                    id: otroUsuario.IdUsuario_PK,
                    nombres: otroUsuario.NombresU,
                    apellidos: otroUsuario.ApellidosU,
                    correo: otroUsuario.Correo
                } : null;
            }
        }

        res.json({ data: enriched });
    } catch (error) {
        console.error('Error al obtener conversación por id:', error);
        res.status(500).json({ mensaje: 'Error al obtener conversación', error: error.message });
    }
};

const obtenerConversacionesPorClase = async (req, res) => {
    try {
        const { codigo } = req.params; // "78uH6X"
        const idUsuario = req.usuario.id_usuario;

        // 1. Mantenemos tu validación original en MySQL (Lo que NotebookLM borró sin querer)
        const estaInscrito = await Usuario_Clase.existeInscripcion(idUsuario, codigo);
        if (!estaInscrito) {
            return res.status(403).json({ mensaje: 'No tienes acceso a las conversaciones de esta clase' });
        }

        // 2. Agregamos los logs de depuración para ver qué pasa en la consola del Backend
        console.log("--- Depuración de Búsqueda por Clase ---");
        console.log("Código de clase solicitado (URL):", codigo);
        console.log("Buscando en MongoDB un documento con claseId igual a:", codigo);

        // 3. Tu consulta limpia a MongoDB
        const conversaciones = await Conversacion.find({ claseId: codigo, activa: true });
        
        console.log("Resultado real devuelto por MongoDB:", conversaciones);

        res.json(conversaciones);
    } catch (error) {
        console.error('Error al obtener conversaciones por clase:', error);
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
    obtenerMisConversaciones,
    obtenerConversacionPorId,
    obtenerConversacionesPorClase
};