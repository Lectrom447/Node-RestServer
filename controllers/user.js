const {response,request} = require('express');
const { createPasswordHash } = require('../helpers/utilities');
const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
    // const {q, nombre = 'No name', apikey} = req.query;
    const {limit = 5, from = 0} = req.query;
    const query = {status:true}

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPut = async (req = request, res = response) => {

    const {id} = req.params;
    const {_id, password, google, ...rest} = req.body;

    if(password) {
        rest.password = createPasswordHash(password)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, rest)

    res.status(400).json({
        msg: 'put API - Controlador',
        usuario
    })
}

const usuariosPost = async (req = request, res = response) => {
    const {nombre, correo, password, role} = req.body;
    const usuario = new Usuario({nombre, correo, password, role});
    usuario.password = createPasswordHash(password)

    await usuario.save();
    res.status(201).json({
        msg: 'post API - Controlador',
        usuario
    })
}

const usuariosDelete = async(req = request, res = response) => {
    const {id} = req.params;
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {status: false});
    res.json(usuario)
}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}