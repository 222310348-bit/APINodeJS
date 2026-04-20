// Etapa 7, Paso 7.1
// Repetiremos el ciclo MVC para los Mensajes. Un mensaje necesita existir dentro de una conversación válida.

const Mensaje = require('../models/mensaje.model');

// FUNCIÓN: enviarMensaje
const enviarMensaje = async (req, res) => {
    try {
        const { conversacionId, emisorId, contenido } = req.body;

        // Creamos el nuevo mensaje usando el molde
        const nuevoMensaje = new Mensaje({
            conversacionId,
            emisorId,
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

// 2. EDITAR MENSAJE (Con lógica de Historial)
const editarMensaje = async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevoContenido } = req.body;

        // Paso A: Buscamos el mensaje tal como está en la base de datos AHORA mismo
        const mensajeOriginal = await Mensaje.findById(id);

        if (!mensajeOriginal) {
            return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
        }

        // Paso B: Preparamos la versión antigua para guardarla en el historial
        const versionAnterior = {
            contenidoAnterior: mensajeOriginal.contenido,
            fechaEdicion: new Date(),
            numeroEdicion: mensajeOriginal.totalEdiciones + 1
        };

        // Paso C: Actualizamos los campos en memoria (el Chef modifica el platillo)
        mensajeOriginal.contenido = nuevoContenido;
        mensajeOriginal.editado = true;
        mensajeOriginal.totalEdiciones += 1;
        mensajeOriginal.historialEdiciones.push(versionAnterior); // Guardamos la copia vieja

        // Paso D: Guardamos los cambios finales en Mongo
        const mensajeActualizado = await mensajeOriginal.save();

        res.status(200).json({ mensaje: 'Mensaje editado con éxito', datos: mensajeActualizado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al editar', error: error.message });
    }
};

// 3. ELIMINAR MENSAJE (Soft Delete / Borrado Lógico)
const eliminarMensaje = async (req, res) => {
    try {
        const { id } = req.params;

        // En lugar de usar .remove() o .delete(), solo actualizamos banderas (flags)
        const mensajeEliminado = await Mensaje.findByIdAndUpdate(
            id,
            { eliminado: true, visible: false },
            { returnDocument: 'after' }
        );

        if (!mensajeEliminado) {
            return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
        }

        res.status(200).json({ mensaje: 'Mensaje eliminado lógicamente', datos: mensajeEliminado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar', error: error.message });
    }
};

// 4. REPORTAR MENSAJE
const reportarMensaje = async (req, res) => {
    try {
        const { id } = req.params;
        const { reportadoPor, motivo } = req.body;

        // Creamos el objeto del reporte
        const nuevoReporte = {
            reportadoPor,
            motivo,
            fecha: new Date()
        };

        // Empujamos ($push) el reporte al array de reportes de ese mensaje
        const mensajeReportado = await Mensaje.findByIdAndUpdate(
            id,
            { $push: { reportes: nuevoReporte } },
            { returnDocument: 'after' }
        );

        if (!mensajeReportado) {
            return res.status(404).json({ mensaje: 'Mensaje no encontrado' });
        }

        res.status(200).json({ mensaje: 'Reporte enviado al sistema', datos: mensajeReportado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al reportar', error: error.message });
    }
};

// Exportamos nuestro menú completo de Mensajes
module.exports = {
    enviarMensaje,
    editarMensaje,
    eliminarMensaje,
    reportarMensaje
};