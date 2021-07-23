const Role = require('../models/role');
const Usuario = require('../models/usuario');

const isValidRole = async (role = '') => {
    const existeRole = await Role.findOne({role});
    if (!existeRole) {
        throw new Error(`El role "${role}" no esta registrado en la DB.`)
    }
}


const emailExist = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo})
    if (existeEmail) {
        throw new Error('El correo ya esta registrado')
    }
}

const existUserById = async (id = '') => {
    const existUser = await Usuario.findById(id)
    if (!existUser) {
        throw new Error(`El id "${id}" no existe.`)
    }
}



module.exports = {
    isValidRole,
    emailExist,
    existUserById
}