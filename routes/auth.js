const {Router} = require('express');
const { check } = require('express-validator');
const { authLogin } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');





const router = Router();


router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],authLogin)





module.exports = router;