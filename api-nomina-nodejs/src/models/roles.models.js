const { mysqlPool } = require('../config/mysql');

class Roles {
    //Obtener todos los roles
    static async obtenerTodos() {
        const [rows] = await mysqlPool.query(
            "SELECT IdRol_PK,TipoRol FROM Roles");

        return rows;
    }

    //Insertar rol 
    static async CrearRol(data) {
        const {TipoRol} = data;
        const [result] = await mysqlPool.query(
            "INSERT INTO Roles (TipoRol) VALUES (?)",
            [TipoRol]
        );
        return { IdRol_PK: result.insertId, TipoRol };
    }

    //Elimiar rol
    static async EliminarRol(id) {
        const [result]= await mysqlPool.query(
            "DELETE FROM Roles WHERE IdRol_PK = ?",
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Roles;
