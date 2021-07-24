const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");



const authLogin = async(req = request, res = response ) => {
    const {correo, password} = req.body;

    try {
        const usuario = await Usuario.findOne({correo})
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        if(!usuario.status){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - status'
            })
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        const token = await generarJWT(usuario.id);
        

        
        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Contactese con el administrador'
        })
    }

}




module.exports = {
    authLogin
}