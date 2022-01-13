const { response } = require('express')
const bcryptjs = require('bcryptjs')
const { User } = require('../models')
const { generateJWT } = require('../helpers')


const userRegister = async (req, res = response) => {
    const { name, email, password } = req.body

    try {
        const emailExist = await User.findOne({ email })
        if (emailExist) return res.status(400).json({
            ok: false,
            msg: `El correo ${email} ya está registrado en la base de datos`
        })

        const user = new User({ name, email, password })

        const salt = bcryptjs.genSaltSync()
        user.password = bcryptjs.hashSync(password, salt)

        await user.save()

        const token = await generateJWT(user._id, name)

        return res.status(201).json({
            ok: true,
            msg: 'Register OK',
            uid: user._id,
            name,
            email,
            token
        })
    } catch (error) {
        console.log(`Error: `.red, error)
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}


const userLogin = async (req, res = Response) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({
            ok: false,
            msg: 'El correo no existe'
        })

        const validPassword = bcryptjs.compareSync(password, user.password)
        if (!validPassword) return res.status(400).json({
            ok: false,
            msg: 'La contraseña no coincide'
        })

        const token = await generateJWT(user._id, user.name)

        res.json({
            ok: true,
            msg: 'Login OK',
            token,
            uid: user._id,
            name: user.name,
            email: user.email
        })
    } catch (error) {
        console.log('Error: '.red, error)
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}


const validateJWT = async (req, res = response) => {
    const { uid } = req

    const user = await User.findById(uid)

    const newToken = await generateJWT(uid, user.name)
    res.json({
        ok: true,
        msg: 'Validación de Json Web Token',
        uid,
        name: user.name,
        email: user.email,
        newToken
    })
}


module.exports = {
    userRegister,
    userLogin,
    validateJWT
}