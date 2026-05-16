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

    // Obtener todas las clases para el Dashboard (con nombre de docente)
    static async obtenerClasesPorUsuarioTipoAdmin() {
        const [rows] = await mysqlPool.query(
            `SELECT c.Codigo_PK, c.NombreC, 
                (SELECT CONCAT(u.NombresU, ' ', u.ApellidosU) 
                FROM Usuarios u 
                JOIN Usuario_Clase uc2 ON u.IdUsuario_PK = uc2.IdUsuario_FK 
                WHERE uc2.Codigo_FK = c.Codigo_PK 
                AND u.IdRol_FK = 3) AS NombreCompletoDocente
            FROM Clases c
            JOIN Usuario_Clase uc ON c.Codigo_PK = uc.Codigo_FK
            Group by (c.Codigo_PK);`
        );
        return rows;
    }

    static async obtenerClasesPorUsuario(idUsuario) {
        const [rows] = await mysqlPool.query(
            `SELECT c.Codigo_PK, c.NombreC,
                (SELECT CONCAT(u2.NombresU, ' ', u2.ApellidosU)
                FROM Usuarios u2
                JOIN Usuario_Clase uc2 ON u2.IdUsuario_PK = uc2.IdUsuario_FK
                WHERE uc2.Codigo_FK = c.Codigo_PK 
                AND u2.IdRol_FK = 3 LIMIT 1) AS NombreCompletoDocente
            FROM Clases c
            JOIN Usuario_Clase uc ON c.Codigo_PK = uc.Codigo_FK
            WHERE uc.IdUsuario_FK = ?`,[idUsuario]
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

    static async crearClaseCompleta(nombreC, idClase, idDocente) {
        // Generar código aleatorio (ejemplo: 4X2Y9Z)
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let codigo = '';
        for (let i = 0; i < 6; i++) {
            codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }   

        // Usamos la conexión para asegurar que si algo falla, no se cree nada (opcional: transactions)
        // 1. Crear la clase
        await mysqlPool.query(
            "INSERT INTO Clases (Codigo_PK, NombreC, IdClase) VALUES (?, ?, ?)",
            [codigo, nombreC, idClase]
        );

        // 2. Vincular automáticamente al creador (Docente/Admin) en la tabla pivote
        await mysqlPool.query(
            "INSERT INTO Usuario_Clase (IdUsuario_FK, Codigo_FK) VALUES (?, ?)",
            [idDocente, codigo]
        );

        return codigo; // Retornamos el código por si queremos mostrarlo en un mensaje
    }

    static async actualizarClaseCompleta(codigo, nombreC, idClase, idDocente) {
        await mysqlPool.query(
            "UPDATE Clases SET NombreC = ?, IdClase = ? WHERE Codigo_PK = ?",
            [nombreC, idClase, codigo]
        );

        // 2. Borra el docente anterior y pon el nuevo (Evita errores de duplicados)
        await mysqlPool.query("DELETE FROM Usuario_Clase WHERE Codigo_FK = ?", [codigo]);
        await mysqlPool.query(
            "INSERT INTO Usuario_Clase (IdUsuario_FK, Codigo_FK) VALUES (?, ?)",
            [idDocente, codigo]
        );
    }

    static async eliminarClaseCompleta(codigo) {
        // IMPORTANTE: El orden de eliminación es vital
        // Primero la tabla "hija" (la que tiene las llaves foráneas)
        await mysqlPool.query("DELETE FROM Usuario_Clase WHERE Codigo_FK = ?", [codigo]);
    
        // Luego la tabla "padre" (donde está el código original)
        const [result] = await mysqlPool.query("DELETE FROM Clases WHERE Codigo_PK = ?", [codigo]);
    
        return result;
    }   
}

module.exports = Clases;