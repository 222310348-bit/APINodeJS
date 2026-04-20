// Etapa 4, Paso 4.1
// Este modelo representa los canales de chat (grupales o de clase).

const mongoose = require('mongoose');

// Definimos la estructura exacta (el esquema) de la colección
const conversacionSchema = new mongoose.Schema({
    nombreConversacion: {
        type: String,
        required: true // Es obligatorio
    },
    claseId: {
        type: String, // String porque en el ejemplo es "GIB-2504"
        default: null // Puede ser null si es un chat directo
    },
    esDirect: {
        type: Boolean,
        default: false
    },
    participantes: [{
        type: Number // Array de números porque son FKs de MySQL (IdUsuario_PK)
    }],
    administradores: {
        principal: {
            type: Number,
            required: true // Obligatorio, FK de MySQL
        },
        designados: [{
            type: Number // Array de IDs de alumnos designados como admins
        }]
    },
    activa: {
        type: Boolean,
        default: true
    }
}, {
    // CONFIGURACIÓN DE TIEMPO AUTOMÁTICA
    // Mongoose manejará las fechas por nosotros. 
    // Renombramos 'createdAt' a 'fechaCreacion' y 'updatedAt' a 'fechaActualizacion'.
    timestamps: { 
        createdAt: 'fechaCreacion', 
        updatedAt: 'fechaActualizacion' 
    },
    // IMPORTANTE: Le decimos a Mongoose que NO pluralice en inglés.
    // Queremos que la colección se llame exactamente 'conversaciones'
    collection: 'conversaciones'
});

// Compilamos el modelo y lo exportamos. 
// Mongoose automáticamente pluralizará y creará la colección "conversaciones"
module.exports = mongoose.model('Conversacion', conversacionSchema);
