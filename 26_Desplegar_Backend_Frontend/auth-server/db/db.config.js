require('dotenv').config()
require('colors')

const mongoose = require('mongoose')


class DBConfig {
    constructor() {
        this.MONGODB_CNN = process.env.MONGODB_ATLAS_CNN
    }

    dbConnection = async () => {
        try {
            await mongoose.connect(this.MONGODB_CNN, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            console.log(`Base de Datos online`.green)
        } catch (error) {
            console.log('Error en la base de datos:'.red)
            throw new Error(error)
        }
    }
}


module.exports = DBConfig