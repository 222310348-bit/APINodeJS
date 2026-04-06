const express = require('express');
const cors = require('cors');

// Rutas a las tablas de la BD
const usuarioRoutes = require('./routes/usuario.routes');
const rolesRoutes = require('./routes/roles.routes');
//const conversacionRoutes = require('./routes/conversacion.routes');
//const mensajesRoutes = require('./routes/mensajes.routes');
const clasesRoutes = require('./routes/clases.routes');
const asistenciaRoutes = require('./routes/asistencia.routes');
const usuarioClaseRoutes = require('./routes/usuario_clase.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de nomina hibrida funcionando corecctamente'

    });
});

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/clases', clasesRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/inscripciones', usuarioClaseRoutes);
//app.use('/api/conversacion', conversacionRoutes);
//app.use('/api/mensajes', mensajesRoutes);

module.exports = app;
