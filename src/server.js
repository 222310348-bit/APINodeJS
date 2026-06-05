require('dotenv').config();
const app = require('./app');
const connectMongoDB = require('./config/mongodb');
const { connectMySQL } = require('./config/mysql');
const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        await connectMongoDB();
        await connectMySQL();
        app.listen(PORT, () => {
            console.log("Servidor ejecutandose en puerto " + PORT);
        });
    } 
    catch (error) {
        console.error('Error al iniciar el servidor:');
        console.error(error);
    }
}

iniciarServidor();