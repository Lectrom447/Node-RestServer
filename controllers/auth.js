const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");



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


const authGoogleSignin = async(req = request, res = response) => {
    const {id_token} = req.body;

    try {
        const {correo, nombre, img} = await googleVerify(id_token); 

        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            const data ={
                nombre,
                correo, 
                password: '---GU---',
                img,
                google: true
            }

            usuario = new Usuario(data);
            await usuario.save();
        }

        if(!usuario.status){
            return res.status(401).json({
                msg: 'Contacte el administrador'
            })
        }

        const token = await generarJWT(usuario.id);

    
        res.json({
            usuario,
            token
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no valido'
        })
    }
}




module.exports = {
    authLogin,
    authGoogleSignin
}