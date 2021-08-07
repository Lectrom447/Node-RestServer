const {Router} = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, eliminarProducto } = require('../controllers/productos');
const { existProductoById } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();

router.get('/', obtenerProductos);

router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'El categoria es obligatorio').not().isEmpty(),
    validarCampos
], crearProducto);

router.get('/:id', [
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existProductoById),
    validarCampos
], obtenerProducto)

router.put('/:id',[
    validarJWT,
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existProductoById),
    validarCampos
],actualizarProducto)

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existProductoById),
    validarCampos
], eliminarProducto)




module.exports = router;