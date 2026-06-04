const mongoose = require('mongoose');
require('dotenv').config();

async function connectMongoDB() {
  try {
    // Agregamos opciones de optimización para redes virtuales
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Si un nodo no responde en 5 segundos, pasa al siguiente
      family: 4 // Fuerza al driver a usar IPv4 para evitar conflictos internos de red
    });
    console.log('Conexion exitosa a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    throw error;  
  }
}

module.exports = connectMongoDB;