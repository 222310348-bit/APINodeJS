// Etapa 4, Paso 4.2
// Este modelo representa cada mensaje enviado, incluyendo su lógica de historial de ediciones.

const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
    conversacionId: {
        // Aquí usamos un tipo especial que significa "Este campo es el _id de otro documento de Mongo"
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversacion', // Hace referencia al modelo que creamos arriba
        required: true
    },
    emisorId: {
        type: Number, // FK hacia Usuarios de MySQL
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    // --- ESTADO DEL MENSAJE ---
    editado: {
        type: Boolean,
        default: false
    },
    totalEdiciones: {
        type: Number,
        default: 0
    },
    historialEdiciones: [{
        // Mongoose permite crear objetos embebidos así:
        contenidoAnterior: String,
        fechaEdicion: { type: Date, default: Date.now },
        numeroEdicion: Number
    }],
    eliminado: {
        type: Boolean,
        default: false
    },
    visible: {
        type: Boolean,
        default: true
    },
    reportes: [{
        reportadoPor: Number, // Id de MySQL
        motivo: String,
        fecha: { type: Date, default: Date.now }
    }]
}, {
    // CONFIGURACIÓN DE TIEMPO AUTOMÁTICA
    // fechaCreacion será el momento en que se envió el mensaje originalmente.
    // fechaActualizacion será el momento de la última edición o cambio de estado.
    timestamps: { 
        createdAt: 'fechaCreacion', 
        updatedAt: 'fechaActualizacion' 
    },
    // Forzamos el nombre correcto en español para la base de datos
    collection: 'mensajes'
});

module.exports = mongoose.model('Mensaje', mensajeSchema);
