const express = require('express');
const cors = require('cors');

// Incluir rutas a las tablas de la BD
const usuarioRoutes = require('./routes/usuario.routes')
const clasesRoutes = require('./routes/clases.routes');
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
app.use('/api/clases', clasesRoutes);
//

module.exports = app;
// prueba git
// prueba git 2
// prueba git 3
// preuab git 4