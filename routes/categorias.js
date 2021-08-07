const {Router} = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existCategoryById } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');




const router = Router();

router.get('/', obtenerCategorias)

router.get('/:id', [
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existCategoryById),
    validarCampos
], obtenerCategoria)

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
] ,crearCategoria)

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre no es valido').not().isEmpty(),
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existCategoryById),
    validarCampos
] ,actualizarCategoria)

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existCategoryById),
    validarCampos
], borrarCategoria)


module.exports = router