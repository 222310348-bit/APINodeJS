const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');

class AuthController{
    static async login(req,res){
        try{
            const { correo, password} = req.body;

            if (!correo || !password) {
                return res.status(400).json({
                    mensaje: 'correo y password son obligatorios'
                });
            }

            const usuario = await Usuario.findOne({ correo });

            if (!usuario){
                return res.status(401).json({
                    mensaje: 'Credenciales inválidas'
                });
            }

            if(!usuario.activo){
                return res.status(403).json({
                    mensaje:'Usuario inactivo'
                });
            }

            const passwordValido = await bcrypt.compare(password, usuario.password_hash);

            if(!passwordValido){
                return res.status(401).json({
                    mensaje: 'Credenciales inválidas'
                });
            }

            const token = jwt.sign(
                {
                    id_usuario: usuario.id_usuario,
                    nombre_usuario: usuario.nombre,
                    correo: usuario.correo,
                    rol: usuario.rol
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '1h'}
            );

            res.json({
                mensaje:'Login correcto',
                token,
                usuario: {
                    id_usuario: usuario.id_usuario,
                    nombre_usuario: usuario.nombre,
                    correo: usuario.correo,
                    rol: usuario.rol
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
}
