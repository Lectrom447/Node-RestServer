const { request, response } = require("express");
const { Categoria } = require("../models");


obtenerCategorias = async(req= request, res=response) => {
    const {limit = 5, from = 0} = req.query;
    const query = {status:true}

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(from))
            .limit(Number(limit))
            .populate('usuario', 'nombre')
    ])

    res.json({
        total,
        categorias
    })
}

const crearCategoria = async(req= request, res=response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre})

    if(categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data)

    await categoria.save();

    res.status(201).json(categoria);
}


obtenerCategoria = async(req= request, res=response) => {
    const {id} = req.params;

    const categoria = await Categoria.findById(id)
                            .populate('usuario','nombre')

    res.json(categoria)

}

actualizarCategoria = async(req= request, res=response) =>{
    const {id} = req.params;
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre})

    if(categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }
    try {
        const categoria = await Categoria.findByIdAndUpdate(id,data,{new:true})

        res.status(200).json({
            msg: 'post API - Controlador',
            categoria
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Contacte al administrador'});
    }
}


borrarCategoria = async(req= request, res=response) => {
    const {id} = req.params;
    try {
        const categoria = await Categoria.findByIdAndUpdate(id, {status: false});
        res.json(categoria);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Contactese con el administrador'
        })
    }
}


module.exports ={
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}