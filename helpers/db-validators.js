const { Usuario, Categoria, Producto } = require('../models');
const Role = require('../models/role');

   

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

const existCategoryById = async (id = '') => {
    const existCategory = await Categoria.findById(id)
    if (!existCategory) {
        throw new Error(`El id "${id}" no existe.`)
    }
}

const existProductoById = async (id = '') => {
    const existProducto = await Producto.findById(id)
    if (!existProducto) {
        throw new Error(`El id "${id}" no existe.`)
    }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

  const incluida = colecciones.includes(coleccion);

  if(!incluida){
      throw new Error(`La coleccion ${coleccion} no es permitida.`)
  }

  return true;

}



module.exports = {
    isValidRole,
    emailExist,
    existUserById,
    existCategoryById,
    existProductoById,
    coleccionesPermitidas
}