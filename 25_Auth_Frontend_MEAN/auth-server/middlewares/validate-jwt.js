require('dotenv').config()
const { response } = require('express');
const jwt = require('jsonwebtoken')


const validateJWT = (req, res = response, next) => {
    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Se debe ingresar un token'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_KEY_JWT)
        req.uid = uid
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }
    next()
}


module.exports = {
    validateJWT
}