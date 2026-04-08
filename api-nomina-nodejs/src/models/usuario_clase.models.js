const { mysqlPool } = require('../config/mysql');

class Usuario_Clase {
    // Obtener todas las inscripciones
    static async obtenerTodos() {
        const [rows] = await mysqlPool.query(
            `SELECT uc.IdUsCla, uc.IdUsuario_FK, uc.IdClase_FK,
                    u.NombresU, u.ApellidosU, u.Correo,
                    c.NombreC, c.Codigo
             FROM Usuario_Clase uc
             JOIN Usuarios u ON uc.IdUsuario_FK = u.IdUsuario_PK
             JOIN Clases c ON uc.IdClase_FK = c.IdClase_PK`
        );

        return rows;
    }

    // Obtener inscripción por ID 
    static async obtenerPorId(id) {
        const [rows] = await mysqlPool.query(
            `SELECT uc.IdUsCla, uc.IdUsuario_FK, uc.IdClase_FK,
                    u.NombresU, u.ApellidosU, u.Correo,
                    c.NombreC, c.Codigo
             FROM Usuario_Clase uc
             JOIN Usuarios u ON uc.IdUsuario_FK = u.IdUsuario_PK
             JOIN Clases c ON uc.IdClase_FK = c.IdClase_PK
             WHERE uc.IdUsCla = ?`,
            [id]
        );
        return rows[0];
    }

    // Obtener inscripción por ID del usuario
    static async obtenerClasesPorUsuario(id) {
        const [rows] = await mysqlPool.query(
            `SELECT IdClase_FK
             FROM Usuario_Clase 
             WHERE IdUsuario_FK = ?`,
            [id]
        );
        return rows;
    }

    // Verificar si ya existe una inscripción para el mismo alumno y clase
    static async existeInscripcion(idUsuario, idClase) {
        const [rows] = await mysqlPool.query(
            "SELECT 1 FROM Usuario_Clase WHERE IdUsuario_FK = ? AND IdClase_FK = ? LIMIT 1",
            [idUsuario, idClase]
        );
        return rows.length > 0;
    }

    // Crear nueva inscripción
    static async crear(data) {
        const { IdUsuario_FK, IdClase_FK } = data;
        const [result] = await mysqlPool.query(
            "INSERT INTO Usuario_Clase (IdUsuario_FK, IdClase_FK) VALUES (?, ?)",
            [IdUsuario_FK, IdClase_FK]
        );
        return { IdUsCla: result.insertId, IdUsuario_FK, IdClase_FK };
    }

    // Eliminar inscripción
    static async eliminar(id) {
        const [result] = await mysqlPool.query(
            "DELETE FROM Usuario_Clase WHERE IdUsCla = ?",
            [id]
        );
        return result.affectedRows > 0;
    }




    // CONSULTAS ADICIONALES QUE NO ESTAN EN LA TABLA DE MODELOS //

    // Obtener inscripción con más detalles
    static async obtenerInscripcionConDetalles(id) {
        const [rows] = await mysqlPool.query(
            `SELECT uc.IdUsCla, uc.IdUsuario_FK, uc.IdClase_FK,
                    u.NombresU, u.ApellidosU, u.IdRol_FK,
                    c.NombreC
             FROM Usuario_Clase uc
             JOIN Usuarios u ON uc.IdUsuario_FK = u.IdUsuario_PK
             JOIN Clases c ON uc.IdClase_FK = c.IdClase_PK
             WHERE uc.IdUsCla = ?`,
            [id]
        );
        return rows[0];
    }

    // Obtener docentes de una clase
    static async obtenerDocentesClase(idClase) {
        const [rows] = await mysqlPool.query(
            `SELECT DISTINCT u.IdUsuario_PK
             FROM Usuarios u
             WHERE u.IdRol_FK = 3 AND u.IdUsuario_PK IN (
                 SELECT IdUsuario_FK FROM Usuario_Clase WHERE IdClase_FK = ?
             )`,
            [idClase]
        );
        return rows.map(row => row.IdUsuario_PK);
    }
}

module.exports = Usuario_Clase;