const { Router } = require('express')
const { check } = require('express-validator')
const { userRegister, userLogin, validateJWT } = require('../controllers')
const { validateFields, validateJWT: vJWT } = require('../middlewares')

const router = Router()


router.post('/register', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email debe tener un formato correcto').isEmail(),
    check('password', 'La contraseña debe tener un mínimo de 6 caracteres').isLength({ min: 6 }),
    validateFields
], userRegister)


router.post('/login', [
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email debe tener un formato correcto').isEmail(),
    check('password', 'La contraseña debe tener un mínimo de 6 caracteres').isLength({ min: 6 }),
    validateFields
], userLogin)


router.get('/validate-jwt', vJWT, validateJWT)


module.exports = router