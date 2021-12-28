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

## Date Pipe

El uso del pipe Date es un poco más extenso por el tema de los parámetros que puede recibir. En la documentación de Angular sobre [DatePipe](https://angular.io/api/common/DatePipe), nos muestra todos los parámetros que se pueden usar con una fecha. Por ejemplo dentro de `BasicComponent` creamos una variable para una fecha:

```ts
export class BasicComponent {
    ...
    public date: Date = new Date()
}
```

Y dentro del template podemos hacer la mutación visual de la siguiente manera:

```html
<ul>
    <li>{{ date }}</li>
    <li>{{ date | date }}</li>
    <li>{{ date | date : 'short' }}</li>
    <li>{{ date | date : 'medium' }}</li>
    <li>{{ date | date : 'long' }}</li>
    <li>{{ date | date : 'MMMM' }}</li>
    <li>{{ date | date : 'MMMM dd yyyy' }}</li>
    <li>{{ date | date : 'h:mm a z' }}</li>
</ul>
```

## Cambiar el idioma por defecto

Dentro del archivo `app.module.ts` hacemos la importación la configuración del idioma local en la que se maneja la aplicación y lo registramos en la data local:

```ts
import esCO from '@angular/common/locales/es-CO'
import { registerLocaleData } from '@angular/common'
registerLocaleData(esCO)
```

Nuestro pipe de date nos permite hacer el cambio del idioma en el resultado, pero para hacerlo de manera global, hacemos un provide dentro del decorador `@NgModule` del módulo `AppModule`:

```ts
@NgModule({
    ...,
    providers: [{
        provide: LOCALE_ID, useValue: 'es-CO'
    }],
    ...
})
export class AppModule { }
```

## Timezone y otros idiomas

Para cambiar la zona horaria de nuestra fecha usamos un 2 argumento con el `GMT` del lugar que queremos coordinar, por ejemplo la zona horaria de Lampung, Indonesia, el cual es la antípoda de Bogotá es GMt+7, mientras que Colombia es GMT-5:

```html
<li>{{ date | date : 'long' : 'GMT+7' }}</li>
```

Para configurar la locación del pipe date usamos un tercer argumento en el que definimos la sigla del idioma a usar, por defecto está en `en` pero en la explicación de arriba lo transformamos a `es-CO`:

```html
<li>{{ date | date : 'long' : '' : 'en' }}</li>
```

En caso de que queramos otro idioma debemos registrar la configuración local dentro de `AppModule`.

## DecimalPipe

La mutación visual de un número usando el pipe de `number` es muy sencilla. Por ejemplo tenemos 1 variable con un valor:

```ts
export class NumbersComponent {
    public netSales: number = 12_345_678.909876
}
```

Para usar el pipe hacemos lo siguiente:

```html
{{ netSales | number }}
```

Si queremos mostrar si o si 2 decimales usamos un argumento de la siguiente manera, teniendo en cuenta que si se exceden los decimales en la variable original, entonces se aproxima

```html
{{ netSales | number : '.2-2' }}
```

Si queremos entre 2 y 5 decimales usamos el argumento así:

```html
{{ netSales | number : '.2-5' }}
```

Si queremos mostrar 10 número en la parte entera, con 3 cifras decimales entonces el argumento cambiaría así:

```html
{{ netSales | number : '10.3-3' }}
```

## CurrencyPipe y PercentPipe

Podemos usar el pipe `currency` cuando hacemos referencia a dinero:

```html
{{ netSales | currency }}
```

Por defecto nos aparece en dolares, pero si queremos cambiar el símbolo a la moneada local usamos un primer parámetro:

```html
{{ netSales | currency : 'COL' }}
```

Para usar un símbolo en especifico usamos un segundo parámetro:

```html
{{ netSales | currency : '' : 'symbol-narrow' }}
```

Para determinar la cantidad de decimales a usar, empleamos un tercer parámetro:

```html
{{ netSales | currency : '' : '' : '.0-4' }}
```

Y un cuarto paramétro para especificar el idioma local:

```html
{{ netSales | currency : '' : '' : '' : 'es-CO' }}
```

Cuando queremos mutar una variable de manera visual a un formato de porcentaje usamo  el pipe `percent`:

```html
{{ percent | percent }}
```

Podemos determinar la cantidad de decimales en el primer parámetro:

```html
{{ percent | percent : '.1-3' }}
```

## PrimeNg - FieldSet

Dentro de la documentación de PrimeNG tenemos una sección para un componente llamado `FieldSet`. Para usarlo, hacemos la exportación del mismo, en el módulo de `PrimeNgModule`:

```ts
import { FieldsetModule } from 'primeng/fieldset';

@NgModule({
    exports: [
        ...,
        FieldsetModule
    ]
})
export class PrimeNgModule { }
```

Para usar las animaciones de Angular, requerimos hacer la importación de un módulo llamado `BrowserAnimationsModule` dentro de nuestro `AppModule`:

```ts
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'


@NgModule({
    ...,
    imports: [
        ...,
        BrowserAnimationsModule,
        ...
    ],
    ...
})
export class AppModule { }
```

Para usar el Fieldset ya podemos escribir lo siguient en nuestro template del componente:

```html
<p-fieldset legend="Header" [toggleable]="true">
    Content
</p-fieldset>
```

Para usar el efecto de splash cuando se cliquea el componente visual necesitamos hacer la inyección de dependecias de la configuración de PrimeNg, y dentro del método implementado de OnInit hacemos la configuración:

```ts
import { PrimeNGConfig } from 'primeng/api';

export class AppComponent implements OnInit {
    constructor(private primeNgConfig: PrimeNGConfig){}
    
    ngOnInit(): void {
        this.primeNgConfig.ripple = true
    }
}
```

## i18nSelectPipe

El pipe `i10Select`, permite hacer un mapeo de un objeto que toma en cuenta una propiedad, para poder mostar algo de acuerdo a la condición actual. Por ejemplo necesitamos mostrar la palabra invirtarlo o invitarla de acuerdo al genero. Para ello primero tenemos una varible que contenga el genero y un objeto que tome en cuenta el valor del genero y la acción a tomar:

```ts
export class NotCommonsComponent {
    public name: string = 'David Ferrer'
    public genre: string = 'male'
    public inviteMap =  {
        'male': 'invitarlo',
        'female': 'invitarla'
    }
}
```

Dentro de nuestro template mostramos lo siguente:

```html
<p-fieldset legend="i18nSelect Pipe" [toggleable]="true">
    Saludos {{ name }}, es un placer {{ genre | i18nSelect : inviteMap }} a nuestro evento
</p-fieldset>  
```

## i18nPluralPipe

Mediante este pipe podemos hacer un mapeo a un objeto para tomar en cuenta la cantidad de elementos y mostrar algo. Por ejemplo tenemos un arreglo de objetos y necesitamos mostrar cuantos hay en la lista de espera. En el objeto que nos va a ayudar a mapear tomamos en consideración la cantidad de elementos y la respuesta que debe dar si cumple la condición:

```ts
export class NotCommonsComponent {
    ...
    public clients: string[] = ['David', 'Juana', 'Ferrer', 'Valentina']
    public clientsMap =  {
        '=0': 'no tenemos ningún cliente esperando',
        '=1': 'tenemos un cliente esperando',
        'other': 'tenemos # clientes esperando'
    }
}
```

Nuestro template tiene que recibir lo que vamos a evaluar junto al pipe:

```html
Actualmente tenemos {{ clients.length | i18nPlural : clientsMap }}
```

## Tarea sobre i18nPipes

Mediante un botón en cada Fieldset, necesitamos dar una funcionalidad para cambiar el nombre o más bien, el genero a la persona y observar el funcionamiento del pipe `i18nSelect` y otro botón para reducir la cantidad de elementos del array y observar el comportamiento de `i18nPlural`:

```html
<div class="grid">
    <div class="col-12 md:col-12 lg:col-6">
        <p-fieldset legend="i18nSelect Pipe" [toggleable]="true">
            <p>Saludos {{ name }}, es un placer {{ genre | i18nSelect : inviteMap }} a nuestro evento</p>
            <button pButton label="Cambiar persona" class="p-button-rounded" (click)="changeName()"></button>
        </p-fieldset>        
    </div>
    <div class="col-12 md:col-12 lg:col-6">
        <p-fieldset legend="i18nPlural Pipe" [toggleable]="true">
            <p>Actualmente {{ clients.length | i18nPlural : clientsMap }}</p>
            <button pButton label="Borrar cliente" class="p-button-rounded" (click)="deleteClient()"></button>
        </p-fieldset>        
    </div>
</div>
```

```ts
export class NotCommonsComponent {
    ...
    changeName = () => {
        this.name = 'Valentina'
        this.genre = 'female'
    }  

    deleteClient = () => this.clients.pop()
}
```

## SlicePipe

El pipe `slice` cumple la función de separa una porción de un string o de un arreglo desde la posición inical hasta la posición final. Por ejemplo:

```html
<p-fieldset legend="Slice Pipe" [toggleable]="true">
    <strong>Original: </strong>
    <pre>{{ clients }}</pre>

    <strong>slice : 0 : 2</strong>
    <pre>{{ clients | slice : 0 : 2}}</pre>

    <strong>slice : 2</strong>
    <pre>{{ clients | slice : 2 }}</pre>

    <strong>slice : 1 : 3</strong>
    <pre>{{ clients | slice : 1 : 3 }}</pre>
</p-fieldset>  
```

Algo interesante es que caundo solo interpolamos el arreglo no se actualiza en tiempo de ejecución, pero cuando usamos el pipe slice podemos observar el cambio en el arreglo en el momento que se modifica.

## KeyValuePipe

Necesitamos mostrar lo que hay dentro de un objeto, mientras hacemos una lista con esas propiedades:

```ts
export class NotCommonsComponent {
    ...
    public person = {
        name: 'David',
        edad: 20,
        address: 'Colombia'
    }
    ...
}
```

El pipe `keyvalue` nos permite tener la separación de cada elemento del objeto dentro otro objeto con la etiqueta de llave valor:

```html
<ul>
    <li *ngFor="let item of person | keyvalue">
        <b>{{ item.key }}</b>: {{ item.value }}
    </li>
</ul>
```

## JsonPipe

El pipe `json` es muy útil para depurar elementos que entran mediante peticiones, ya que nos expande por completo la respuesta de manera visual. Por ejemplo tenemos este objeto:

```ts
export class NotCommonsComponent {
    ...
    public jsonObject = {
        array: this.clients,
        string: this.name,
        object1: this.inviteMap,
        object2: this.clientsMap,
        object3: this.person,
        boolean: true
    }
    ...
}
```

En nuestro template vamos a usar el pipe de la siguiente manera:

```html
<pre>{{ jsonObject | json }}</pre>
```

## AsyncPipe

Desenvuelve el valor de un primitivo asincrono. El elemento con el que se usa debe ser un Observable o una promesa. Por ejemplo creamos un observable usando `interval()` de RxJs:

```ts
export class NotCommonsComponent {
    ...
    public myObservable = interval(1000)
    ...
}
```

En el template nos suscribimos al observable con el pipe `async` y así podemos ver como cambia su valor:

```html
<pre>{{ myObservable | async }}</pre>
```

También podemos crear una promesa:

```ts
export class NotCommonsComponent {
    ...
    public valuePromise = new Promise((resolve) => {
        setTimeout(() => {
            resolve('Tenemos data de promesa')
        }, 2500)
    })
    ...
}
```

Y en nuestro template renderizar lo que se obtenga de la promesa, pero mientras no se resuelva, se muestra un mensaje se espera:

```html
<pre *ngIf="!(valuePromise | async)">Resolviendo Promesa</pre>
<pre>{{ valuePromise | async }}</pre>
```

Aqui cabe aclarar que si hacemos lo mismo, pero con un obsersable, la suscripción se hace 2 veces, una por cada lugar donde se use el pipe `async`:

```html
<pre *ngIf="!(myObservable | async)">Resolviendo Promesa</pre>
<pre>{{ valuePromise | async }}</pre>
```
