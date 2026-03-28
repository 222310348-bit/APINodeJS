const express = require('express');
const cors = require('cors');

// Incluir rutas a las tablas de la BD
const usuarioRoutes = require('./routes/usuario.routes')
//
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de EducatIO híbrida funcionando correctamente'
    });
});

// Incluir app.use de las rutas de cada tabla 
app.use('/api/usuarios', usuarioRoutes);
//

module.exports = app;