# Sección 24: Auth Backend - MEAN

Este es un breve listado de los temas fundamentales:

- Fundamentos de Node
- REST Services
- JWT
- MongoDB - Mongo Atlas
- Express framework
- Express validator
- CRUD
- Validaciones
- Modelos de base de datos
- Encriptar contraseñas
- Y más...

Es una sección donde no tocaremos nada de Angular. Eventualmente desplegaremos nuestro backend a producción para que aprendamos como realizar todos esos pasos, pero será en secciones más adelante en el curso.

## Inicio del proyecto - Auth MEAN

Vamos a crear una nueva carpeta llamada `auth-server` y usamos el comando `npm init -y` para crear el archivo `package.json` con configuración por defecto. Lo que vamos a modificar será el script para levantar el proyecto:

```json
{
    ...,
    "scripts": {
        ...,
        "start": "node app.js"
    },
    ...
}
```

Creamos el archivo `app.js` que será el archivo principal de nuestro backend. Ya podemos ejecutar nuestro backend con el comando `node app.js` o `npm start`.

## Npm - Nodemon

Podemos instalar Nodemon para poder tener un live reload de los cambios de nuestra aplicación. Para levantar el proyecto con nodemon usamos el comando `nodemon app`. Dentro de la configuración de los scripts en el archivo `package.json`, vamos a añadir un nuevo script que nos permita ejecutar la aplicación en modo desarrollo:

```json
{
    ...,
    "scripts": {
        ...,
        "dev": "nodemon app.js"
    },
    ...
}
```

Ahora podemos usar los comandos `node app` o `npm run dev`. La configuración de scripts es bastante importante y practica cuando necesitamos ejecutar comandos con muchas banderas sobre nuestro proyecto.

## Instalaciones necesarias para el backend

Vamos a instalar algunas librerías con el comando `npm i bcryptjs cors dotenv express express-validator jsonwebtoken mongoose colors@1.4.0`. Creamos un archivo llamado `.gitignore` en que añadimos los archivos o paquetes que queremos ignorar dentro de nuestro repositorio.

## Configurar servidor de Express

Vamos a crear una clase para manejar el servidor con express. El archivo se encuentra en `models/server.config.js`. Requerimos de la importación de *express* para manejar el servidor, de *dotenv* para poder usar las variables de entorno y de *colors* para tener impresiones en consola un poco más vistosas.

```js
require('colors')
require('dotenv').config()
const express = require('express')


class Server {
    constructor() {
        this.app = express()
        this.PORT = process.env.PORT
    }

    listen = () => {
        this.app.listen(this.PORT, () => {
            console.log(`Aplicación corriendo en el puerto ${this.PORT}`.blue)
        })
    }
}


module.exports = Server
```

Dentro de nuestra clase vamos a crear un método que administre las rutas del server:

```js
class Server {
    constructor() {
        ...
        this.path = {
            home: '/'
        }
        this.routes()
    }

    routes = () => {
        this.app.get(this.path.home, (req, res) => {
            res.status(200).json({ msg: 'Helloooo' })
        })
    }
    ...
}
```

## Crear las rutas de nuestra aplicación

Vamos a crear un archivo llamado `auth.routes.js` para el manejo de las rutas de nuestro servidor. Necesitamos exportar la función `Router` de `express` y creamos una variable que almacene su valor, además necesitamos exportar dicha variable para poder usar su configuración en otros archivos.

```js
const { Router } = require('express')

const router = Router()


module.exports = router
```

Dentro de la clase `Server` modificamos el método de rutas de la siguiente manera. Nuestra aplicación emplea el middleware `use` de express, para poder añadir la funcionalidad que requerimos, en este caso, conectar con la configuración de las rutas de Autenticación:

```js
class Server {
    constructor() {
        ...
        this.path = {
            auth: '/auth'
        }
        this.routes()
    }

    routes = () => {
        this.app.use(this.path.auth, require('../routes/auth.routes'))
    }
    ...
}
```

Para crear un nuevo usuario, vamos a implementar una ruta con el método POST dentro del archivo `auth.routes.js`:

```js
router.post('/register', (req, res) => {
    res.status(201).json({
        msg: 'Registrar usuario'
    })
})
```

## Separar el controlador de las rutas

La lógica de las rutas la vamos a manejar dentro de un controlador que se ubica en el archivo `controllers/auth.controller.js`. Por ejemplo para la lógica de la creación del usuario:

```js
const { response } = require('express')


const userRegister = (req, res = response) => {
    res.status(201).json({
        msg: 'Registrar usuario'
    })
}


module.exports = {
    userRegister
}
```

Para tener un código más limpio, en caso de que crezca la aplicación, creamos un archivo llamado `controllers/index.js` en que nos encargamos de reunir las exportaciones de los controladores:

```js
const authController = require('./auth.controller')


module.exports = {
    ...authController
}
```

Volvemos al archivo de rutas y tendremos la siguiente nueva configuración:

```js
const { userRegister } = require('../controllers')

...

router.post('/register', userRegister)
```

En general vamos a tener solo 3 rutas para nuestro backend por el momento. La configuración de las rutas quedará de la siguiente manera, (aún no aplicamos middlewares de validación en cada ruta):

```js
const { Router } = require('express')
const { userRegister, userLogin, validateJWT } = require('../controllers')

const router = Router()


router.post('/register', userRegister)

router.post('/login', userLogin)

router.get('/validate-jwt', validateJWT)


module.exports = router
```

## Configurar CORS y body de las peticiones

Vamos a configurar el CORS (Intercambio de recursos cruzados - Cross-Origin Resource Sharing) del backend. Importamos las configuraciones por defecto de `cors` dentro de la clase `Server` y creamos una función llamada `middleware` para usar el cors. Es importante que llamemos los middlewares antes de las rutas:

```js
const cors = require('cors')

class Server {
    constructor() {
        ...
        this.middlewares()
        this.routes()
    }
    ...
    middlewares = () => {
        this.app.use(cors())
    }
    ...
}
```

Dentro de la misma función del middleware usamos la configuración de express que nos permite parsear a JSON lo que se recibe dentro del Body de las peticiones:

```js
class Server {
    ...
    middlewares = () => {
        this.app.use(express.json())
    }
    ...
}
```

Dentro de nuestros controladores podemos observar u obtener la información que recibimos mediante el body en una petición POST:

```js
const userRegister = (req, res = response) => {
    const { name, email, password } = req.body

    res.status(201).json({
        msg: 'Registrar usuario',
        body: { name, email, password }
    })
}
```

## Variables de entorno de NODE

Cuando ocupamos una variable a la que se pude acceder dentro de toda la aplicación, usamos variables de entorno. Usualmente creamos un archivo `.env`. Por ejemplo para crear un variable de entorno como el puerto de la aplicación simplemente ponemos lo siguiente:

```text
PORT = 3000
```

En el caso de Node, como instalamos `dotenv`, podemos acceder a la variable de entorno de la siguiente manera:

```js
require('dotenv').config()

class Server {
    constructor() {
        ...
        this.PORT = process.env.PORT
        ...
    }
    ...
}
```

## Servir una página HTML desde Express

Para poder mostrar un archivo HTML como elemento estático en nuestro server, usamos la siguiente configuración:

```js
class Server {
    ...
    middlewares = () => {
        ...
        this.app.use(express.static('public'))
    }
    ...
}
```

Ya podemos crear un archivo HTML dentro de la carpeta `public`, o incluso añadir la versión de producción que generemos con Angular. Es importante mencionar que no es necesario que el frontend se encuentre en dicha carpeta, puede estar en un hosting diferente.

## Validar campos obligatorios - Custom Middleware

Necesitamos validar que el cuerpo del Body tenga algunos campos obligatorios. Dentro de las rutas tenemos 3 parámetros: el path, los middlewares y el controlador. Nosotros necesitamos configurar el segundo. Vamos a importar `check` de `Express-Validator` y podemos algunas validaciones:

```js
const { check } = require('express-validator')

router.post('/register', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email debe tener un formato correcto').isEmail(),
    check('password', 'La contraseña debe tener un mínimo de 6 caracteres').isLength({ min: 6 }),
], userRegister)
```

Hasta el momento, nuestra ruta sigue funcionando sin importar si se le envía algo o no. Para poder detener el avance de los middlewares al controlador, vamos a crear un middleware personalizado que nos permita mostrar los errores de las validaciones, o en caso contrario pasar al controlador. El archivo `middlewares/validate-fields.js` se va a encargar de tomar los errores de las validaciones resultantes con la función `validationResult` de `express-validator` y en caso se que si haya error, mostrar un status 400 con los errores. En caso de que todo esté bien, seguimos con el flujo de la ejecución:

```js
const { validationResult } = require('express-validator')


const validateFields = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) return res.status(400).json(errors)
    next()
}


module.exports = {
    validateFields
}
```

Luego, creamos un archivo `index.js` para poder centralizar todos los middlewares en un solo archivo, creamos la importación y pasando el contenido de la referencia:

```js
const validateFields = require('./validate-fields');


module.exports = {
    ...validateFields
}
```

Por último, volvemos a las rutas y añadimos nuestro middleware personalizado:

```js
const { validateFields } = require('../middlewares')


router.post('/register', [
    ...,
    validateFields
], userRegister)
```

## Tarea Validar Campos

Necesitamos aplicar las validaciones para los campos del body de la ruta de login, por lo que aplicamos las mismas validaciones, excepto porque ya no se tendrá el campo del nombre:

```js
router.post('/login', [
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email debe tener un formato correcto').isEmail(),
    check('password', 'La contraseña debe tener un mínimo de 6 caracteres').isLength({ min: 6 }),
    validateFields
], userLogin)
```

## Configurar Base de Datos - MongoDB

Vamos a usar MongoDB Atlas, entramos a nuestra cuenta y creamos o usamos el cluster que nos ofrecen. Necesitamos un nombre de usuario y una contraseña para poder manejar el cluster. Necesitamos una IP de Acceso, podemos usar la IP Local, la que nos ofrece el hosting o podemos acceder que todos puedan acceder a la base de datos con la IP `0.0.0.0/0`.

El Cluster lo vamos a conectar mediante MongoDB Compass por lo que necesitamos una cadena de conexión que nos ofrece MongoDB Atlas. Esta cadena la vamos a copiar dentro de las variables de entorno:

```text
MONGODB_ATLAS_CNN = "mongodb+srv://<user>:<password>@cluster-cursos.sogwx.mongodb.net/curso_angular"
```

## Conectar MongoDB Atlas - Compass y Node

En la aplicación de MongoDB Compass creamos una conexión y pegamos la cadena de conexión de nuestra base de datos. Volvemos a nuestro proyecto y creamos un directorio llamado `db` dentro del cual creamos un archivo para configurar nuestra conexión con la base de datos. Requerimos tener instalado Mongoose, el cual es un ***ODM*** (Object Document Manager) que nos permite tener una relación más sencilla con Mongo. Nos conectamos con el enlace de nuestras variables de entorno.

```js
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
```

Luego, dentro de la clase con la que gestionamos nuestro server, creamos una nueva instancia con la que nos conectamos a la base de datos una vez se levante el servidor:

```js
const DBConfig = require('../db/db.config')

const db = new DBConfig()


class Server {
    constructor() {
        ...
        this.connectDB()
        ...
    }

    connectDB = async () => {
        await db.dbConnection()
    }
    ...
}
```

## Crear modelo de base de datos

Vamos a crear el modelo para el Usuario, con el que vamos a guardar en la base de datos:

```js
const { Schema, model } = require('mongoose')


const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})


module.exports = model('User', UserSchema)
```

Podemos hacer la exportación centralizada dentro de un archivo `index.js`, en caso de que hayan más modelos por exportar:

```js
const User = require('./User');

module.exports = {
    User
}
```

## Crear usuario en base de datos

Dentro del controlador de la ruta de registrar un usuario, analizamos si el correo que se ingresa ya existe en la base de datos. En caso de que el correo esté libre, creamos el usuario y retornamos una respuesta exitosa:

```js
const { User } = require('../models')

const userRegister = async (req, res = response) => {
    const { name, email, password } = req.body
    
    try {
        const emailExist = await User.findOne({ email })
        if (emailExist) return res.status(400).json({ msg: `El correo ${email} ya está registrado en la base de datos` })
        
        const user = new User({ name, email, password })

        await user.save()

        return res.status(201).json({
            msg: 'Usuario Creado',
            uid: user._id,
            name
        })
    } catch (error) {
        return res.status(500).json({ msg: 'Hable con el administrador' })
    }
}
```

## Hash de la contraseña

Vamos a hacer un hash de una sola via usando la librería `bcryptjs`:

```js
const bcryptjs = require('bcryptjs')


const userRegister = async (req, res = response) => {
    ...
    try {
        ...
        const salt = bcryptjs.genSaltSync()
        user.password = bcryptjs.hashSync(password, salt)

        await user.save()
        ...
    } catch (error) {...}
}
```

Aunque usemos la misma contraseña con otro usuario, la encriptación nos añadirá una contraseña diferente en la base de datos.

## Generar JsonWebToken

Un JWT se conforma de 3 partes: header, payload y signature. La firma permite validar si los 2 primeros elementos coinciden. Vamos a crear un archivo llamado `helpers/generate-jwt.js`, pero antes creamos la llave privada con la que firmaremos nuestro JWT`, y lo guardamos en la variables de entorno:

```text
SECRET_KEY_JWT = "K3y_P4RA>Curs0_4ngu1ar!"
```

Creamos la función para generar el JWT. Se debe retornar una promesa en la que se crear un objeto para poder pasarlo como payload, luego se firma y se establece el tiempo en el que va a expirar el token. El cuarto argumento de la función `sign` es un callback en el que tomaremos si hay un error para enviar un reject, o en caso contrario enviar un resolve con el token.

```js
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
```

Centralizamos la exportación de los archivos que se encuentran en el directorio de los helpers en el archivo `index.js`:

```js
const generateJWT = require('./generate-jwt')


module.exports = {
    ...generateJWT
}
```

Luego, en el controlador, una vez hemos creado al usuario, generamos el token y lo retornamos en la respuesta:

```js
const { generateJWT } = require('../helpers')


const userRegister = async (req, res = response) => {
    ...
    try {
        ...
        await user.save()
        
        const token = await generateJWT(user._id, name)

        return res.status(201).json({
            ...,
            token
        })
    } catch (error) {...}
}
```

El payload de un JWT es muy fácil de desencriptar, por lo tanto debemos tener cuidado con la información que queremos poner dentro del token.

## Login de usuario

El método de login valida el correo que se ingresa para comprobar si se encuentra en la base de datos, y luego valida que se haga match con la contraseña que está en la base de datos. Por razones educativas mostramos un error individual para el correo y para la contraseña, pero se debería unificar el error. Luego se genera un token y se envía por la respuesta

```js
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
```

## Renovar y validar el JWT

Para validar el token, creamos un archivo llamado `helpers/validate-jwt.js` en cual importamos la configuración para las variables de entorno, la response de express y la configuración de JWT. La función captura el valor del token que se está pasando por el header, si el token no existe, o si al ser verificado es incorrecto, se muestra un error. En caso de que sea un JWT valido, entonces retornamos el uid y el nombre del usuario por medio de la request.

```js
require('dotenv').config()
const { response } = require('express');
const jwt = require('jsonwebtoken')


const validateJWT = (req, res = response, next) => {
    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({ msg: 'Se debe ingresar un token' })
    }

    try {
        const { uid, name } = jwt.verify(token, process.env.SECRET_KEY_JWT)
        req.uid = uid
        req.name = name 
    } catch (error) {
        return res.status(401).json({ msg: 'Token no valido' })
    }
    next()
}


module.exports = {
    validateJWT
}
```

Centralizamos la exportación de la función en el archivo `index.js` del directorio:

```js
const validateFields = require('./validate-fields');
const validateJWT = require('./validate-jwt');


module.exports = {
    ...validateFields,
    ...validateJWT
}
```

Luego lo usamos como middleware dentro de la ruta para validar el token:

```js
const { validateJWT: vJWT } = require('../middlewares')
...
router.get('/validate-jwt', vJWT, validateJWT)
```

## Tarea: Regenerar JWT

Teniendo en cuenta que estamos recibiendo por medio del request tanto el uid, como el name del usuario que se obtuvieron del token anterior, entonces ahora podemos generar un nuevo token para el usuario con dichas variables.

```js
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
```
