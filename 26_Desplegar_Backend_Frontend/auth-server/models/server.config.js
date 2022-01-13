require('colors')
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')

const DBConfig = require('../db/db.config')

const db = new DBConfig()


class Server {
    constructor() {
        this.app = express()
        this.PORT = process.env.PORT
        this.path = {
            auth: '/auth'
        }
        this.connectDB()
        this.middlewares()
        this.routes()
    }

    connectDB = async () => {
        await db.dbConnection()
    }

    routes = () => {
        this.app.use(this.path.auth, require('../routes/auth.routes'))
        this.app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../public/index.html'))
        })
    }

    middlewares = () => {
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(express.static('public'))
    }

    listen = () => {
        this.app.listen(this.PORT, () => {
            console.log(`Aplicación corriendo en el puerto ${this.PORT}`.green)
            console.log(`Modo desarrollo: http://localhost:${this.PORT}`.italic.blue)
        })
    }
}


module.exports = Server