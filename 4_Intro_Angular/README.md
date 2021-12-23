# Sección 4: Introducción a Angular

Este es un breve listado de los temas fundamentales:

- Crear proyectos de Angular
- Explicar cada archivo y directorio de un proyecto
- Componentes
- Módulos
- One way data binding
- Uso del AngularCLI - Angular Command Line Interface
- Directivas creadas por Angular
- ngIf y ngIf-else
- Y más...

Esta es la sección donde empezaremos nuestro camino de Angular.

## Introducción a Angular

Angular es un marco de trabajo estandarizado, viene con todo que se necesita para trabajar. Las aplicaciones de Angular son modulares. Google le da mantenimiento al framework de Angular. Los bloques fundamentales de Angular son los *Componentes*, las *Rutas*, las *Directivas*, los *Servicios* y los *Modulos*.

## Crear un proyecto de Angular

Para crear un proyecto de Angular usamos Angular CLI con el comando `ng new <nombre-del-proyecto>`. Nos van a aparecer opciones como reforzar el tipado estricto, añadir el archivo de configuración de ruteo, archivos de estilo como CSS, SASS o LESS. Luego de que se ha instalado el proyecto, debemos ingresar al directorio que se crea. Para ejecutar el proyecto escribimos `ng server`, o si queremos que se abra una vez este disponible, usamos el comando `ng serve -o`

Actualmente, Angular no trae TSLint ya que fue deprecado, si queremos trabajar con un Linter, podemos usar ESLint. Otro cambio con la versión en la que está trabajando vs con la que se realizo el curso es que no viene por defecto el directorio e2e. Aún así, ninguno de los cambios afecta el curso.

## Explicación de cada archivo del proyecto

El archivo:

- `tslint.json` es el archivo que configura las reglas de TypeScript.
- `tsconfig.json` le permite al proyecto que transpile de TS a JS.
- `tsconfig.spec.json` extiende del anterior y se enfoca en las pruebas.
- `tsconfig.app.json` se enfoca en la configuración de TS dentro de la aplicación.
- `package.json` No deberiamos usarlo manualmente. Habla sobre las dependencias de producción y de desarrollo.
- `package-lock.json` expone la construcción de los modulos instalados.
- `karma.conf.js` Configuración de las pruebas unitarias y de integración basadas en Karma.
- `angular.json` Configuraciones propias de nuestra aplicación.
- `.browserslistrc` Compatibilidad con navegadores.
- `node_modules` Paquetes orientados en el desarrollo de la aplicación.
- `e2e` Configuración de las pruebas e2e

## Explicación de los archivos dentro del SRC

Dentro del directorio `src` tenemos inicialmente:

- `app` Componente principal de la aplicación que se compone de archivos de estilos CSS, HTML, pruebas, clases de TS para la configuración propia del componente como para agrupar otros componentes necesarios para la misma.
- `assets` Recursos estaticos
- `environments` Variables de entorno
- `index.html` Archivo base de la aplicación
- `main.ts` Ambiente en el que correo la aplicación
- `polyfilss.ts` Compatibilidad con navegadores web
- `styles.css` Hoja de estilos global en toda la aplicación
- `test.ts` Configuración de la base de las pruebas

## App Component

En el archivo `app.component.ts` tiene la importación de un decorador con el cual definimos la etiqueta sobre la que trabajamos en el archivo `index.html`, también nos permite añadir la contraparte de la estructura del HTML y los estilos del mismo.

Dentro de la clase nos muestra un titulo que podemos interpolar con `{{ }}` dentro del HTML de nuestro componente:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'intro-angular';
}
```

```html
<h1>{{ title }}</h1>
```

## Contador APP

Vamos a crear un pequeño contador dentro de nuestra aplicación. Primero definimos una variable para el valor del número y lo interpolamos en el HTML del componente:

```ts
export class AppComponent {
    ...
    public n: number = 10
}
```

```html
<span>{{ n }}</span>
```

También vamos a declarar 2 botones con eventos `click` que sumen o resten 1, dentro de `app.component.html`. Los eventos se definen con un parentesis encerrandolos `(evento)=""`. Dentro del evento podemos incluir la lógica encerrada en comillas:

```html
<button (click)="n = n + 1">+1</button>
<span> {{ n }} </span>
<button (click)="n = n - 1">-1</button>
```

No es recomendable poner mucha lógica en el lado del template.

## Métodos en el componente

Dentro de nuestro componente podemos crear método para luego usarlos en el template. Es necesario usar `this.` para apuntar a la instancia de nuestra clase. También como nos damos cuenta, podemos usar funciones de flecha o funciones tradicionales.

```ts
export class AppComponent {
    ...
    public n: number = 10

    add = () => this.n += 1
    subtract() {
        this.n -= 1
    } 
}
```

Dentro de nuestro template llamamos los métodos de la siguiente manera:

```html
<button (click)="add()">+1</button>
...
<button (click)="subtract()">-1</button>
```

Podemos crear una función con argumentos para reducir un poco más la lógica en el programa:

```ts
export class AppComponent {
    ...
    public n: number = 10

    accumulate = (value: number) => this.n += value 
}
```

Nuestro template usaria los métodos de la siguiente manera (importante recordar que tenemos asignado un tipo para el parámetro):

```html
<button (click)="accumulate(2)">+2</button>
<span> {{ n }} </span>
<button (click)="accumulate(-2)">-2</button>
```

Podemos usar variables dentro de nuestro template para pasarlas como argumentos a funciones que se han de emplear dentro del HMTL. Por ejemplo:

```ts
export class AppComponent {
    ...
    public base: number = 5
    ...
}
```

```html
<h3>La base es <strong>{{ base }}</strong> para el modificar el contador</h3>

<button (click)="accumulate(base)">+{{ base }}</button>
...
<button (click)="accumulate(-base)">-{{ base }}</button>
```

## Crear un componente manualmente

Podemos crear un componente de manera manual. Solo debemos seguir la práctica de poner antes de la extensión del archivo, un identificador como componente, directiva, pipe, etc. En nuestro caso vamos a sacar como componente el contador que tenemos. Creamos dentro de `app` el archivo `components/counter/counter.component.ts`, añadirmos como template del componente todo lo que teniamos en el HTML del componente app y además, trasladamos las propiedades y métodos al nuevo componente. Tendríamos nuestro componente de la siguiente manera:

```ts
import { Component } from '@angular/core'


@Component({
    selector: 'app-counter',
    template: `
        <h1>{{ title }}</h1>

        <h3>La base es <strong>{{ base }}</strong> para el modificar el contador</h3>

        <button (click)="accumulate(base)">+{{ base }}</button>
        <span> {{ n }} </span>
        <button (click)="accumulate(-base)">-{{ base }}</button>
    `
})
export class CounterComponent {
    public title: string = 'Contador App'
    public n: number = 10
    public base: number = 5

    accumulate = (value: number) => this.n += value
}
```

Ahora debemos añadir nuestro selector dentro de las declaraciones de los modulos de `app.module.ts`:

```ts
...
import { CounterComponent } from './components/counter/counter.component';

@NgModule({
  declarations: [
    ...
    CounterComponent
  ],
  ...
})
...
```

Y dentro del template de app (`app.component.html`) llamamos el selector de la siguiente manera:

```html
<app-counter></app-counter>
```

## Componente de Heroe y separación de directorios

Siempre es recomendable tener una buena administración en el arbol de directorios de nuestro proyecto. Es ideal que agrupemos por funcionalidad.

Vamos a crear un nuevo directorio llamado `components/heroes/hero` en que tendremos los archivos de nuestro componente, los cuales en este momento serían `hero.component.html` y `hero.component.ts`.

Creamos la clase de Hero junto con el decorador para determinar el selector y la url de la template:

```ts
import { Component } from '@angular/core'

@Component({
    selector: 'app-hero',
    templateUrl: './hero.component.html'
})
export class HeroComponent {}
```

Y lo añadimos a las declaraciones de nuestro modulo app:

```ts
...
import { HeroComponent } from './components/heroes/hero/hero.component';

@NgModule({
    declarations: [
        ...,
        HeroComponent
    ],
    ...
})
...
```

Como nuestro punto inicial es `app.component.html`, llamamos el selector dentro de dicho archivo.

```html
<app-hero></app-hero>
```

## Cambios en el template del componente

Vamos a añadir algunas propiedades a la clase de nuestro componente `Hero`, además de un get y de un método:

```ts
export class HeroComponent {
    public name: string = 'IronMan'
    public age: number = 30

    get nameCapitalize(): string {
        return this.name.toUpperCase()
    } 

    getName = (): string => `${this.name} - ${this.age}`
}
```

Dentro del template añadimos un Description List `dl`:

```html
<dl>
    <td>Nombre:</td>
    <dd>{{ name }}</dd>
    
    <td>Edad:</td>
    <dd>{{ age }}</dd>
    
    <td>Función:</td>
    <dd>{{ getName() }}</dd>
    
    <td>Capitalizado:</td>
    <dd>{{ nameCapitalize }}</dd>
</dl>
```

## Concepto de *"One way data binding"* (enlazado de una sola vía)

One way data binding es un concepto en el que podemos cambiar aspectos del template desde la lógica, pero no podemos hacerlo en vía contraria, desde el template hasta la lógica. Un ejemplo de One way data binding sería lo siguiente:

Nuestro componente plantea 2 métodos para cambiar 2 propiedades de la clase, y esto a su vez hará que se actualicen los valores mostrados en el template:

```ts
export class HeroComponent {
    ...
    changeName = (): void => {this.name = 'Spider-Man'}
    changeAge = (): void => {this.age = 22}
}
```

Nuestro template solo llamará los métodos mediante dos botones con sus eventos `click`:

```html
<button (click)="changeName()">Cambiar Heroe</button>
<button (click)="changeAge()">Cambiar Edad</button>
```

## Crear componente de manera automática

Vamos a usar una de las directivas de ng para crear componentes de manera automática. Podemos escribir el comando `ng generate component <directorio/nombre-componente>` o más simple `ng g c <directorio/nombre-componente>`. Lo anterior crea un directorio con los archivos para hojas de estilo, template, test y lógica con TS. Además dentro del archivo `app.module.ts` actualiza las declaraciones.

## Directiva `*ngFor`

Cuando tenemos un arreglo dentro de nuestro componente, podemos recorrerlo en el template mediante `*ngFor`, el cual semeja un ciclo for.

```ts
export class ListComponent {
    heroes: string[] = [
        'Spider-Man', 
        'Iron Man', 
        'Hulk', 
        'Thor', 
        'Hawkeye'
    ]
}
```

```html
<ul>
    <li *ngFor="let hero of heroes; let i = index">
        {{ i + 1 }}. {{ hero }}
    </li>
</ul>
```

También podemos crear un boton que elimine al primer héroe de la lista, pero lo añada a una nueva lista de héroes eliminados.

Nuestro template se va a ver así

```html
<ul>
    <li *ngFor="let hero of heroes; let i = index">
        {{ i + 1 }}. {{ hero }}
    </li>
</ul>

<button (click)="deleteFirstHero()">Borrar Héroe</button>

<h3>Listado de Héroes borrados</h3>

<ul>
    <li *ngFor="let hero of heroesDelete; let i = index">
        {{ i + 1 }}. {{ hero }}
    </li>
</ul>

<button (click)="restoreHeroes()">Restaurar Todos los Héroes</button>
```

Y la lógica de nuestro componente se puede ver así:

```ts
export class ListComponent {
    heroes: string[] = [
        'Spider-Man',
        'Iron Man',
        'Hulk',
        'Thor',
        'Hawkeye'
    ]

    heroesDelete: string[] = []

    lenHeroes: number = this.heroes.length
    n: number = 0

    deleteFirstHero = (): void => {
        if (this.n < this.lenHeroes) {
            const heroDelete = this.heroes.shift() ?? ''
            this.heroesDelete.push(heroDelete)
            this.n += 1
        }
    }

    restoreHeroes = (): void => {
        while (this.n > 0) {
            const heroRestore = this.heroesDelete.shift() ?? ''
            this.heroes.push(heroRestore)
            this.n -= 1
        }
    }
}
```

## Directiva `*ngIf`

Vamos a ocultar los elementos de Heroes borrados en el template mientras no se elimine a ninguno, o por lo contrario que no se muestre la sección de listado de heroes si no hay ninguno en su lista.

Vamos a usar `*ngIF` para evaluar las condiciones:

```html

<div *ngIf="heroes.length !== 0">
    <h3>Listado de Héroes</h3>
    ...
</div>

<div *ngIf="heroesDelete.length !== 0">
    <h3>Listado de Héroes borrados</h3>
    ...
</div>
```

## Ng-Template y ngIf-else

`ng-template` es un selector que muestra contenido basado en una condición o referencia. Una referencia local se identifica por un hashtag antes de la referencia. Por ejemplo queremos mostrar un mensaje cuando no haya héroes disponibles, para ello usamos el `else` para que se encargue de usar la referencia:

```html
<div *ngIf="heroes.length !== 0; else withoutHeroes">
    <h3>Listado de Héroes</h3>
    ...
</div>

<ng-template #withoutHeroes>
    <h3>Sin heroes disponibles</h3>
</ng-template>
```

## Modulos

Los modulos son muy buena idea cuanto trabajos con un proyecto muy grande. Dentro del directorio de `heroes` vamos a crear un archivo llamado `heroes.module.ts`. Dentro de este archivo vamos a llamar al decorador `@NgModule`, en el cual configuramos cuales van a ser las declaraciones de componentes que posee nuestro archivo. También especificamos cual va a ser el componente al que podemos acceder desde el componente global, y además importamos `CommonModule` (Más adelante se explica).

```ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core'
import { HeroComponent } from './hero/hero.component';
import { ListComponent } from './list/list.component';


@NgModule({
    declarations: [
        HeroComponent,
        ListComponent
    ],
    exports: [
        ListComponent
    ],
    imports: [
        CommonModule
    ],
})
export class HeroesModules { }
```

Ahora, dentro del archivo de `app.module.ts` eliminamos las declaraciones que habíamos hecho del componente de Héroe y el Listado y dentro de las importaciones, llamamos el modulo que acabamos de crear llamado `HeroesModules`

```ts
...
import { HeroesModules } from './components/heroes/heroes.module';

@NgModule({
    declarations: [
        AppComponent,
        CounterComponent
    ],
    imports: [
        BrowserModule,
        HeroesModules
    ],
    ...
})
export class AppModule { }
```

`CommonModule` es importante para cuando dentro de nuestro de modulo usamos directivas como `*ngFor`, `*ngIf`, entre otras. Este modulo exporta todas las directivas básicas de Angular, como las mencionadas anteriormente.

Dentro de mi proyecto tengo una carpeta llamada `componentes`, por lo que voy a modularizar su contenido. El archivo `components.module.ts` se vera de la siguiente manera:

```ts
import { NgModule } from "@angular/core";
import { CounterModule } from "./counter/counter.module";
import { HeroesModules } from "./heroes/heroes.module";

@NgModule({
    imports: [
        CounterModule,
        HeroesModules
    ],
    exports: [
        CounterModule,
        HeroesModules
    ]
})
export class ComponentsModule {}
```

El archivo `app.module.ts` se verá finalmente de la siguiente manera:

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        ComponentsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
```
