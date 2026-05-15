const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.models');
const { mysqlPool } = require('../config/mysql');

class AuthController{
    static async login(req, res) {
        try {
            const { Correo, Contrasena } = req.body;

            if (!Correo || !Contrasena) {
                return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
            }

            const usuario = await Usuario.obtenerPorCorreo(Correo);

            if (!usuario) {
                return res.status(401).json({ mensaje: 'Credenciales inválidas' });
            }

            let passwordValido = false;

            // IMPORTANTE: Verifica que tu base de datos devuelva "Contraseña" con C mayúscula y ñ
            const passEnBD = usuario.Contraseña || usuario.contrasena; 

            if (passEnBD.startsWith('$2')) {
                passwordValido = await bcrypt.compare(Contrasena, passEnBD);
            } else {
                if (Contrasena === passEnBD) {
                    passwordValido = true;
                    // Intentar migrar a bcrypt de forma asíncrona pero sin bloquear el login
                    bcrypt.hash(Contrasena, 10).then(hash => {
                        mysqlPool.query("UPDATE Usuarios SET Contraseña = ? WHERE IdUsuario_PK = ?", [hash, usuario.IdUsuario_PK]);
                    }).catch(err => console.error("Error migrando pass:", err));
                }
            }   

            if (!passwordValido) {
                return res.status(401).json({ mensaje: 'Credenciales inválidas' });
            }

            // Si llegó aquí, generamos el token
            const token = jwt.sign(
                {
                    id_usuario: usuario.IdUsuario_PK,
                    nombre_usuario: usuario.NombresU,
                    Correo: usuario.Correo,
                    rol: usuario.IdRol_FK
                },
                process.env.JWT_SECRET || 'secreto_temporal',
                { expiresIn: '1h' }
            );

            // RESPUESTA FINAL (Asegúrate de que no haya nada después de esto)
            return res.json({
                mensaje: 'Login correcto',
                token,
                usuario: {
                    id_usuario: usuario.IdUsuario_PK,
                    nombre_usuario: usuario.NombresU,
                    Correo: usuario.Correo,
                    rol: usuario.IdRol_FK
                }
            });

        } catch (error) {
            console.error('Error en login:', error);
            if (!res.headersSent) {
                return res.status(500).json({ mensaje: 'Error en el servidor' });
            }
        }
    }

    static async perfil(req,res){
        try{
            const usuario = await Usuario.findById(req.usuario.id_usuario).select('-password_hash');

            if(!usuario){
                return res.status(404).json({
                    mensaje: 'Usuario no encontrado'
                });
            }
            res.json({
                usuario
            });
        }
        catch(error){
            console.error('Error al obtener perfil:', error);
            res.status(500).json({
                mensaje: 'Error en el servidor'
            });
        }
    }

    static async RestablecerPasswordPorCorreo(req, res) {
    try {
        const { correo, nuevaPassword } = req.body;
        const usuario = await Usuario.obtenerPorCorreo(correo);

        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        // Encriptamos la nueva contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(nuevaPassword, salt);

        // Llamamos a tu método de modelo que SOLO actualiza la clave
        const resultado = await Usuario.ActualizarContraseña(correo, hashedPassword);

        if (resultado.affectedRows > 0) {
            return res.json({ mensaje: "Contraseña actualizada con éxito" });
        }
        
        res.status(500).json({ mensaje: "No se pudo actualizar" });
        } catch (error) {
            res.status(500).json({ mensaje: "Error", error: error.message });
        }
    }
}

module.exports = AuthController;