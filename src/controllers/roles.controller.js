const Roles = require('../models/roles.models');

class RolesController {//Clase que se usa para la ruta.
    //Obtener todos los roles
    static async obtenerRoles(req, res) {
        try {
            const roles = await Roles.obtenerTodos();
            res.json(roles);
        }
        catch (error) {
            res.status(500).json({
                mensaje: "Error al obtener los roles",
                error: error.message
            });
        }  
    }
    //Insertar rol
    static async InsertarRol(req, res) {
        try {
            const nuevoRol = await Roles.CrearRol(req.body);
            res.status(201).json({
                mensaje: "El rol se creo de manera exitosa",
                data: nuevoRol
            });
        }
        catch (error) {
            res.status(500).json({
                mensaje: "Error al crear el rol",
                error: error.message
            });
        }  
    }

    //Eliminar Rol
    static async EliminaRol(req,res) {
        try{
            const { id } = req.params;
            const eliminado = await Roles.EliminarRol(id);
            if(eliminado){
                res.json({
                    mensaje: "Rol eliminado de manera correcta"
                });
            } else{
                res.status(404).json({
                    mensaje: "El id ingresado del rol no se encontro"
                })
            }
        }
        catch (error) {
            res.status(500).json({
                mensaje: "Error al eliminar el rol",
                error: error.message
            });
        }
    }
}

module.exports = RolesController;