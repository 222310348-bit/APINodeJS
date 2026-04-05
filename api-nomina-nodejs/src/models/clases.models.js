const { mysqlPool } = require('../config/mysql');

class Clases {
    //Obtener todas las clases
    static async obtenerTodos() {
        const [rows] = await mysqlPool.query(
            "SELECT IdClase_PK, NombreC, Codigo FROM Clases");

        return rows;
    }

    //Obtener clase por nombre
    static async obtenerPorNombre(nombre) {
        const [rows] = await mysqlPool.query(
            "SELECT IdClase_PK, NombreC, Codigo FROM Clases WHERE NombreC = ?", [nombre]
        );
        return rows[0];
    }

    //Crear nueva clase
    static async crear(data) {
        const { NombreC, Codigo } = data;
        const [result] = await mysqlPool.query(
            "INSERT INTO Clases (NombreC, Codigo) VALUES (?, ?)",
            [NombreC, Codigo]
        );
        return { IdClase_PK: result.insertId, NombreC, Codigo }
    }

    //Eliminar  clase
    static async eliminar(id) {
        const [result] = await mysqlPool.query(
            "DELETE FROM Clases WHERE IdClase_PK = ?",
            [id]
        );
        return result.affectedRows > 0;
    }
    
}

module.exports = Clases;
