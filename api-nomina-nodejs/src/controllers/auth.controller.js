const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.models');
const { mysqlPool } = require('../config/mysql');

class AuthController{
    static async login(req,res){
        try{
            const { Correo, Contrasena} = req.body;

            if (!Correo || !Contrasena) {
                return res.status(400).json({
                    mensaje: 'Correo y contraseña son obligatorios'
                });
            }

            const usuario = await Usuario.obtenerPorCorreo(Correo);

            if (!usuario){
                return res.status(401).json({
                    mensaje: 'Credenciales inválidas'
                });
            }

            let passwordValido = false;

            if (usuario.Contraseña.startsWith('$2')) {
                passwordValido = await bcrypt.compare(Contrasena, usuario.Contraseña);
            } else {
            if (Contrasena === usuario.Contraseña) {
                passwordValido = true;

                // 🔥 migración automática
                const hash = await bcrypt.hash(Contrasena, 10);

                await mysqlPool.query(
                "UPDATE Usuarios SET Contraseña = ? WHERE IdUsuario_PK = ?",
                [hash, usuario.IdUsuario_PK]);
            }
        }

            const token = jwt.sign(
                {
                    id_usuario: usuario.IdUsuario_PK,
                    nombre_usuario: usuario.NombresU,
                    Correo: usuario.Correo,
                    rol: usuario.IdRol_FK
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '1h'}
            );

            res.json({
                mensaje:'Login correcto',
                token,
                usuario: {
                    id_usuario: usuario.IdUsuario_PK,
                    nombre_usuario: usuario.NombresU,
                    Correo: usuario.Correo,
                    rol: usuario.IdRol_FK
                }
            });
        }
        catch(error){
            console.error('Error en login:', error);
            res.status(500).json({
                mensaje: 'Error en el servidor'
            });
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
}

module.exports = AuthController;