const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    try{
        const authHeader = req.headers.authHeader;

        if(!authHeader){
            return res.status(401).json({
                mensaje: 'Token no proporcionado'
            });
        }

        if(!authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                mensaje: 'Formato de token inválido'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded
        next();
    }
    catch(error){
        return res.status(401).json({
            mensaje: 'Token inválido o expirado'
        });
    }
}

function verificarRol(...rolesPermitidos){
    return (req, res, next) => {
        if(!req.usuario){
            return res.status(401).json({
                mensaje: 'Usuario no autenticado'
            });
        }

        if(!rolesPermitidos.includes(req.usuario.rol)){
            return res.status(403).json({
                mensaje: 'No tienes permisos para acceder a este recurso'
            });
        }
        next();
    }
}

module.exports = {
    verificarToken,
    verificarRol
};
