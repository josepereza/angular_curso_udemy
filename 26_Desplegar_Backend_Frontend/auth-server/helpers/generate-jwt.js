require('dotenv').config()
require('colors')
const jwt = require('jsonwebtoken')


const generateJWT = (uid, name) => {
    return new Promise((resolve, reject) => {
        const payload = { uid, name }
        jwt.sign(
            payload,
            process.env.SECRET_KEY_JWT,
            {
                expiresIn: '1h'
            }, (error, token) => {
                if (error) {
                    console.log('Error: '.red, error)
                    reject('No se pudo generar un token')
                } else {
                    resolve(token)
                }
            }
        )
    })
}


module.exports = {
    generateJWT
}