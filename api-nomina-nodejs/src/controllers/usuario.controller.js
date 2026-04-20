const Usuario = require('../models/usuario.models');

class UsuarioController {//Clase que se usa para la ruta.

    static async obtenerTodos(req, res) {
        try {
            const usuarios = await Usuario.ObtenerUsuarios();
            res.json(usuarios);
        }
        catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener los usuarios",
                error: error.message
            });
        }
    }

    static async obtenerPorIdC(req, res) {
        try {
            const { id } = req.params;
            const usuarios = await Usuario.obtenerPorId(id);
            res.json(usuarios);
        }
        catch (error) {
            res.status(500).json({
                mensaje: "El usuario no se encuentra registrado",
                error: error.message
            });
        }
    }

    static async crearUsuarioC(req, res){
        try {
            const nuevoUsuario = await Usuario.crearUsuario(req.body)

            res.status(201).json({
                mensaje: "Usuario creado exitosamente",
                data: nuevoUsuario
            });
        }
        catch(error){
            res.status(500).json({
                mensaje: "Error al crear el usuario",
                error: error.message
            });
        }
    }

    static async ModificarUsuario(req, res){
        try {
            const { id } = req.params;
            const actualizado = await Usuario.ActualizarUsuario(id, req.body);
            if (actualizado) {
                res.json({
                    mensaje: "Usuario actualizado exitosamente",
                    data: actualizado
                });
            } else {
                res.status(404).json({
                    mensaje: "Usuario no encontrado"
                });
            }
        }
        catch(error){
            res.status(500).json({
                mensaje: "Error al actualizar el usuario",
                error: error.message
            });
        }
    }     

    static async EliminarUsuarioC(req, res){
        try {
            const { id } = req.params;
            const eliminado = await Usuario.EliminarUsuario(id);
            if (eliminado) {
                res.json({
                    mensaje: "Usuario eliminado exitosamente"
                });
            } else {
                res.status(404).json({
                    mensaje: "Usuario no encontrado"
                });
            }
        }
        catch(error){
            res.status(500).json({
                mensaje: "Error al eliminar el usuario",
                error: error.message
            });
        }
    }

    static async IniciarSesion(req,res){
        try {
            const { Correo, contrasena } = req.body;
            const usuario = await Usuario.InicioSesion({ Correo });
            if(!usuario){
                return res.status(401).json({
                    mensaje: "El correo no se encontro"
                });
            }
            else{
                if (usuario.Contraseña === contrasena) {
                return res.json({
                    mensaje: "Inicio de sesión exitoso",
                    data: usuario
                    });
                } 
                else {
                return res.status(401).json({
                    mensaje: "Correo o contraseña incorrectos"
                    });
                }
            }
        }
        catch(error){
            return res.status(500).json({
                mensaje: "Error al iniciar sesión",
                error: error.message
            });
        }
    }

    static async ModificarContraseña(req, res){
        try {
            const { correo, contraseñaNueva } = req.body;

            if (!correo || !contraseñaNueva) {
                return res.status(400).json({
                    mensaje: "Correo y contraseña son requeridos"
                });
            } else {
                const usuario = await Usuario.obtenerPorCorreo(correo );
                if (!usuario) {
                    return res.status(404).json({
                        mensaje: "Usuario no encontrado"
                    });
                } else {
                    const contraseñaActualizada = await Usuario.ActualizarContraseña(correo, contraseñaNueva);
                    return res.json({
                        mensaje: "Contraseña actualizada exitosamente",
                        data: contraseñaActualizada
                    });
                }
            }
        }
        catch(error){
            return res.status(500).json({
                mensaje: "Error al actualizar la contraseña",
                error: error.message
            });
        }
    }     
}

module.exports = UsuarioController;