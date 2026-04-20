const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(cors());

//Importar Rutas a las tablas de la BD
//MYSQL
const usuarioRoutes = require('./routes/usuario.routes');
const rolesRoutes = require('./routes/roles.routes');
const clasesRoutes = require('./routes/clases.routes');
const asistenciaRoutes = require('./routes/asistencia.routes');
const usuarioClaseRoutes = require('./routes/usuario_clase.routes');
//MONGO
const conversacionRoutes = require('./routes/conversacion.routes');
const mensajeRoutes = require('./routes/mensaje.routes');





app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de nomina hibrida funcionando corecctamente'

    });
});

//MYSQL
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/clases', clasesRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/inscripciones', usuarioClaseRoutes);
//MONGO
app.use('/api/conversaciones', conversacionRoutes);
app.use('/api/mensajes', mensajeRoutes);


// Exportamos 'app' para que el archivo server.js pueda usarlo.
module.exports = app;
