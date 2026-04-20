const { mysqlPool } = require('../config/mysql');

class Asistencia {
    //Obtener todos las asistencias
    static async obtenerTodos() {
        const [rows] = await mysqlPool.query(
            "SELECT IdAsistencia_PK,Fecha,Hora,Estado,IdClase_FK,IdUsuario_FK FROM Asistencia");

        return rows;
    }

    //Obtener asistencias por ID del alumno
    static async obtenerAsitenciaAlumno(id) {
        const [rows] = await mysqlPool.query(
            "SELECT IdAsistencia_PK,Fecha,Hora,Estado,IdClase_FK,IdUsuario_FK FROM Asistencia WHERE IdUsuario_FK = ?",[id]);

        return rows;
    }

    //Obtener asistencias por ID de la clase
    static async obtenerAsitenciaClase(ids) {
        const clases = ids.map(id => `'${id}'`).join(','); // Convertir cada ID a string y unirlos con comas
        const [rows] = await mysqlPool.query(
        `SELECT IdAsistencia_PK,Fecha,Hora,Estado,IdClase_FK,IdUsuario_FK FROM Asistencia 
        WHERE IdClase_FK IN (${clases})`);

        return rows;
    }

    //Ingresar asistencia
    static async IngresarAsistencia(data) {
        const {Fecha,Hora,Estado,IdClase_FK,IdUsuario_FK} = data;
        const [result] = await mysqlPool.query(
        "INSERT INTO Asistencia (Fecha,Hora,Estado,IdClase_FK,IdUsuario_FK) VALUES (?, ?, ?, ?, ?)",
        [Fecha,Hora,Estado,IdClase_FK,IdUsuario_FK]);
        return { IdAsistencia_PK: result.insertId, Fecha,Hora,Estado,IdClase_FK,IdUsuario_FK };
    }

    //Editar Asistencia
    static async EditarAsistencia(id, data){
        const {Fecha,Hora,Estado,IdClase_FK,IdUsuario_FK} = data;
        const [result] = await mysqlPool.query(
            "UPDATE Asistencia SET Fecha = ?,Hora = ?,Estado = ?,IdClase_FK = ?,IdUsuario_FK = ? WHERE IdAsistencia_PK = ?",
            [Fecha,Hora,Estado,IdClase_FK,IdUsuario_FK,id]
        )
        return result.affectedRows > 0;
    }

    //Editar estado de la Asistencia
    static async EditarEstadoAsistencia(id, data){
        const {Estado} = data;
        const [result] = await mysqlPool.query(
            "UPDATE Asistencia SET Estado = ? WHERE IdAsistencia_PK = ?",
            [Estado, id]
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
