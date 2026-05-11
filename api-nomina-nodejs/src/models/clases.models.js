const { mysqlPool } = require('../config/mysql');

class Clases {
    //Obtener todas las clases
    static async obtenerTodos() {
        const [rows] = await mysqlPool.query(
            "SELECT Codigo_PK, NombreC, IdClase FROM Clases");

        return rows;
    }

    //Obtener clase por ID
    static async obtenerPorId(id) {
        const [rows] = await mysqlPool.query(
            "SELECT Codigo_PK, NombreC, IdClase FROM Clases WHERE Codigo_PK = ?", [id]
        );
        return rows[0];
    }

    //Obtener clase por nombre
    static async obtenerPorNombre(nombre) {
        const [rows] = await mysqlPool.query(
            "SELECT Codigo_PK, NombreC, IdClase FROM Clases WHERE NombreC = ?", [nombre]
        );
        return rows[0];
    }

    //Obtener clases por usuario
    static async obtenerClasesPorUsuario(idUsuario) {
    const [rows] = await mysqlPool.query(
        `SELECT c.Codigo_PK, c.NombreC, c.IdClase
         FROM Clases c
         JOIN Usuario_Clase uc ON c.Codigo_PK = uc.Codigo_FK
         WHERE uc.IdUsuario_FK = ?`,
        [idUsuario]
    );
    return rows;
}

    //Crear nueva clase
    static async crear(data) {
        const { Codigo_PK, NombreC, IdClase } = data;
        const [result] = await mysqlPool.query(
            "INSERT INTO Clases (Codigo_PK, NombreC, IdClase) VALUES (?, ?, ?)",
            [Codigo_PK, NombreC, IdClase]
        );
        return { Codigo_PK, NombreC, IdClase }
    }

    //Eliminar  clase
    static async eliminar(id) {
        const [result] = await mysqlPool.query(
            "DELETE FROM Clases WHERE Codigo_PK = ?",
            [id]
        );
        return result.affectedRows > 0;
    }   
}

module.exports = Clases;