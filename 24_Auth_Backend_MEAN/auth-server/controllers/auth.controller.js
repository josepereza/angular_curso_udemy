const { response } = require('express')
const bcryptjs = require('bcryptjs')
const { User } = require('../models')
const { generateJWT } = require('../helpers')


const userRegister = async (req, res = response) => {
    const { name, email, password } = req.body

    try {
        const emailExist = await User.findOne({ email })
        if (emailExist) return res.status(400).json({ msg: `El correo ${email} ya está registrado en la base de datos` })

        const user = new User({ name, email, password })

        const salt = bcryptjs.genSaltSync()
        user.password = bcryptjs.hashSync(password, salt)

        await user.save()

        const token = await generateJWT(user._id, name)

        return res.status(201).json({
            msg: 'Usuario Creado',
            uid: user._id,
            name,
            token
        })
    } catch (error) {
        console.log(`Error: `.red, error)
        return res.status(500).json({ msg: 'Hable con el administrador' })
    }
}


const userLogin = async (req, res = Response) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ msg: 'El correo no existe' })
        }

        const validPassword = bcryptjs.compareSync(password, user.password)
        if (!validPassword) {
            return res.status(400).json({ msg: 'La contraseña no coincide' })
        }

        const token = await generateJWT(user._id, user.name)

        res.json({
            msg: 'Login usuario',
            token
        })
    } catch (error) {
        console.log('Error: '.red, error)
        return res.status(500).json({ msg: 'Hable con el administrador' })
    }
}


const validateJWT = async (req, res = response) => {
    const { uid, name } = req

    const newToken = await generateJWT(uid, name)
    res.json({
        msg: 'Validación de Json Web Token',
        uid,
        name,
        newToken
    })
}


module.exports = {
    userRegister,
    userLogin,
    validateJWT
}