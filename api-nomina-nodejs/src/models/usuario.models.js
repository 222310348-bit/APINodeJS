const { mysqlPool } = require('../config/mysql');

class Usuario {
    //Obtener todos los usuarios
    static async ObtenerUsuarios() {
        const [rows] = await mysqlPool.query(
            "SELECT IdUsuario_PK,NombresU,ApellidosU,Correo,Contraseña,IdRol_FK FROM Usuarios");

        return rows;
    }

    //Obtener usuario por ID
    static async obtenerPorId(id) {
        const [rows] = await mysqlPool.query(
            "SELECT IdUsuario_PK,NombresU,ApellidosU,Correo,Contraseña,IdRol_FK FROM Usuarios WHERE IdUsuario_PK = ?",[id]
        );
        return rows[0];
    }

    //Obtener usuario por correo
    static async obtenerPorCorreo( Correo) {
        const [rows] = await mysqlPool.query(
            "SELECT IdUsuario_PK,NombresU,ApellidosU,Correo,Contraseña,IdRol_FK FROM Usuarios WHERE Correo = ?",[Correo]
        );
        return rows[0];
    }

    //Crear nuevo usuario
    static async crearUsuario(data) {
        const { NombresU, ApellidosU, Correo, Contraseña, IdRol_FK } = data;
        const [result] = await mysqlPool.query(
            "INSERT INTO Usuarios (NombresU, ApellidosU, Correo, Contraseña, IdRol_FK) VALUES (?, ?, ?, ?, ?)",
            [NombresU, ApellidosU, Correo, Contraseña, IdRol_FK]
        );
        return { IdUsuario_PK: result.insertId, NombresU, ApellidosU, Correo, Contraseña, IdRol_FK };
    }

    //Actualizar usuario
    static async ActualizarUsuario(id, data) {
        let campos = "NombresU = ?, ApellidosU = ?, Correo = ?, IdRol_FK = ?";
        let valores = [data.NombresU, data.ApellidosU, data.Correo, data.IdRol_FK];

        // Si el objeto trae Contraseña, la agregamos al SQL
        if (data.Contraseña) {
            campos += ", Contraseña = ?";
            valores.push(data.Contraseña);
        }

        valores.push(id); // Al final para el WHERE

        const sql = `UPDATE Usuarios SET ${campos} WHERE IdUsuario_PK = ?`;
        const [result] = await mysqlPool.query(sql, valores);
        return result;
    }

    static async eliminarUsuarioCompleto(id) {
        await mysqlPool.query("DELETE FROM Usuario_Clase WHERE IdUsuario_FK = ?", [id]);

        const [result] = await mysqlPool.query("DELETE FROM Usuarios WHERE IdUsuario_PK = ?", [id]);
    
        return result;
    }

    //Inicio de sesion
    static async InicioSesion(data) {
        const { Correo } = data;
        const [rows] = await mysqlPool.query(
            "SELECT IdUsuario_PK,NombresU,ApellidosU,Correo,Contraseña,IdRol_FK FROM Usuarios WHERE Correo = ?",[Correo]
        );
        return rows[0];
    }

    //Cambiar Contraseña
    static async ActualizarContraseña(correo, contraseñaNueva) {
        const [result] = await mysqlPool.query(
            "UPDATE Usuarios SET Contraseña = ? WHERE Correo = ?",
            [contraseñaNueva, correo]
        );
        return result;
    }
}

module.exports = Usuario;
