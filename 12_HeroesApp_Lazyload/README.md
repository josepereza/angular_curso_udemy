# HéroesApp - Rutas hijas y LazyLoad

Este es un breve listado de los temas fundamentales:

- Rutas Hijas
- Rutas Principales
- LazyLoad
- Múltiples estilos en la misma SPA

Esta sección es fundamental para seguir el curso, ya que de aquí en adelante, implementaremos la carga perezosa en cada módulo principal de las futuras aplicaciones que haremos.

Comprender el Lazyload no es difícil, y la forma como lo veremos aquí nos ayudará a manejar los dos posibles casos de uso. Uno de ellos es cuando la ruta hija no tiene estilo especial y otra en la que requiere un estilo diferente por cada módulo.

## Inicio del proyecto - HéroesApp

Creamos una nueva aplicación con Angular CLI con el comando `ng new heroes-app`. Dejamos la aplicación modo estricto, como vamos a explicar el tema de la carga perezosa no seleccionamos la configuración por defecto de las rutas, y terminamos con CSS. Vamos a estar trabajado con [Angular Material](https://material.angular.io/), asi que empezamos a añadirlo con el comando `ng add @angular/material`. En consola se nos va a mostrar el tipo de tema que podemos añadir a nuestro proyecto, más adelante lo podemos cambiar, por el momento elegí el tema *Deep Purple/Amber*. Configuramos de manera global las tipografías de Angular Material, añadimos las animaciones de Angular (`BrowserAnimationsModule`). Ya podemos levantar el servidor con el comando `ng serve -o`.

## Módulos y componente iniciales

Necesitamos un módulo para Autenticación, otro para los héroes, y otro módulo donde exportaremos los módulos de material design. Usamos los siguientes comandos:

- `ng g m auth`
- `ng g m heroes`
- `ng g m material-design`

Creamos los componentes de las páginas del módulo de Auth:

- `ng g c auth/pages/login --skip-tests -is`
- `ng g c auth/pages/register --skip-tests -is`

El módulo de Héroes también tiene varias páginas, las cuales las creamos con los siguientes comandos:

- `ng g c heroes/pages/add --skip-tests -is`
- `ng g c heroes/pages/search --skip-tests -is`
- `ng g c heroes/pages/hero --skip-tests -is`
- `ng g c heroes/pages/home --skip-tests -is`
- `ng g c heroes/pages/list --skip-tests -is`

También vamos a crear un componente para el error 404, dentro del directorio `shared` el cual no va a emplear ningún módulo, por lo tanto la declaración del componente se hace en el módulo `AppModule`.

- `ng g c shares/error-page --skip-tests -is`

## Rutas Principales - Root

Vamos a crear un módulo para las rutas al mismo nivel del archivo `app.module.ts`. Para ello usamos el comando `ng g m app-routing --flat`. Una vez creado el módulo, necesitamos hacer la ruta para la página de error y la redirección en caso de rutas diferentes a la primera. Como vamos a manejar el concepto de ***Lazyload*** no vamos a importar los demás componentes, ni vamos a importar los módulos dentro de `AppModule`. Nuestras rutas principales se verán así:

```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './shared/error-page/error-page.component';


const routes: Routes = [
    { path: '404', component: ErrorPageComponent },
    { path: '**', redirectTo: '404' }
]


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
```

La clase `AppRoutingModule` la importamos en `AppModule`:

```ts
import { AppRoutingModule } from './app-routing.module';

@NgModule({
    ...,
    imports: [
        ...,
        AppRoutingModule
    ],
    ...
})
export class AppModule { }
```

Para renderizar el contenido de los componentes en las rutas usamos el selector `router-outlet` dentro del archivo `app.component.html`.

## Rutas hijas y LazyLoad - AuthRoutes

Vamos a crear un módulo para las rutas dentro del módulo de Auth, usamos el comando `ng g m auth/routes/auth-routing --flat` para que solo se genere un archivo sin un directorio. Creamos las rutas de nuestro módulo Auth un tanto diferente a lo que ya hemos realizado. Lo primero es que necesitamos definir un arreglo con una ruta que va a tener otras rutas hijas:

```ts
const routes: Routes = [
    {
        path: '', children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: '**', redirectTo: 'login' }
        ]
    }
]
```

Cuando tenemos rutas principales se usa `forRoot()` una sola vez dentro de nuestro archivo, pero cuando son rutas hijas usamos varias veces el método `forChild()` según la cantidad de rutas hijas:

```ts
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
```

Este último módulo lo importamos dentro de `AuthModule`:

```ts
import { AuthRoutingModule } from './routes/auth-routing.module';

@NgModule({
    ...,
    imports: [
        ...,
        AuthRoutingModule
    ]
})
export class AuthModule { }
```

Si volvemos a nuestra aplicación, aún no se van a ver los cambios, por tal razón debemos crear una ruta principal para el módulo de Auth sin importar el módulo dentro del bundle de la aplicación. Cuando se ingrese a la ruta de Auth, debe cargar los hijos, los cuales se encuentran en el archivo `auth.module`, una vez cargan en memoria entonces regresa el módulo `AuthModule`. En importante que la ruta se defina antes de la definición de la redirección, e incluso es recomendable ponerlas antes de la ruta de 404:

```ts
const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
    { path: '404', component: ErrorPageComponent },
    { path: '**', redirectTo: '404' }
]

@NgModule({...})
export class AppRoutingModule { }
```

Cuando estemos en la página de error queremos poner un enlace que nos lleve a la ruta de auth, por ello en el template `error-page.component.html` ponemos esto:

```html
<a routerLink="/auth/login">Ir a Login</a>
```

En el navegador podemos abrir las herramientas de desarrollo, ir a la sección de ***Red*** y observar que cuando estamos en la página de error no aparece ningún componente de auth, pero cuando usamos el enlace, entonces se carga el módulo en la lista. Acabamos de aplicar el concepto de LazyLoad cuando usamos `loadChildren`.

## Tarea - Rutas hijas de Héroes

En el siguiente enlace se encuentra las instrucciones de la tarea junto a algunos tips para su resolución: [Tarea LazyLoad](https://gist.github.com/Klerith/c72ea2d4192567cb42a0f62e5d271724). A continuación la solución:

1. Crear el módulo con el comando `ng g m heroes/routes/heroes-routing --flat`

2. Definir las rutas y añadirlas a la configuración de rutas hijas.

    ```ts
    import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';

    import { AddComponent } from '../pages/add/add.component';
    import { HeroComponent } from '../pages/hero/hero.component';
    import { ListComponent } from '../pages/list/list.component';
    import { SearchComponent } from '../pages/search/search.component';


    const routes: Routes = [
        {
            path: '', children: [
                { path: 'list', component: ListComponent },
                { path: 'add', component: AddComponent },
                { path: 'edit/:id', component: AddComponent },
                { path: 'search', component: SearchComponent },
                { path: ':id', component: HeroComponent },
                { path: '**', redirectTo: 'list' }
            ]
        }
    ]


    @NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule]
    })
    export class HeroesRoutingModule { }
    ```

3. Importar el módulo `HeroesRoutingModule` dentro de `HeroesModule`:

    ```ts
    import { HeroesRoutingModule } from './routes/heroes-routing.module';

    @NgModule({
        ...,
        imports: [
            ...,
            HeroesRoutingModule
        ]
    })
    export class HeroesModule { }
    ```

4. Realizar el LazyLoad del módulo `HeroesModule` dentro de las rutas de `AppRoutingModule`:

    ```ts
    const routes: Routes = [
        ...,
        { path: 'heroes', loadChildren: () => import('./heroes/heroes.module').then(m => m.HeroesModule) },
        ...
    ]
    ```

5. Probar todas las rutas desde el template `error-page.component.html`:

    ```html
    <ul>
        <li>
            <a routerLink="/auth/login">Ir a Login</a>
        </li>
        <li>
            <a routerLink="/auth/register">Ir a Register</a>
        </li>
        <li>
            <a routerLink="/heroes/list">Ir a Listado de héroes</a>
        </li>
        <li>
            <a routerLink="/heroes/add">Ir a Añadir un héroe</a>
        </li>
        <li>
            <a routerLink="/heroes/edit/1">Ir a Editar un héroe</a>
        </li>
        <li>
            <a routerLink="/heroes/search">Ir a Buscar un héroe</a>
        </li>
        <li>
            <a routerLink="/heroes/1">Ir a la Descripción de un héroe</a>
        </li>
    </ul>
    ```

## Mostrar Rutas Hijas - Segundo RouterOutlet

Aún falta algo para que nuestras rutas hijas cumplan por completo el objetivo del concepto. Las rutas hijas hacen referencia a rutas que están dentro de otros componentes diferentes al principal. Lo que vamos a hacer, es que las rutas hijas de módulo de Héroes estén se manejen dentro del componente `HomeComponent`, convirtiendolo en la ruta padre:

```ts
const routes: Routes = [
    {
        path: '', component: HomeComponent, children: [
            ...
        ]
    }
]
```

Pero al hacer esto, los componentes hijos no se renderizan, por lo que necesitamos agregar un `router-outlet` dentro del template `home.component.html`:

```html
<h1>Home Component</h1>
<hr>

<router-outlet></router-outlet>
```
