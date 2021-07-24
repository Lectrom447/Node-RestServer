const { request, response } = require("express")


const esAdminRole = (req = request, res = response, next) => {
    if(!req.usuario){
        return res.status(500).json({
            msg: 'Se requiere validar el token antes de validar el role'
        })
    }

    const {role, nombre} = req.usuario;

    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es administrador`
        })
    }
    

    next();
}

const tieneRole = (...roles) => {
    return (req = request, res = response, next) => {
        if(!req.usuario){
            return res.status(500).json({
                msg: 'Se requiere validar el token antes de validar el role'
            })
        }

        if(!roles.includes(req.usuario.role)){
           return res.status(401).json({
               msg: `El servico requiere uno de los siguientes roles: ${roles}`
           }) 
        }
        next()
    }
}
module.exports = {
    esAdminRole,
    tieneRole
}