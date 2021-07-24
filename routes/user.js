const {Router} = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete } = require('../controllers/user');
const { isValidRole, emailExist, existUserById } = require('../helpers/db-validators');
const {
    validarCampos, 
    validarJWT, 
    esAdminRole, 
    tieneRole
} = require('../middlewares');


const router = Router();

router.get('/', usuariosGet)
router.put('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existUserById),
    check('role').custom(isValidRole),
    validarCampos
], usuariosPut)
router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio y debe tener mas de 6 caracteres').isLength({min:6}),
    check('role').custom(isValidRole),
    check('correo','El correo no es valido').isEmail(),
    check('correo').custom(emailExist),
    validarCampos
], usuariosPost)
router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existUserById),
    validarCampos
], usuariosDelete)

module.exports = router;