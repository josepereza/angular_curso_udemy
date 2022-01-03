# Sección 15: Protección de Rutas

Este es un breve listado de los temas fundamentales:

- Protección de rutas
- Rutas privadas
- Rutas públicas
- Servicio de autenticación
- Guards
- CanActivate
- CanLoad
- Mantener la sesión del usuario

Esta es una sección muy importante, donde controlaremos de forma básica una autenticación, mucho más adelante en el curso, realizaremos autenticación mediante JWT, pero antes de llegar a eso que son temas de Backend, necesito que comprendamos cómo Angular nos puede servir para proteger nuestras rutas.

## Continuación del proyecto - HéroesApp

Seguimos usando el proyecto de la sección anterior. Para instalar los node_modules usamos el comando `npm install` p `npm i`. Para levantar el servidor del proyecto escribimos el comando `ng serve -o` con el que abrimos una nueva pestaña. Para levantar el servidor de la base de datos usamos el comando `json-server --watch db.json` dentro del directorio del backend.

## Pantalla de Login Básico

Dentro de `AuthModule` importamos el módulo de Angular Material para poder hacer uso de sus componentes:

```ts
import { MaterialDesignModule } from '../material-design/material-design.module';

@NgModule({
    ...,
    imports: [
        ...,
        MaterialDesignModule
    ]
})
export class AuthModule { }
```

El template de este componente será lo siguiente:

```html
<mat-grid-list cols="1">
    <mat-grid-tile>
        <button mat-raised-button color="accent" (click)="login()">
            Ingresar
        </button>
    </mat-grid-tile>
</mat-grid-list>
```

Cuando tenemos la página de login vamos a tener un botón para ingresar a nuestra aplicación, por lo que una vez se pasen las validaciones, redireccionamos a la página principal de nuestra app.

```ts
export class LoginComponent {

    constructor(private router: Router) { }

    login = () => {
        this.router.navigate(['/heroes'])
   }
}
```

En el Sidenav tenemos el botón de Logout, por lo que debemos también debemos hacer una redirección una vez se toque dicho botón:

```ts
export class HomeComponent {
    constructor(private router: Router) {}

    logout = () => {
        this.router.navigate(['/auth']);
    }
}
```

## AuthService - Servicio para mantener el estado de la autenticación

Vamos a crear un servicio con Angular CLI: `ng g s auth/services/auth --skip-tests`. Dentro de dicho servicio necesitamos inyectar las dependencias de `HttpClient` y hacemos una petición quemada al primer usuario:

```ts
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _baseURL: string = environment.baseUrl
    private _baseEndpoint: string = `${this._baseURL}/usuarios`

    constructor(private _http: HttpClient) { }

    login = () => {
        return this._http.get(`${this._baseEndpoint}/1`)
    }
}
```

Dentro de `LoginComponent` hacemos la inyección de nuestro servicio y comprobar que funcione el método de login:

```ts
export class LoginComponent {

    constructor(private _router: Router, private _authService: AuthService) { }

    login = () => {
        this._authService.login()
            .subscribe(r => console.log(r))
    }
}
```

Vamos a darle un tipado a los objetos de los usuarios para podernos ayudarnos con el intellisense. La interfaz se llama `auth.interface.ts`

```ts
export interface Auth {
    id: string;
    usuario: string;
    email: string;
}
```

Teniendo el tipado, podemos definir los tipo de nuestro servicio:

```ts
export class AuthService {
    ...
    login = (): Observable<Auth> => {
        return this._http.get<Auth>(`${this._baseEndpoint}/1`)
    }
}
```

Si volvemos a nuestro método Login dentro del componente `LoginComponent` podemos suscribirnos al método, recibir el id e ingresar a la aplicación si el id existe, en caso contrario lanza un error y no deja ingresar a nuestra app:

```ts
export class LoginComponent {
    ...
    login = () => {
        this._authService.login()
            .subscribe({
                next: ({ id }) => {
                    id && this._router.navigate(['/heroes'])
                },
                error: ({ statusText }) => console.log(statusText)
            })
    }
}
```

## Mostrar la información de usuario activo

Dentro de nuestro servicio, cuando nos logeamos, antes de que nos podamos suscribir a dicho método, interceptamos la respuesta y usamos el operado `tap()` de RxJs para efectos secundarios antes de enviar la suscripción, con el fin de poder obtener la data y asignarla a una variable de la que haremos un getter para retornar una copia de la data y romper la referencia:

```ts
export class AuthService {
    ...
    private _auth: Auth | undefined

    get auth() {
        return { ...this._auth }
    }
    ...

    login = (): Observable<Auth> => {
        return this._http.get<Auth>(`${this._baseEndpoint}/2`)W
            .pipe(tap(auth => this._auth = auth))
    }
}
```

La información del getter lo podemos usar dentro de cualquier módulo ya que nuestro servicio se provee en la raíz del proyecto. Por lo tanto, dentro de `HomeComponent` vamos a crear un getter para obtener la información y renderizar lo necesario, luego de hacer la inyección de nuestro servicio.

```ts
export class HomeComponent { 

    get auth(){
        return this._authService.auth
    }

    constructor(private router: Router, private _authService: AuthService) {}
    ...
}
```

## Angular Guards - CanLoad

Los Guards son un tipo de servicio que nos permiten hacer validaciones a nuestras rutas. Podemos crear un Guard mediante Angular CLI con el comando `ng g g auth/guards/auth --skip-tests`. Cuando usamos dicha línea, nos aparece una selección con algunas interfaces a implementar. En nuestro caso vamos a usar `CanActivate` y `CanLoad`. Por el momento vamos a ignorar a `CanActivate`.

```ts
@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanLoad {
    canLoad(
        route: Route,
        segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

        return true;
    }
}
```

Nuestro Guard lo vamos a usar dentro de `app-routing.module.ts`, en la propiedad del objeto que contiene la ruta de héroes:

```ts
import { AuthGuard } from './auth/guards/auth.guard';


const routes: Routes = [
    ...,
    { 
        path: 'heroes', 
        ...,
        canLoad: [ AuthGuard ]
    },
    ...
]

...
export class AppRoutingModule { }
```

Si la función `canLoad()` retorna un false, entonces no podemos hacer la navegación por ninguna de las rutas que se protegen. Pero para poder definir cuando si puede o no ingresar, vamos a inyectar nuestro servicio de autenticación dentro del Guard:

```ts
export class AuthGuard implements /* CanActivate, */ CanLoad {

    constructor(private _authService: AuthService) { }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        if (this._authService.auth.id) return true
        console.log('Bloqueado por el AuthGuard')
        return false
    }
}
```

`CanLoad` solo busca permitir que se cargue un módulo luego de cierta condición, pero si nosotros en estos momentos hacemos logout, aún podemos regresar y ver lo que suponía, debía estar privado. Si nosotros creamos el método de logout para purgar la información de la variable `auth`, nos vamos a dar cuenta que mientras no se recargue la aplicación, aún podemos acceder al módulo que se cargo la primera vez luego de cumplir la condición.

```ts
export class AuthService {
    ...
    logout = () => {
        this._auth = undefined
    }
}
```

```ts
export class HomeComponent { 
    ...
    constructor(private router: Router, private _authService: AuthService) {}

    logout = () => {
        this.router.navigate(['/auth']);
        this._authService.logout()
    }
}
```

## CanActivate

Vamos a implementar la interfaz de `CanActivate`, y vamos a copiar la misma lógica que el método `canLoad()`:

```ts
export class AuthGuard implements CanActivate, CanLoad {

    constructor(private _authService: AuthService) { }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this._authService.auth.id) return true
        console.log('Bloqueado por el AuthGuard - CanActivate')
        return false
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        if (this._authService.auth.id) return true
        console.log('Bloqueado por el AuthGuard - CanLoad')
        return false
    }
}
```

Para usar el `CanActivate`, vamos a `app-routing.module.ts` y lo empleamos de la siguiente manera:

```ts
const routes: Routes = [
    ...,
    { 
        path: 'heroes', 
        ...,
        canActivate: [ AuthGuard ]
    },
    ...
]

...
export class AppRoutingModule { }
```

Vamos a grabar el id del usuario en el localStorage una vez se haga login:

```ts
export class AuthService {
    ...
    login = (): Observable<Auth> => {
        return this._http.get<Auth>(`${this._baseEndpoint}/1`)
            .pipe(
                tap(auth => this._auth = auth),
                tap(auth => localStorage.setItem('id', auth.id))
            )
    }
    ...
}
```

## Mantener la sesión del usuario

Dentro de nuestro servicio podemos hacer una función para validar la autenticación de usuario y de esa manera pasar un método dentro de `CanActivate` y `CanLoad`. Lo que vamos a retorna es un Observable de tipo booleano, por lo que empleamos el operado `of()` para crear un observable:

```ts
import { map, Observable, of, tap } from 'rxjs';

export class AuthService {
    ...
    verifyAuth = (): Observable<boolean> => {
        if (!localStorage.getItem('id')) return of(false)
        return this._http.get<Auth>(`${this._baseEndpoint}/1`)
            .pipe(map(auth => {
                this._auth = auth
                return true
            }))
    }
}
```

```ts
export class AuthGuard implements CanActivate, CanLoad {

    constructor(private _authService: AuthService) { }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this._authService.verifyAuth()
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this._authService.verifyAuth()
    }
}
```

Cuando no nos deje ingresar a una ruta por no tener los permisos, deberiamos de redirigir al usuario al login, para ello debemos hacer una inyección de `Router` dentro del Guard:

```ts
export class AuthGuard implements CanActivate, CanLoad {

    constructor(..., private _router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        return this._authService.verifyAuth()
            .pipe(tap(isAuth => {
                if (!isAuth) this._router.navigate(['/auth/login'])
            }))
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this._authService.verifyAuth()
            .pipe(tap(isAuth => {
                if (!isAuth) this._router.navigate(['/auth/login'])
            }))
    }
}
```
