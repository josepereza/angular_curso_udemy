# Sección 26: Desplegar backend y frontend a producción

Esta es una sección pequeña que tiene por objetivo:

- Generar versión de producción de Angular
- Desplegar nuestra app de Angular en nuestro backend de Node
- Desplegar el backend + frontend en Heroku
- Realizar actualizaciones por cambios en el Frontend o Backend
- Re-desplegar a Heroku
- Revisar logs en producción

## Continuación de proyecto - AuthApp

Para instalar los node_modules usamos el comando `npm i` tanto en el backend como en el frontend. Para levantar el proyecto de angular usamos el comando `ng serve` y para el proyecto de node usamos el comando `npm start` o `node app` para modo de producción, o `npm run dev` o `nodemon app` para modo de desarrollo.

Vamos a usar Heroku como hosting para desplegar nuestros proyectos. Es importante revisar que nuestros proyectos no tengan errores cuando se despliegan.

## Desplegar aplicación de Angular en Node

Vamos a generar la versión de distribución del proyecto de Angular, por lo que usamos el comando `ng build`. Los archivos se generan dentro de la carpeta `dist` del proyecto. Todos los archivos que se generan los vamos a subir a la carpeta `public` del proyecto del backend.

Cuando levantamos el proyecto backend, podemos observar que nuestra aplicación ya está corriendo. Si nosotros hacemos login o register, nos va a enviar al dashboard, pero si nosotros recargamos esa ruta, nos lanza un error: `Cannot GET /dashboard`. Y es verdad, en nuestro backend no existe esa ruta, pero si en el frontend. Una manera de solventar el error es añadiendo un manejador de rutas en el backend o usando un hash en el frontend.

Para usar el hash vamos a ir al archivo `app-routing.module.ts` y añadimos la siguiente configuración:

```ts
@NgModule({
    imports: [RouterModule.forRoot(routes, {
        useHash: true
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
```

Lo que nosotros vamos a ver cuando levantamos nuestra aplicación de frontend de manera local, nuestra ruta tendrá esté aspecto: `http://localhost:4200/#/auth/login`. Si generamos de nuevo la versión de producción y la subimos al backend vamos a observar que ahora tendremos la siguiente ruta: `http://localhost:3333/#/auth/login`. El símbolo `#` le brinda compatibilidad con navegadores viejos o para manejar las rutas que no podemos controlar, como lo que nos acababa de pasar.

La otra manera es desde el backend. Vamos a ignorar la configuración del hash en el routing del frontend. Vamos a ir la clase del Server y añadimos un middleware dentro de las rutas:

```js
...
const path = require('path')
...


class Server {
    ...
    routes = () => {
        this.app.use(this.path.auth, require('../routes/auth.routes'))
        this.app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../public/index.html'))
        })
    }
    ...
}
```

## Desplegar aplicación de Node a Heroku

Vamos a crear una nueva aplicación en el dashboard de Heroku. Vamos a usar Heroku CLI, por lo que seguimos sus comandos dentro del directorio del proyecto de node.

- `heroku login`
- `git init`
- `heroku git:remote -a curso-angular-node`
- `git add .`
- `git commit -am "Primer Commit"`
- `git push heroku main`

## Configurar ambiente de producción

Necesitamos conectar la aplicación con el endpoint de producción, no con el de desarrollo. Por tanto necesitamos ir al archivo `environment.prod.ts` del archivo de Angular.

```ts
export const environment = {
    production: true,
    baseURL: 'https://curso-angular-node.herokuapp.com'
};
```

Necesitamos volver a crear el build de producción de angular y volverlo a poner dentro del directorio de `public` del proyecto de node. Necesitamos añadir los cambios con el comando `git add .`, `git commit -m "Segunda versión"`, `git push heroku main`. Por último necesitamos añadir la variable de entorno de la conexión con la base de datos y la firma de los JWT: `heroku config:set SECRET_KEY="valor"` y `heroku config:set MONGODB_ATLAS_CNN="valor"`

## Revisar logs de heroku

Para revisar los logs de nuestra aplicación, podemos usar el comando `heroku logs -n 1000 --tails`
