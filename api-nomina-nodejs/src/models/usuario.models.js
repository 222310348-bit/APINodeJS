// 1) redactar funcion para obtener datos de la tabla
// incluir funciones de CRUD necesarias

// 2) Enlistar y diseñar consultas que se haran de cada tabla del proyecto (Ninjamod)

const {mysqlPool } = require('../config/mysql');

class Usuario {
    //Obtener todos los usuarios
    static async obtenerTodos() {
        const [rows] = await mysqlPool.query(`
            SELECT
                IdUsuario_PK,
                NombresU,
                ApellidosU,
                Correo,
                Contraseña,
                IdRol_FK
            FROM Usuarios
            ORDER BY IdUsuario_PK ASC
            `);

        return rows;
    }




    // obtener un usuario por ID
    static async obtenerPorId(id) {
        const [rows] = await mysqlPool.query(`
            SELECT
                IdUsuario_PK,
                NombresU,
                ApellidosU,
                Correo,
                Contraseña,
                IdRol_FK
            FROM Usuarios
            WHERE IdUsuario_PK = ?
            `, [id]);

        return rows[0];
    }


    // Crear Usuario
    static async crear(data) {
        const {
            NombresU,
            ApellidosU,
            Correo,
            Contraseña,
            IdRol_FK
        } = data;

        const [result] = await mysqlPool.query(`
            INSERT INTO Usuarios(
                NombresU,
                ApellidosU,
                Correo,
                Contraseña,
                IdRol_FK
            )
            VALUES (?, ?, ?, ?, ?)
        `, [NombresU, ApellidosU, Correo, Contraseña, IdRol_FK]);

        return {
            IdUsuario_PK: result.insertId,
            NombresU,
            ApellidosU,
            Correo,
            Contraseña,
            IdRol_FK
        };
    }


    // Actualizar usuario
    static async actualizar(id, data) {
        const {
            NombresU,
            ApellidosU,
            Correo,
            Contraseña,
            IdRol_FK
        } = data;

        const [result] = await mysqlPool.query(`
            UPDATE Usuarios
            SET
                NombresU = ?
                ApellidosU = ?
                Correo = ?
                Contraseña = ?
                IdRol_FK = ?
            WHERE IdUsuario_PK = ?
        `, [NombresU, ApellidosU, Correo, Contraseña, IdRol_FK]);

        return result.affectedRows > 0;

    }


    // Eliminar usuario
    static async eliminar(id) {
        const [result] = await mysqlPool.query(`
            DELETE FROM Usuarios 
            WHERE 
                IdUsuario_PK = ?
        `, [id]);

        return result;

    }


}

module.exports = Usuario;