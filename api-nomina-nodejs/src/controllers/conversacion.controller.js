// Etapa 5, Paso 5.1
// Empezaremos creando las funciones básicas para administrar las conversaciones.

// Importamos el Modelo (El molde que creamos en la Etapa 4)
const Conversacion = require('../models/conversacion.model');

// =========================================================
// FUNCIÓN: crearConversacion
// Objetivo: Guardar una nueva conversación en la Base de Datos
// =========================================================
const crearConversacion = async (req, res) => {
    try {
        // 1. Extraemos los datos que nos envía el usuario (o la app de MySQL)
        // 'req.body' es el cuerpo de la petición. Es como el sobre que trae la información.
        const { 
            nombreConversacion, 
            claseId, 
            esDirect, 
            participantes, 
            administradorPrincipal 
        } = req.body;

        // 2. Preparamos el objeto usando el molde (Modelo)
        // Fíjate cómo estructuramos los datos para que coincidan con nuestro Schema
        const nuevaConversacion = new Conversacion({
            nombreConversacion,
            claseId,
            esDirect,
            participantes,
            administradores: {
                principal: administradorPrincipal,
                designados: [] // Empieza vacío
            }
        });

        // 3. Guardamos en la base de datos de verdad (Esto toma tiempo, por eso el 'await')
        const conversacionGuardada = await nuevaConversacion.save();

        // 4. Si todo salió bien, le respondemos al usuario con un mensaje de éxito (Status 201 = Creado)
        res.status(201).json({
            mensaje: 'Conversación creada exitosamente',
            conversacion: conversacionGuardada
        });

    } catch (error) {
        // 5. Si algo falla (ej. el usuario olvidó mandar el nombreConversacion), caemos aquí
        console.error('Error al crear conversación:', error);
        // Respondemos con un error del servidor (Status 500)
        res.status(500).json({
            mensaje: 'Error al intentar crear la conversación',
            error: error.message
        });
    }
};

// 2. AGREGAR PARTICIPANTE
const agregarParticipante = async (req, res) => {
    try {
        // 'req.params.id' captura el ID de la URL (ej. /api/conversaciones/ID_AQUI/participantes)
        const { id } = req.params; 
        const { IDalumno } = req.body; // El ID del alumno viene en el cuerpo (JSON)

        // findByIdAndUpdate busca el documento y lo modifica.
        // $push es un comando de Mongo que significa "Empuja este valor dentro de este array"
        const conversacionActualizada = await Conversacion.findByIdAndUpdate(
            id,
            { $push: { participantes: IDalumno } },
            { returnDocument: 'after' } // Obliga a Mongoose a devolver el documento YA actualizado
        );

        if (!conversacionActualizada) {
            return res.status(404).json({ mensaje: 'Conversación no encontrada' });
        }

        res.status(200).json({ mensaje: 'Participante agregado', conversacion: conversacionActualizada });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al agregar participante', error: error.message });
    }
};

// 3. AGREGAR ADMINISTRADOR
const agregarAdministrador = async (req, res) => {
    try {
        const { id } = req.params;
        const { IDalumno } = req.body; 

        const conversacionActualizada = await Conversacion.findByIdAndUpdate(
            id,
            // Entramos al objeto anidado usando punto ("administradores.designados")
            { $push: { "administradores.designados": IDalumno } },
            { returnDocument: 'after' } 
        );

        if (!conversacionActualizada) {
            return res.status(404).json({ mensaje: 'Conversación no encontrada' });
        }

        res.status(200).json({ mensaje: 'Administrador agregado', conversacion: conversacionActualizada });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al agregar administrador', error: error.message });
    }
};

// 4. DESACTIVAR CONVERSACIÓN
const desactivarConversacion = async (req, res) => {
    try {
        const { id } = req.params;

        const conversacionActualizada = await Conversacion.findByIdAndUpdate(
            id,
            { activa: false }, // Simplemente cambiamos el campo a false
            { returnDocument: 'after' } 
        );

        if (!conversacionActualizada) {
            return res.status(404).json({ mensaje: 'Conversación no encontrada' });
        }

        res.status(200).json({ mensaje: 'Conversación desactivada', conversacion: conversacionActualizada });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al desactivar', error: error.message });
    }
};

// Exportamos la función para poder usarla más adelante

// Exportamos todas las funciones (El menú completo del Chef)
module.exports = {
    crearConversacion,
    agregarParticipante,
    agregarAdministrador,
    desactivarConversacion
};