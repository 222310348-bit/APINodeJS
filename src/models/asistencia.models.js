const { mysqlPool } = require('../config/mysql');

class Asistencia {
    static normalizarEstado(estado) {
        if (estado == null) return null;
        const valor = String(estado).trim();
        if (!valor) return null;

        const map = {
            P: 'A',
            A: 'A',
            F: 'F',
            J: 'J',
            PRESENTE: 'A',
            AUSENTE: 'F',
            FALTA: 'F',
            JUSTIFICADO: 'J',
            Presente: 'A',
            Ausente: 'F',
            Falta: 'F',
            Justificado: 'J',
            Asistencia: 'A'
        };

        const clave = valor.toUpperCase();
        return map[clave] || valor;
    }

    //Obtener todos las asistencias
    static async obtenerTodos() {
        const [rows] = await mysqlPool.query(
            "SELECT IdAsistencia_PK,Fecha,Hora,Estado,Codigo_FK,IdUsuario_FK FROM Asistencia");

        return rows;
    }

    //Obtener asistencias por ID del alumno
    static async obtenerAsitenciaAlumno(id) {
        const [rows] = await mysqlPool.query(
            "SELECT IdAsistencia_PK,Fecha,Hora,Estado,Codigo_FK,IdUsuario_FK FROM Asistencia WHERE IdUsuario_FK = ?",[id]);

        return rows;
    }

    //Obtener asistencias por ID de la clase
    static async obtenerAsitenciaClase(ids) {
    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await mysqlPool.query(
        `SELECT a.IdAsistencia_PK, a.Fecha, a.Hora, a.Estado, a.Codigo_FK, a.IdUsuario_FK,
                u.NombresU AS NombreAlumno, u.ApellidosU AS ApellidoAlumno, u.Correo
         FROM Asistencia a
         JOIN Usuarios u ON a.IdUsuario_FK = u.IdUsuario_PK
         WHERE a.Codigo_FK IN (${placeholders})
         ORDER BY a.Fecha DESC, a.Hora DESC`, ids);
        
        return rows;
    }

    static async obtenerAsistenciaAlumnoPorClase(idUsuario, CodigoClase) {
    const [rows] = await mysqlPool.query(
        `SELECT a.IdAsistencia_PK, a.Fecha, a.Hora, a.Estado, a.Codigo_FK, a.IdUsuario_FK,
                u.NombresU AS NombreAlumno, u.ApellidosU AS ApellidoAlumno, u.Correo
         FROM Asistencia a
         JOIN Usuarios u ON a.IdUsuario_FK = u.IdUsuario_PK
         WHERE a.IdUsuario_FK = ? AND a.Codigo_FK = ?
         ORDER BY a.Fecha DESC, a.Hora DESC`,
        [idUsuario, CodigoClase]);

        return rows;
    }

    //Ingresar asistencia
    static async IngresarAsistencia(data) {
        const {Fecha,Hora,Estado,Codigo_FK,IdUsuario_FK} = data;
        const estadoNormalizado = Asistencia.normalizarEstado(Estado) || Estado;
        const [result] = await mysqlPool.query(
        "INSERT INTO Asistencia (Fecha,Hora,Estado,Codigo_FK,IdUsuario_FK) VALUES (?, ?, ?, ?, ?)",
        [Fecha,Hora,estadoNormalizado,Codigo_FK,IdUsuario_FK]);
        return { IdAsistencia_PK: result.insertId, Fecha,Hora: Hora, Estado: estadoNormalizado, Codigo_FK, IdUsuario_FK };
    }

    //Editar Asistencia
    static async EditarAsistencia(id, data){
        const {Fecha,Hora,Estado,Codigo_FK,IdUsuario_FK} = data;
        const estadoNormalizado = Asistencia.normalizarEstado(Estado) || Estado;
        const [result] = await mysqlPool.query(
            "UPDATE Asistencia SET Fecha = ?,Hora = ?,Estado = ?,Codigo_FK = ?,IdUsuario_FK = ? WHERE IdAsistencia_PK = ?",
            [Fecha,Hora,estadoNormalizado,Codigo_FK,IdUsuario_FK,id]
        )
        return result.affectedRows > 0;
    }

    //Editar estado de la Asistencia
    static async EditarEstadoAsistencia(id, data){
        const {Estado} = data;
        const estadoNormalizado = Asistencia.normalizarEstado(Estado) || Estado;
        const [result] = await mysqlPool.query(
            "UPDATE Asistencia SET Estado = ? WHERE IdAsistencia_PK = ?",
            [estadoNormalizado, id]
        )
        return result.affectedRows > 0;
    }

    //Eliminar Asistencia
    static async EliminarAsistencia(id){
        const [result] = await mysqlPool.query(
            "DELETE FROM Asistencia WHERE IdAsistencia_PK = ?",[id]
        );
        return result.affectedRows > 0;
    }
}


module.exports = Asistencia;
