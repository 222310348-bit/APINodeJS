const mongoose = require('mongoose');

const conversacionSchema =  new mongoose.Schema(
    {
        nombreConversacion: { type: String, required: true 
        },
        claseId: { type: String, required: true 
        },
        esDirect: { type: Boolean, required: true
        },
        participantes: { type: Array, required: true
        },
        administradores: {
            principal: { type: String, required: true 
            },
            designados: { type: Array, required: true 
            }
        },
        fechaCreacion: { type: Date, required: true
        },
        activa: { type: Boolean, required: true
        }

    }
)

module.exports = Conversacion;