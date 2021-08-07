const { Router } = require("express");
const { check } = require("express-validator");
const { cargarArchivo, mostrarImagen, actualizarImagenCloudinary } = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");
const { validarCampos, validarArchivoSubir } = require("../middlewares");


const router = Router();


router.post('/',[
    validarArchivoSubir
] , cargarArchivo)

router.put('/:coleccion/:id', [
    check('id', 'El id no es valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarArchivoSubir,
    validarCampos
],actualizarImagenCloudinary)

router.get('/:coleccion/:id', [
    check('id', 'El id no es valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)



module.exports = router;