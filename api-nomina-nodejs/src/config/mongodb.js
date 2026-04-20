const mongoose = require('mongoose');
require('dotenv').config();

async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conexion exitosa a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    throw error;  
  }
}

module.exports = connectMongoDB;