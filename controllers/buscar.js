const { request, response } = require("express");
const { isValidObjectId } = require("mongoose");
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuario = async (termino = '', res = response) => {
    const esMongoID = isValidObjectId(termino);

    if(esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            resuts: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const usuarios = await Usuario.find({
        $or:[{nombre: regex}, {correo:regex}],
        $and: [{status:true}]
    })

    return res.json({
        resuts: usuarios
    })
}

const buscarCategoria = async (termino = '', res = response) => {
    const esMongoID = isValidObjectId(termino);

    if(esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            resuts: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const categorias = await Categoria.find({nombre: regex, status:true})

    return res.json({
        resuts: categorias
    })
}
const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = isValidObjectId(termino);

    if(esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        return res.json({
            resuts: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const productos = await Producto.find({nombre: regex, status:true}).populate('categoria','nombre')

    return res.json({
        resuts: productos
    })
}

const buscar = (req= request, res= response) => {

    const {coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion.toLowerCase() )){
        return res.status(400).json({
            msg: `las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }
    switch (coleccion) {
        case 'usuarios':
            buscarUsuario(termino,res);
        break;
        case 'categorias':
            buscarCategoria(termino,res)
        break;
        case 'productos':
            buscarProductos(termino, res)
        break;

        default:
            res.status(500).json({
                msg: 'Caso no implementado'
            })
    }


}


module.exports = {
    buscar
}