# Sección 25: AuthApp - MEAN

Este es un breve listado de los temas fundamentales:

- Conectar Angular con nuestro backend
- Manejo de JWT
- Lazyload y rutas
- Guards
- Mantener el estado del usuario
- Manejo de errores
- RXJS y Operadores
- SweetAlert

La idea de esta sección es que conectemos nuestro trabajo realizado en la sección anterior con Angular.

## Inicio del proyecto - AuthApp MEAN

Vamos a usar el comando `ng new auth-app`, seguimos el modo estricto, con rutas y con CSS. Para levantar el proyecto usamos el comando `ng serve -o`. Para reconstruir los node_modules, ya sea del backend o del frontend, usamos el comando  `npm i` o `npm install`. Para levantar el servidor usamos el comando `nodemon app` o `npm run dev` para el modo de desarrollo y en modo de producción podemos usar `node app` o `npm start`.

## Estructura del proyecto - AuthApp

Nuestro proyecto tendrá la siguiente estructura:

```text
- app
    - auth
        - guards
        - interfaces
        - pages
            - login
            - main
            - register
        - services
    - protected
        - pages
            - dashboard
```

Descargamos los archivo anexos del curso para añadirlos a la carpeta `assets` del proyecto. También ponemos los estilos descargados dentro del archivo `style.css`.

## Rutas y LazyLoad

Vamos a definir las rutas padre de nuestra aplicación dentro de `AppRoutingModule`:

```ts
const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
    { path: 'dashboard', loadChildren: () => import('./protected/protected.module').then(m => m.ProtectedModule) },
    { path: '**', redirectTo: 'auth' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
```

Luego definimos las rutas de `AuthRoutingModule`. Este módulo siempre va a tener como base el componente `MainComponent`:

```ts
const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: '**', redirectTo: 'login' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
```

Definimos las rutas de `ProtectedRoutingModule`:

```ts
const routes: Routes = [
    { 
        path: '',
        children: [
            { path: '', component: DashboardComponent },
            { path: '**', redirectTo: 'dashboard' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProtectedRoutingModule { }
```

Por último usamos el selector para mostrar el contenido de las rutas dentro de `app.component.html` y también dentro de `main.component.html` para renderizar el contenido de sus rutas hijas:

```html
<router-outlet></router-outlet>
```

## Diseño de la pantalla de Registro y Login

Copiamos el diseño del archivo `index.html` de los documentos descargados del curso. Luego, pegamos el contenido dentro de `main.component.html`, pero extraemos el formulario de login dentro del componente correspondiente, y en su espacio ubicamos el `router-outlet`. También dejamos la estructura del componente de registro.

Procedemos a manejar los formularios reactivos. Necesitamos importar `ReactiveFormsModule` dentro de `AuthModule`:

```ts
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    ...,
    imports: [
        ...,
        ReactiveFormsModule
    ]
})
export class AuthModule { }
```

Dentro de la clase `LoginComponent` inyectamos la dependencia de `FormBuilder` para poder construir el formulario reactivo con sus correspondientes controles:

```ts
export class LoginComponent {

    public form: FormGroup = this._fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    })

    constructor(private _fb: FormBuilder) { }
}
```

Dentro del template del componente asociamos el formulario y sus respectivos controles con los inputs.

```html
<form [formGroup]="form">
    ....
        <input formControlName="email">
    ...
        <input formControlName="password">
    ....
</form>
```

También creamos una función vacía para enviar el formulario y la asociamos al botón de login con tipo submit, además de que se mantendrá desactivado si el formulario es invalido:

```html
<button type="submit" (click)="login()" [disabled]="form.invalid">
    Login
</button>
```

Por el momento establecemos algunos valores por defecto dentro de los controles del formulario:

```ts
export class LoginComponent implements OnInit {
    ...
    ngOnInit(): void {
        this.form.setValue({
            email: 'test1@mail.com',
            password: '12345678'
        })
    }
}
```

Aplicamos la misma estrategia dentro del componente del registro de usuario.

```ts
export class RegisterComponent implements OnInit {

    public form: FormGroup = this._fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    })

    constructor(private _fb: FormBuilder) { }

    ngOnInit(): void {
        this.form.reset({
            name: 'Ferrer',
            email: 'test2@mail.com',
            password: '12345678'
        })
    }

    register = () => {
        console.log(this.form.valid)
        console.log(this.form.value)
    }
}
```

```html
<form [formGroup]="form">
    ....
        <input formControlName="name">
    ....
        <input formControlName="email">
    ...
        <input formControlName="password">
    ....
    <button type="submit" (click)="register()" [disabled]="form.invalid">
        Registrar
    </button>
</form>
```

## Pantalla protegida

Dentro de la clase `DashboardComponent` le damos un estilo inline para que todo el contenido tenga un margin. Además, inyectamos la dependencia de Router para poder navegar a otra ruta cuando presionemos el botón de logout.

```ts
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styles: [` * {margin: 15px;}`]
})
export class DashboardComponent {

    constructor(private _router: Router) { }

    logout = () => this._router.navigateByUrl('/auth/')
}
```

Dentro de las clases `LoginComponent` y `RegisterComponent` efectuamos la inyección de Router para poder ingresar a la ruta del dashboard una vez se presione lo botones de login o registro:

```ts
export class RegisterComponent implements OnInit {
    ...
    constructor(..., private _router: Router) { }
    ...
    register = () => {
        ...
        this._router.navigateByUrl('/dashboard')
    }
}
```

## Login de usuario desde Angular

Vamos a importar el módulo `HttpClientModule` dentro de `AppModule` para poder manejar peticiones HTTP mediante Observables.

```ts
import { HttpClientModule } from "@angular/common/http";

@NgModule({
    ...,
    imports: [
        ...,
        HttpClientModule
    ],
    ...
})
export class AppModule { }
```

Creamos un nuevo servicio con el comando `ng g s auth/services/auth --skip-tests`. Dentro del archivo `environment.ts` añadimos otra propiedad al objeto para que sirva como url base:

```ts
export const environment = {
    production: false,
    baseURL: 'http://localhost:3333'
};
```

Las variables de entorno de producción las vamos a cambiar en el momento en el que subamos nuestros proyectos a un hosting. Luego, dentro del servicio hacemos la inyección de dependencias de `HttpClient`, y creamos un método que envié una petición POST con un objeto que sirve de cuerpo:

```ts
export class AuthService {

    private _baseURL: string = `${environment.baseURL}/auth`

    constructor(private _http: HttpClient) { }

    login = (email: string, password: string): Observable<AuthResponse> => {
        const url = `${this._baseURL}/login`
        const body = {
            email, password
        }
        return this._http.post<AuthResponse>(url, body)
    }
}
```

La interfaz `AuthResponse` contiene la siguiente información:

```ts
export interface AuthResponse {
    msg: string,
    token?: string
}
```

El método de nuestro servicio lo vamos a usar en la función del componente `LoginComponent`. Primero hacemos la inyección de nuestro servicio, luego desestructuramos la información que necesitamos pasar por el método del servicio y luego nos suscribimos para poder manejar las respuestas positivas o los errores:

```ts
export class LoginComponent implements OnInit {
    ...
    constructor(..., private _authService: AuthService) { }
    ...
    login = () => {
        const { email, password } = this.form.value
        this._authService.login(email, password)
            .subscribe({
                next: (res) => console.log(res),
                error: (error) => console.log(error)
            })
    }
}
```

## Almacenar la información del usuario

Primero vamos a hacer algunas modificaciones a las respuestas del backend para poder facilitar la construcción de nuestro servicio. En nuestro backend, en los controladores de la autenticación, vamos a modificar los siguiente:

```js
const userRegister = async (req, res = response) => {
    ...
    try {
        ...
        if (emailExist) return res.status(400).json({
            ok: false,
            ...
        })
        ...
        return res.status(201).json({
            ok: true,
            msg: 'Register OK',
            uid: user._id,
            name,
            email,
            token
        })
    } catch (error) {
        ...
        return res.status(500).json({
            ok: false,
            ...
        })
    }
}

const userLogin = async (req, res = Response) => {
    ...
    try {
        ...
        if (!user) return res.status(400).json({
            ok: false,
            ...
        })
        ...
        if (!validPassword) return res.status(400).json({
            ok: false,
            ...
        })
        ...
        res.json({
            ok: true,
            msg: 'Login OK',
            token,
            uid: user._id,
            name: user.name,
            email: user.email
        })
    } catch (error) {
        ...
        return res.status(500).json({
            ok: false,
            ...
        })
    }
}
```

La interfaz AuthResponse ahora tendrá una nueva apariencia:

```ts
export interface AuthResponse {
    ok: boolean
    msg: string
    token?: string
    uid?: string
    name?: string
    email?: string
}
```

Para guardar la información del usuario, vamos a crear una variable privada acompañada de un getter, pero antes le debemos poner un tipado:

```ts
export interface User {
    uid: string
    name: string
    email: string
}
```

Dentro de nuestro servicio, lo primero que vamos a hacer es cambiar el tipo de retorno de la función de login, luego, mediante un pipe interceptamos la respuesta y por medio del operador `tap` de RxJs sacamos la información de usuario en caso de una respuesta positiva y lo guardamos en la variable privada. Luego retornamos la respuesta booleana en true mediante el operador `map` de RxJs y por último capturamos cualquier error con el operador `catchError`, también de RxJs.

```ts
export class AuthService {

    private _baseURL: string = `${environment.baseURL}/auth`
    private _user!: User

    get user() {
        return { ...this._user }
    }

    constructor(private _http: HttpClient) { }

    login = (email: string, password: string): Observable<boolean> => {
        const url = `${this._baseURL}/login`
        const body = {
            email, password
        }
        return this._http.post<AuthResponse>(url, body)
            .pipe(
                tap( res => {
                    if (res.ok) {
                        this._user = {
                            name: res.name!,
                            uid: res.uid!,
                            email: res.email!
                        }
                    }
                }),
                map( res => res.ok),
                catchError( error => of(false))
            )
    }
}
```

Volviendo al método de `LoginComponent`, podemos redirigir al usuario al dashboard, solo en caso de que la respuesta del servicio sea un true.

```ts
export class LoginComponent implements OnInit {
    ...
    login = () => {
        ...
        this._authService.login(email, password)
            .subscribe({
                next: res => res && this._router.navigateByUrl('/dashboard'),
                error: error => console.log(error)
            })
    }
}
```

Para mostrar la información del usuario dentro del dashboard, podemos inyectar nuestro servicio dentro de dicho componente y crear un getter para retornar la información del usuario e interpolarla en el template:

```ts
export class DashboardComponent {
    get user() {
        return this._authService.user
    }

    constructor(private _router: Router, private _authService: AuthService) { }
    ...
}
```

```html
<pre>{{ user | json }}</pre>
```

## Mensajes de error visuales

Podemos capturar los errores en el servicio, para mostrarlos en el componente:

```ts
export class AuthService {
    ...
    login = (email: string, password: string): Observable<boolean> => {
        ...
        return this._http.post<AuthResponse>(url, body)
            .pipe(
                ...,
                catchError( error => of(error.error.msg))
            )
    }
}
```

```ts
export class LoginComponent implements OnInit {
    ...
    login = () => {
        ...
        this._authService.login(email, password)
            .subscribe(res => {
                res === true 
                    ? this._router.navigateByUrl('/dashboard')
                    : console.log(res)
            })
    }
}
```

Para mostrar los errores de manera visual y no en consola, vamos a usar la librería [SweetAlert2](https://sweetalert2.github.io/), la cual la instalamos con el comando `npm i sweetalert2`. Su uso es bastante sencillo:

```ts
import Swal from 'sweetalert2';

...
export class LoginComponent implements OnInit {
    ...
    login = () => {
        ..
        this._authService.login(email, password)
            .subscribe(ok => {
                ok === true 
                    ? this._router.navigateByUrl('/dashboard')
                    : Swal.fire('Error', ok.toString(), 'error')
            })
    }
}
```

## Mantener el usuario activo tras recargar el navegador web

Podemos almacenar el JWT cuando hacemos login:

```ts
export class AuthService {
    ...
    login = (email: string, password: string): Observable<boolean> => {
        ...
        return this._http.post<AuthResponse>(url, body)
            .pipe(
                tap(res => {
                    if (res.ok) {
                        localStorage.setItem('token', res.token!)
                        this._user = {...}
                    }
                }),
                ...
            )
    }
}
```

Para validar el JWT vamos a crear un nuevo método dentro del servicio que nos permite acceder a nuestro endpoint, y enviarle dentro del header el token a validar, el cual está guardado en el localStorage, y en caso de que no haya nada, se envía un string vacio.

```ts
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class AuthService {
    ...
    validateToken = () => {
        const url = `${this._baseURL}/validate-jwt`
        const headers = new HttpHeaders()
            .set('x-token', localStorage.getItem('token') ?? '')
        return this._http.get(url, { headers })
    }
}
```

## AuthGuard

Vamos a crear un guard con el comando `ng g g auth/guards/validate-token --skip-tests`. Seleccionamos los método de `CanActivate` y `CanLoad`.

Nuestro Guard lo usamos en la ruta del dashboard dentro de `AppRoutingModule`, ya que es el módulo que queremos proteger:

```ts
const routes: Routes = [
    ...,
    {
        path: 'dashboard',
        loadChildren: () => import('./protected/protected.module').then(m => m.ProtectedModule),
        canActivate: [ValidateTokenGuard],
        canLoad: [ValidateTokenGuard]
    },
    ...,
];

@NgModule({...})
export class AppRoutingModule { }
```

Para poder usar los guards, requerimos que nuestro servicio nos retorne un valor booleano, por lo que hacemos la transformación de la respuesta mediante los operadores de RxJs, además de que tipamos nuestra petición:

```ts
export class AuthService {
    ...
    validateToken = (): Observable<boolean> => {
        ...
        return this._http.get<AuthResponse>(url, { headers })
            .pipe(
                map( res => return res.ok),
                catchError( error => of(false))
            )
    }
}
```

Dentro de la clase `ValidateTokenGuard`, hacemos la inyección de nuestro servicio y de `Router`. En los métodos de `CanActivate` y `CanLoad` retornamos la respuesta de la función `validateToken` de nuestro servicio y luego interceptamos la respuesta para poder hacer una redirección en caso de que el valor que se retorne sea un false.

```ts
export class ValidateTokenGuard implements CanActivate, CanLoad {

    constructor(private _authService: AuthService, private _router: Router) { }

    canActivate(): Observable<boolean> | boolean {
        return this._authService.validateToken()
            .pipe(tap(valid => {
                !valid && this._router.navigateByUrl('/auth')
            }))
    }
    canLoad(): Observable<boolean> | boolean {
        return this._authService.validateToken()
            .pipe(tap(valid => {
                !valid && this._router.navigateByUrl('/auth')
            }))
    }
}
```

Cada que usamos el método `validateToken` de nuestro servicio, vamos a guardar la información del usuario que nos envía la respuesta de nuestro backend:

```ts
export class AuthService {
    ...
    validateToken = (): Observable<boolean> => {
        ...
        return this._http.get<AuthResponse>(url, { headers })
            .pipe(
                map(res => {
                    localStorage.setItem('token', res.token!)
                    this._user = {
                        name: res.name!,
                        uid: res.uid!,
                        email: res.email!
                    }
                    return res.ok
                }),
                ...
            )
    }
}
```

Aquí debo hacer la aclaración de que tuve que corregir la respuesta del el backend en el controlador de la ruta de validar el token, para poder enviar el campo correcto:

```js
const validateJWT = async (req, res = response) => {
    ...
    const token = await generateJWT(uid, name)
    res.json({
        ...,
        token
    })
}
```

Si fuera el backend de un tercero, deberíamos añadir un campo opcional a la interfaz de la respuesta y enviar el valor del nuevo token dentro del servicio:

```ts
export interface AuthResponse {
    ...
    token?: string
    ...
    newToken?: string
}
```

```ts
export class AuthService {
    ...
    validateToken = (): Observable<boolean> => {
        ...
        return this._http.get<AuthResponse>(url, { headers })
            .pipe(
                map(res => {
                    localStorage.setItem('token', res.newToken!)
                    ...
                }),
                ...
            )
    }
}
```

## Logout

Vamos a crear un método dentro de nuestro servicio, que nos permite limpiar el localStorage:

```ts
export class AuthService {
    ...
    logout = (): void => localStorage.clear()
}
```

Dentro de la clase `DashboardComponent` llamamos la función del servicio y enviamos a la ruta de autenticación.

```ts
export class DashboardComponent {
    ...
    logout = () => {
        this._authService.logout()
        this._router.navigateByUrl('/auth/')
    }
}
```

## Tarea: Registro de usuarios

Lo primero será crear un método dentro del servicio que nos permita registrar un usuario, teniendo en cuenta un objeto que nos sirva de body, luego interceptamos la respuesta y añadimos el token al localStorage, asignamos los datos del usuario, enviamos la respuesta en true si todo va bien, o un observable con el mensaje de error. En este caso dejamos un tipado automático, puesto que no solo podemos retornar un boolean para el error, debemos mostrar los errores ya sean del formulario o generados por el backend:

```ts
export class AuthService {
    ...
    register = (...args: string[]) => {
        const url = `${this._baseURL}/register`
        const [name, email, password] = args
        const body = {
            name,
            email,
            password
        }
        return this._http.post<AuthResponse>(url, body)
            .pipe(
                tap(res => {
                    if (res.ok) {
                        localStorage.setItem('token', res.token!)
                        this._user = {
                            uid: res.uid!,
                            name: res.name!,
                            email: res.email!
                        }
                    }
                }),
                map(res => res.ok),
                catchError(error => of(error.error))
            )
    }
    ...
}
```

Luego dentro de la clase `RegisterComponent` hacemos la inyección de dependencias de nuestro servicio, y dentro del método de registro, llamamos la función que acabamos de crear en nuestro `AuthService` y redireccionamos en caso de que sea un registro exitoso, o mostramos una alerta en caso de ingresar algún error. Recordemos que hay varios tipos de errores, por lo que necesitamos saber si el error es directo del formulario o generado por el backend.

```ts
export class RegisterComponent implements OnInit {
    ...
    constructor(..., private _authService: AuthService) { }
    ...
    register = () => {
        const { name, email, password } = this.form.value
        this._authService.register(name, email, password)
            .subscribe(ok => {
                if (ok === true) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Bienvenido',
                        timer: 1500,
                        timerProgressBar: true,
                        position: 'top-end',
                        width: 300,
                        showConfirmButton: false
                    })
                    this._router.navigateByUrl('/dashboard')
                } else {
                    if (ok.msg) {
                        Swal.fire('Error', ok.msg.toString(), 'error')
                    } else {
                        const { errors: { errors } } = ok
                        Swal.fire('Error', errors[0].msg.toString(), 'error')
                    }
                }
            })
    }
}
```

Se puede crear un pipe personalizado para resumir los servicios, o crear un método que tome lo que se puede reutilizar:

```ts
export class AuthService {
    ...
    private _general = (url: string, body: {}) => {
        return this._http.post<AuthResponse>(url, body)
            .pipe(
                tap(res => {
                    if (res.ok) {
                        localStorage.setItem('token', res.token!)
                        this._user = {
                            uid: res.uid!,
                            name: res.name!,
                            email: res.email!
                        }
                    }
                }),
                map(res => res.ok),
                catchError(error => of(error.error))
            )
    }

    register = (...args: string[]) => {
        const url = `${this._baseURL}/register`
        const [name, email, password] = args
        const body = {
            name,
            email,
            password
        }
        return this._general(url, body)
    }

    login = (email: string, password: string) => {
        const url = `${this._baseURL}/login`
        const body = {
            email, password
        }
        return this._general(url, body)
    }
    ...
}
```

## Tarea: Mantener el email del usuario

Necesitamos que cualquiera de los 3 servicios se pueda añadir el email a la data del usuario. Lo que vamos a hacer es modificar el backend en el middleware `validate-jwt.js`. Una vez hemos valido el JWT, obtenemos el uid y lo enviamos mediante el request, ya no será nombre y uid, solo uid:

```js
const validateJWT = (req, res = response, next) => {
    ...
    try {
        const { uid } = jwt.verify(token, process.env.SECRET_KEY_JWT)
        req.uid = uid
    } catch (error) {...}
    next()
}
```

Luego, en el controlador `validateJWT` del archivo `auth.controller.js` del backend, recibimos el id del request y hacemos una consulta a la base de datos, para obtener un usuario que contenga dicho uid. Luego podemos obtener cualquiera de sus propiedades:

```ts
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
```

Regresamos a nuestro backend y nos aseguramos que la interfaz para el usuario tenga el campo para el email:

```ts
export interface User {
    uid: string
    name: string
    email: string
}
```

Por último nos aseguramos que en nuestro servicio le estemos añadiendo el campo del email al validar el jwt:

```ts
export class AuthService {
    ...
    validateToken = (): Observable<boolean> => {
        ...
        return this._http.get<AuthResponse>(url, { headers })
            .pipe(
                map(res => {
                    ...
                    this._user = {
                        name: res.name!,
                        uid: res.uid!,
                        email: res.email!
                    }
                    ...
                }),
                ...
            )
    }
    ...
}
```
