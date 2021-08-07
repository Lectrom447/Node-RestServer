const { request, response } = require("express");
const path = require('path');
const fs = require('fs')
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);


const { subirArchvo } = require("../helpers");
const { Usuario, Producto } = require("../models");

const cargarArchivo = async(req = request, res = response) => {      
    try {
      const nombreArchivo = await subirArchvo(req.files, undefined, 'imgs');
      res.json({
        nombre: nombreArchivo
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: error
      })
    }


  
}

const actualizarImagen = async(req = request, res = response) => {
  const {coleccion, id} = req.params;
  let modelo;

  switch (coleccion) {
    case 'usuarios':
        modelo = await Usuario.findById(id);
        if(!modelo){
          return res.status(400).json({
            msg: `No existe usuario con ID ${id}`
          })
        }
      break;

    case 'productos':
        modelo = await Producto.findById(id);
        if(!modelo){
          return res.status(400).json({
            msg: `No existe producto con ID ${id}`
          })
        }
      break;
  
    default:
      return res.status(500).json({msg: 'Caso no implementado'});
  }

  if (modelo.img) {
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)

    if(fs.existsSync(pathImagen)){
      fs.unlinkSync(pathImagen);
    }
  }

  try {
    const nombreArchivo = await subirArchvo(req.files, undefined, coleccion);
    modelo.img = nombreArchivo
  
    await modelo.save();
    res.json(modelo)
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error
    })
  }
}


const actualizarImagenCloudinary = async(req = request, res = response) => {
  const {coleccion, id} = req.params;
  let modelo;

  switch (coleccion) {
    case 'usuarios':
        modelo = await Usuario.findById(id);
        if(!modelo){
          return res.status(400).json({
            msg: `No existe usuario con ID ${id}`
          })
        }
      break;

    case 'productos':
        modelo = await Producto.findById(id);
        if(!modelo){
          return res.status(400).json({
            msg: `No existe producto con ID ${id}`
          })
        }
      break;
  
    default:
      return res.status(500).json({msg: 'Caso no implementado'});
  }

  if (modelo.img) {
      const nombreArr = modelo.img.split('/')
      const nombre = nombreArr[nombreArr.length - 1];
      const [public_id] = nombre.split('.');

      await cloudinary.uploader.destroy(public_id);
      
  }

  try {
    const {tempFilePath} = req.files.archivo;
    const {secure_url} =  await cloudinary.uploader.upload(tempFilePath)

    //const nombreArchivo = await subirArchvo(req.files, undefined, coleccion);
    modelo.img = secure_url
  
    await modelo.save();
    res.json(modelo)
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error
    })
  }
}


const mostrarImagen = async(req = request, res = response) => {
  const {coleccion, id} = req.params;
  let modelo;

  switch (coleccion) {
    case 'usuarios':
        modelo = await Usuario.findById(id);
        if(!modelo){
          return res.status(400).json({
            msg: `No existe usuario con ID ${id}`
          })
        }
      break;

    case 'productos':
        modelo = await Producto.findById(id);
        if(!modelo){
          return res.status(400).json({
            msg: `No existe producto con ID ${id}`
          })
        }
      break;
  
    default:
      return res.status(500).json({msg: 'Caso no implementado'});
  }

  if (modelo.img) {
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)

    if(fs.existsSync(pathImagen)){
      return res.sendFile(pathImagen)
    }
  }

  const pathNoImg = path.join(__dirname, '../assets/no-image.jpg');
  res.status(404).sendFile(pathNoImg);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}