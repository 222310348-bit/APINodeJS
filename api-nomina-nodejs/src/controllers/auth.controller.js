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
            const usuario = await Usuario.obtenerPorId(req.usuario.id_usuario);

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

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(nuevaPassword, salt);

            const resultado = await Usuario.ActualizarContraseña(correo, hashedPassword);

            if (resultado.affectedRows > 0) {
                return res.json({ mensaje: "Contraseña actualizada con éxito" });
            }

            res.status(500).json({ mensaje: "No se pudo actualizar" });
        } catch (error) {
            res.status(500).json({ mensaje: "Error", error: error.message });
        }
    }

    static async cambiarPassword(req, res) {
        try {
            const { contrasenaActual, nuevaContrasena } = req.body;
            const idUsuario = req.usuario.id_usuario;

            if (!contrasenaActual || !nuevaContrasena) {
                return res.status(400).json({ mensaje: 'La contraseña actual y la nueva son obligatorias.' });
            }

            const usuario = await Usuario.obtenerPorId(idUsuario);
            if (!usuario) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
            }

            const passEnBD = usuario.Contraseña || usuario.contrasena || '';
            const coincide = passEnBD.startsWith('$2')
                ? await bcrypt.compare(contrasenaActual, passEnBD)
                : contrasenaActual === passEnBD;

            if (!coincide) {
                return res.status(401).json({ mensaje: 'La contraseña actual es incorrecta.' });
            }

            if (nuevaContrasena.length < 12) {
                return res.status(400).json({ mensaje: 'La nueva contraseña debe tener al menos 12 caracteres.' });
            }

            const tieneMayuscula = /[A-Z]/.test(nuevaContrasena);
            const tieneMinuscula = /[a-z]/.test(nuevaContrasena);
            const tieneNumero = /[0-9]/.test(nuevaContrasena);
            const tieneEspecial = /[^A-Za-z0-9]/.test(nuevaContrasena);
            const tieneEspacio = /\s/.test(nuevaContrasena);

            if (!tieneMayuscula || !tieneMinuscula || !tieneNumero || !tieneEspecial || tieneEspacio) {
                return res.status(400).json({
                    mensaje: 'La nueva contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales, sin espacios.'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(nuevaContrasena, salt);
            const resultado = await Usuario.ActualizarContraseña(usuario.Correo, hashedPassword);

            if (resultado.affectedRows > 0) {
                return res.json({ mensaje: 'Contraseña actualizada correctamente.' });
            }

            return res.status(500).json({ mensaje: 'No se pudo actualizar la contraseña.' });
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            return res.status(500).json({ mensaje: 'Error al cambiar la contraseña.', error: error.message });
        }
    }
}

module.exports = AuthController;