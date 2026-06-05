const { mysqlPool } = require('../config/mysql');
const Conversacion = require('./conversacion.models');

class Usuario_Clase {
    // Obtener todas las inscripciones
    static async obtenerTodos() {
        const [rows] = await mysqlPool.query(
            `SELECT uc.IdUsCla, uc.IdUsuario_FK, uc.Codigo_FK,
                    u.NombresU, u.ApellidosU, u.Correo,
                    c.NombreC, c.IdClase
             FROM Usuario_Clase uc
             JOIN Usuarios u ON uc.IdUsuario_FK = u.IdUsuario_PK
             JOIN Clases c ON uc.Codigo_FK = c.Codigo_PK`
        );

        return rows;
    }

    // Obtener inscripción por ID 
    static async obtenerPorId(id) {
        const [rows] = await mysqlPool.query(
            `SELECT uc.IdUsCla, uc.IdUsuario_FK, uc.Codigo_FK,
                    u.NombresU, u.ApellidosU, u.Correo,
                    c.NombreC, c.IdClase
             FROM Usuario_Clase uc
             JOIN Usuarios u ON uc.IdUsuario_FK = u.IdUsuario_PK
             JOIN Clases c ON uc.Codigo_FK = c.Codigo_PK
             WHERE uc.IdUsCla = ?`,
            [id]
        );
        return rows[0];
    }

    // Obtener inscripción por ID del usuario
    static async obtenerClasesPorUsuario(id) {
        const [rows] = await mysqlPool.query(
            `SELECT Codigo_FK
             FROM Usuario_Clase 
             WHERE IdUsuario_FK = ?`,
            [id]
        );
        return rows;
    }

    // Verificar si ya existe una inscripción para el mismo alumno y clase
    static async existeInscripcion(idUsuario, codigoClase) {
        const [rows] = await mysqlPool.query(
            "SELECT 1 FROM Usuario_Clase WHERE IdUsuario_FK = ? AND Codigo_FK = ? LIMIT 1",
            [idUsuario, codigoClase]
        );
        return rows.length > 0;
    }

    // Crear nueva inscripción
    static async crear(data) {
        const { IdUsuario_FK, Codigo_FK } = data;
        const [result] = await mysqlPool.query(
            "INSERT INTO Usuario_Clase (IdUsuario_FK, Codigo_FK) VALUES (?, ?)",
            [IdUsuario_FK, Codigo_FK]
        );
        // Intentar agregar al participante en la conversación grupal de la clase (si existe)
        (async () => {
            try {
                const conversacion = await Conversacion.findOne({ claseId: Codigo_FK, activa: true });
                if (conversacion) {
                    const idNum = Number(IdUsuario_FK);
                    if (!conversacion.participantes.includes(idNum)) {
                        conversacion.participantes.push(idNum);
                        await conversacion.save();
                    }
                }
            } catch (err) {
                console.error('Error al sincronizar participante a conversación:', err.message);
            }
        })();

        return { IdUsCla: result.insertId, IdUsuario_FK, Codigo_FK };
    }

    // Eliminar inscripción
    static async eliminar(id) {
        const [result] = await mysqlPool.query(
            "DELETE FROM Usuario_Clase WHERE IdUsCla = ?",
            [id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar alumno de clase por usuario y código de clase
    static async desasignarAlumnoClase(IdUsuario_FK, codigoClase) {
        const [result] = await mysqlPool.query(
            "DELETE FROM Usuario_Clase WHERE IdUsuario_FK = ? AND Codigo_FK = ?",
            [IdUsuario_FK, codigoClase]
        );
        // Si se eliminó, también quitar de la conversación grupal
        (async () => {
            try {
                if (result.affectedRows > 0) {
                    const conversacion = await Conversacion.findOne({ claseId: codigoClase, activa: true });
                    if (conversacion) {
                        const idNum = Number(IdUsuario_FK);
                        conversacion.participantes = conversacion.participantes.filter(p => p !== idNum);
                        // También remover de administradores.designados si estaba allí
                        conversacion.administradores.designados = (conversacion.administradores.designados || []).filter(p => p !== idNum);
                        await conversacion.save();
                    }
                }
            } catch (err) {
                console.error('Error al sincronizar remoción de participante en conversación:', err.message);
            }
        })();

        return result.affectedRows > 0;
    }




    // CONSULTAS ADICIONALES QUE NO ESTAN EN LA TABLA DE MODELOS //

    // Obtener inscripción con más detalles
    static async obtenerInscripcionConDetalles(id) {
        const [rows] = await mysqlPool.query(
            `SELECT uc.IdUsCla, uc.IdUsuario_FK, uc.Codigo_FK,
                    u.NombresU, u.ApellidosU, u.IdRol_FK,
                    c.NombreC
             FROM Usuario_Clase uc
             JOIN Usuarios u ON uc.IdUsuario_FK = u.IdUsuario_PK
             JOIN Clases c ON uc.Codigo_FK = c.Codigo_PK
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
                 SELECT IdUsuario_FK FROM Usuario_Clase WHERE Codigo_FK = ?
             )`,
            [idClase]
        );
        return rows.map(row => row.IdUsuario_PK);
    }

    // Obtener alumnos inscritos en una clase
    static async obtenerAlumnosClase(codigoClase) {
        const [rows] = await mysqlPool.query(
            `SELECT u.IdUsuario_PK AS IdAlumno,
                    CONCAT(u.ApellidosU, ' ', u.NombresU) AS NombreCompleto,
                    u.Correo
             FROM Usuario_Clase uc
             JOIN Usuarios u ON uc.IdUsuario_FK = u.IdUsuario_PK
             WHERE uc.Codigo_FK = ? AND u.IdRol_FK = 2`,
            [codigoClase]
        );
        return rows;
    }
}

module.exports = Usuario_Clase;