# Sección 10: Pipes de Angular

Este es un breve listado de los temas fundamentales:

- Todos los Pipes de Angular a la fecha

  - Uppercase
  - Lowercase
  - TitleCase
  - Date
  - Decimal
  - Currency
  - Percent
  - i18nSelect
  - i18Plural
  - KeyValue
  - Json
  - Async

- PrimeNG
- Módulo especializado para módulos de PrimeNG

PrimeNG es un paquete de componentes estilizados que contienen funcionalidades basadas en Angular para crear aplicaciones elegantes, hermosas y funcionales rápidamente.

## Inicio del proyecto - PipeApp

Vamos a crear un nuevo proyecto con el comando de Angular CLI `ng new pipes-app`. Configuramos el modo estricto, no configuramos el angular routing pues lo haremos manual y seleccionamos la opción de CSS. Para levantar el proyecto usamos `ng serve -o`. La documentación que vamos a usar será:

- [Angular - Pipe](https://angular.io/api?query=pipe)
- [PrimeNG](https://www.primefaces.org/primeng/)

## Introducción a los Pipes de Angular

Los pipes de Angular solo transforman la información visualmente, más no mutan la información original. Para usarlos ponemos el nombre del pipe después del signo `|` dentro de la interpolación en un template (`{{ 'expresión en JS' }}`). Por ejemplo, capitalizar un string:

```html
<h1>{{ 'HoLa muNDo' | titlecase }}</h1> <!--output: Hola Mundo -->
```

## Instalar PrimeNG

Vamos a hacer la instalación de PrimeNg y PrimeIcons con el comando `npm i primeng primeicons --save`. La documentación nos ofrece las dependencias para los archivos css, las copiamos y vamos a nuestro archivo `angular.json`, buscamos la sección de `"styles: []` y añadimos lo copiado. Es importante que bajemos el servidor antes de hacer los cambios:

```json
"styles": [
    "src/styles.css",
    "node_modules/primeicons/primeicons.css",
    "node_modules/primeng/resources/themes/lara-dark-indigo/theme.css",
    "node_modules/primeng/resources/primeng.min.css"
],
```

## Prime Button y estilo global

Queremos cambiar el diseño de un botón con PrimeNg. Primero necesitamos importar el módulo para los botones, por el momento lo haremos en el archivo `app.module.ts`.

```ts
import { ButtonModule } from 'primeng/button'

@NgModule({
    ...,
    imports: [
        ...,
        ButtonModule
    ],
    ...
})
export class AppModule { }
```

La manera en que usamos un botón con PrimeNg sería la siguiente, en este caso es un botón de tipo Raised Text Buttons:

```html
<button pButton type="button" class="p-button-raised p-button-secondary p-button-text" label="Cambiar titulo"></button>
```

Existen algunas variable configuradas dentro del css de estilo que definimos en el archivo `angular.json`. Dichas variables las vamos a emplear para poder definir algunos estilos globales de nuestra aplicación:

```css
html, 
body {
    margin: 10px;
    background-color: var(--surface-b);
    font-family: var(--font-family);
}

.text-layout {
    color: var(--text-color)
}
```

## Cards y botones con íconos

Para poner un ícono podemos hacer los siguiente:

```html
<button 
    ...
    icon="pi pi-check" iconPos="right">
</button>
```

Para implementar una tarjeta debemos de nuevo hacer la importación del Módulo para las tarjetas, esto lo haremos temporalmente dentro de la clase `AppModule`:

```ts
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@NgModule({
    ...,
    imports: [
        ...,
        ButtonModule,
        CardModule
    ],
    ...
})
export class AppModule { }
```

Por ejemplo para poner una tarjeta en el template podemos tener esta estructura:

```html
<p-card>
    <ng-template pTemplate="header">
        Header content here
    </ng-template>
    Body Content
    <ng-template pTemplate="footer">
        Footer content here
    </ng-template>
</p-card>
```

Si queremos usar alguna variable de nuestro componente dentro de las propiedades de los selectores, podemos atraparlos en `[]`, por ejemplo:

```html
<p-card [header]="title"></p-card>
```

## PrimeNg Module

Si ocupamos muchos componente de PrimeNg, nuestro módulo `AppModule` crecería demasiado. Lo que podemos hacer es centralizar las exportaciones de PrimeNg dentro de un módulo nuevo, el cual será importado dentro de `AppModule`. Vamos a crear el módulo con el comando `ng g m prime-ng`, y dentro del mismo vamos a exportar los módulos de PrimeNg:

```ts
import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@NgModule({
    exports: [
        ButtonModule,
        CardModule
    ]
})
export class PrimeNgModule { }
```

Dentro de nuestro módulo `AppModule` solo nos quedaría importarlo:

```ts
import { PrimeNgModule } from './prime-ng/prime-ng.module';

@NgModule({
    ...,
    imports: [
        BrowserModule,
        PrimeNgModule
    ],
    ...
})
export class AppModule { }
```

## PrimeNg - MenuBar

Vamos a crear un nuevo módulo llamado `shared` con el comando `ng g m shared`. También vamos a crear un módulo para ventas llamado `sales` con el comando `ng g m sales`, y dentro de este módulo tendremos los directorios para interfaces, páginas, y pipes.

Creamos un componente con el nombre de `MenuComponent` dentro del módulo de shared con el comando `ng g c shared/menu --skip-tests -is`. Como vamos a usar este componente fuera del módulo debemos exportarlo en `SharedModule`:

```ts
import { MenuComponent } from './menu/menu.component';

@NgModule({
    ...,
    exports: [
        MenuComponent
    ]
})
export class SharedModule { }
```

Como vamos a usar el módulo `MenubarModule` de PrimeNg, hacemos la exportación en el módulo `PrimeNgModule`

```ts
import { MenubarModule } from 'primeng/menubar';

@NgModule({
    exports: [
        ...,
        MenubarModule
    ]
})
export class PrimeNgModule { }
```

Necesitamos importar el módulo `SharedModule` dentro de `AppModule` para poder acceder a sus componentes:

```ts
import { SharedModule } from './shared/shared.module';


@NgModule({
    ...,
    imports: [
        ...,
        SharedModule
    ],
    ...
})
export class AppModule { }
```

También debemos hacer la importación del módulo `PrimeNgModule` dentro de `SharedModule` para usar el componente del menú:

```ts
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

@NgModule({
    ...,
    imports: [
        CommonModule,
        PrimeNgModule
    ],
    ...
})
export class SharedModule { }
```

Cuando vayamos a usar el módulo del menú necesitamos hacer una importación dentro del componente `MenuComponent` para que sirva de tipado a los ítems del menú:

```ts
import { MenuItem } from 'primeng/api';

export class MenuComponent implements OnInit {
    items: MenuItem[] = [];
    ...
    ngOnInit() {
        this.items = [...]
    }
```

Debemos pensar en algo, ¿realmente estamos PrimeNg dentro del componente de App? Como no lo estamos usando procedemos a eliminar la importación del módulo `PrimeNgModule` de `AppModule`

## Rutas de nuestra aplicación

Vamos a crear un módulo para las rutas con el comando `ng g m app-router --flat`, la bandera `--flat` es para evitar que se cree una carpeta. También vamos a crear varios componentes dentro de `sales/pages`:

- `NumberComponent` con el comando `ng g c sales/pages/numbers --skip-tests -is`
- `NotCommmonsComponent` con el comando `ng g c sales/pages/not-commons --skip-tests -is`
- `BasicComponent` con el comando `ng g c sales/pages/basic --skip-tests -is`
- `SortComponent` con el comando `ng g c sales/pages/sort --skipt-tests -is`

Todos los componentes los vamos a usar fuera del módulo de `SalesModule`, por lo que debemos exportarlos:

```ts
@NgModule({
    ...,
    exports: [
        NumbersComponent,
        NotCommonsComponent,
        BasicComponent,
        SortComponent
    ]
})
export class SalesModule { }
```

Una vez creados los componentes podemos definir el arreglo con las objetos para configurar las rutas y sus componente asociados, dentro de `AppRouterModule`. Como todas las rutas que vamos a manejar son principales, usamos la configuración `forRoot()`, y necesitamos exportar el módulo `RouterModule` para acceder a su información desde cualquier importación de las rutas:

```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BasicComponent } from './sales/pages/basic/basic.component';
import { NotCommonsComponent } from './sales/pages/not-commons/not-commons.component';
import { NumbersComponent } from './sales/pages/numbers/numbers.component';
import { SortComponent } from './sales/pages/sort/sort.component';


const routes: Routes = [
    { path: '', component: BasicComponent, pathMatch: 'full' },
    { path: 'not-commons', component: NotCommonsComponent },
    { path: 'numbers', component: NumbersComponent },
    { path: 'sort', component: SortComponent },
    { path: '**', redirectTo: '' }
]


@NgModule({
    declarations: [],
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRouterModule { }
```

Terminada la configuración de las rutas, procedemos a hacer la importación de las mismas dentro del módulo `AppModule`:

```ts
import { AppRouterModule } from './app-router.module';

@NgModule({
    ...,
    imports: [
        ...,
        AppRouterModule,
        ...
    ],
    ...
})
export class AppModule { }
```

Ya podemos acceder a las rutas y a sus componentes en el template de App:

```html
<router-outlet></router-outlet>
```

## Cambiar las rutas utilizando el Menubar

Desde la clase `MenuComponent` podemos configurar los items del menú y además proporcionarles una ruta con la propiedad `routerLink` de cada objeto:

```ts
import { MenuItem } from 'primeng/api';

export class MenuComponent implements OnInit {
    items: MenuItem[] = []
    ...
    ngOnInit() {
        this.items = [
            {
                label: 'Pipes de Angular',
                icon: 'pi pi-desktop',
                items: [
                    {
                        label: 'Textos y Fechas',
                        icon: 'pi pi-align-left',
                        routerLink: '/',

                    },
                    {
                        label: 'Números',
                        icon: 'pi pi-dollar',
                        routerLink: 'numbers',
                    },
                    { 
                        label: 'No Comunes',
                        icon: 'pi pi-globe',
                        routerLink: 'not-commons' 
                    }
                ]
            },
            {
                label: 'Pipes Personalizados',
                icon: 'pi pi-cog',
            }
        ];
    }
}
```

El template de este componente tiene el selector del módulo del menú, el cual a su vez nos permite poner una imagen al principio o al final del mismo mediante un `ng-template`.

```html
<p-menubar [model]="items">
    <ng-template pTemplate="end">
        <img src="./favicon.ico" alt="">
    </ng-template>
</p-menubar>
```

## PrimeFlex

Dentro de la documentación de PrimeNg tenemos un apartado para PrimeFlex el cual nos permite tener un sistema de grid dentro de nuestra aplicación. Lo primero será instalarlo con el comando `npm install primeflex --save`. Luego en el archivo `angular.json` vamos a referenciar la hoja de estilo de PrimeFlex:

```json
"styles": [
    "src/styles.css",
    ...,
    "node_modules/primeflex/primeflex.css"
],
```

Siempre que se modifique el archivo `angular.json` debemos bajar y volver a subir el servidor para que reconozca los cambios.

Dentro del módulo de `SalesModules` necesitamos importar el módulo de `PrimeNgModule`:

```ts
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

@NgModule({
    ...,
    imports: [
        ...,
        PrimeNgModule
    ],
    ...
})
export class SalesModule { }
```

Para usar el sistema de grid de la versión 3 de PrimeFlex dentro de nuestra aplicación, necesitamos usar la clase `grid` y las clases `col-n`, por ejemplo:

```html
<div class="grid">
    <div class="col-4"></div>
    <div class="col-4"></div>
    <div class="col-4"></div>
</div>
```

Es importante recordar que debemos importar el módulo de `SalesModule` dentro de `AppModule` para poder evitar errores:

```ts
@NgModule({
    ...,
    imports: [
        ...,
        SalesModule
    ],
    ...
})
export class AppModule { }
```

## UpperCase, LowerCase y TitleCase Pipes

El uso de estos 3 pipes es muy sencillo, lo podemos usar dentro de una interpolación o dentro de una propiedad que se encuentre atrapada en `[]`. En el siguiente ejemplo vemos las 2 maneras al usar variables que se establecieron en la clase `BasicComponent`:

```ts
export class BasicComponent {
    public nameLowerCase: string = 'carlos'
    public nameUpperCase: string = 'DAVID'
    public nameTitleCase: string = 'paEz FeRRer'
}
```

```html
<div class="grid">
    <div class="col-4">
        <p-card header="UpperCase" [subheader]="'De: ' + (nameLowerCase | lowercase)">
            A: {{ nameLowerCase | uppercase }}
        </p-card>
    </div>
    <div class="col-4">
        <p-card header="LowerCase" [subheader]="'De: ' + (nameUpperCase | uppercase)">
            A: {{ nameUpperCase | lowercase }}
        </p-card>
    </div>
    <div class="col-4">
        <p-card header="TitleCase" [subheader]="'De: ' + nameTitleCase">
            A: {{ nameTitleCase | titlecase }}
        </p-card>
    </div>
</div>
```
