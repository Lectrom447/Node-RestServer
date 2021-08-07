const { request, response } = require("express");
const { Producto, Categoria } = require("../models");


const obtenerProductos = async(req=request, res=response) => {
    const {limit = 5, from = 0} = req.query;
    const query = {status:true}

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(from))
            .limit(Number(limit))
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ])

    res.json({
        total,
        productos
    })
}


const crearProducto = async(req=request, res=response) => {
    const {nombre, status, usuario, categoria, ...data } = req.body;

    const productoDB = await Producto.findOne({nombre});

    
    if(productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }
    const categoriaDB = await Categoria.findOne({nombre:categoria.toUpperCase()});

    if(!categoriaDB) {
        return res.status(400).json({
            msg: `La categria ${categoria} no existe`
        })
    }
  
    data.nombre = nombre.toUpperCase();
    data.usuario = req.usuario._id;
    data.categoria = categoriaDB._id;
    
    const producto = new Producto(data);

    try {
        await producto.save();
        res.status(201).json(producto);
    } catch (error) {
        console.log(error);
        res.status(500).json({msj: 'Contacte el administrador'})
    }
}


const obtenerProducto = async(req=request, res=response) => {
    const {id} = req.params;

    const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre')

    res.json(producto)
}

const actualizarProducto = async(req=request, res=response) => {
    const {id} = req.params;

    const {nombre, status, usuario, categoria,_id, ...data } = req.body;

    const productoDB = await Producto.findOne({nombre});

    
    if(productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }
    
    if(categoria){
        const categoriaDB = await Categoria.findOne({nombre:categoria.toUpperCase()});
        
        if(!categoriaDB) {
            return res.status(400).json({
                msg: `La categria ${categoria} no existe`
            })
        }
        data.categoria = categoriaDB._id;
    }
    if(nombre){
        data.nombre = nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;
    
    try {
        const producto = await Producto.findByIdAndUpdate(id,data,{new: true});
        res.status(200).json(producto);
    } catch (error) {
        console.log(error);
        res.status(500).json({msj: 'Contacte el administrador'})
    }
}


const eliminarProducto = async(req=request, res=response) => {
    const {id} = req.params;
    try {
        const producto = await Producto.findByIdAndUpdate(id, {status: false});
        res.json(producto);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Contactese con el administrador'
        })
    }
}



module.exports = {
    obtenerProductos,
    crearProducto,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto
}