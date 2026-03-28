// Redactar controlador

const Usuario = require('../models/usuario.models');

class UsuarioController {

    static async obtenerUsuarios(req, res) {
        try {
            const usuarios = await Usuario.obtenerTodos();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener usuarios",
                error: error.message
            });
        }    
    }

    static async obtenerUsuario(req, res) {
        try {
            const { id } = req.params;
            const usuario = await Usuario.obtenerPorId(id);

            if (!usuario) {
                return res.status(404).json({ mensaje: "Usuario no encontrado"});
            }

            res.json(usuario);
        } catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener usuario",
                error: error.message
            });
        }
    }


    static async crearUsuario(req, res) {
        try {
            
            const nuevoUsuario = await Usuario.crear(req.body);


            res.status(201).json({
                mensaje: "Usuario creado correctamente",
                data: nuevoUsuario
            });

        } catch (error) {
            res.status(500).json({
                mensaje: "Error al crear usuario",
                error: error.message
            });
        }
    }


    static async actualizarUsuario(req, res) {
        try {
            const { id } = req.params;
            const actualizado = await Usuario.actualizar(id, req.body);

            res.status(201).json({
                mensaje: "Usuario actualizado correctamente",
                data: actualizado
            });

        } catch (error) {
            res.status(500).json({
                mensaje: "Error al actualizar usuario",
                error: error.message
            });
        }
    }



    static async eliminarUsuario(req, res) {
        try {
            const { id } = req.params;
            const eliminado = await Usuario.eliminar(id);

            res.status(201).json({ 
                mensaje: "Usuario eliminado correctamente",
                data: eliminado
            });

        } catch (error) {
            res.status(500).json({
                mensaje: "Error al eliminar el usuario",
                error: error.message
            });
        }
    }

}

module.exports = UsuarioController;