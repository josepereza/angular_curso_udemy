# Sección 13: HéroesApp - Angular Material & Angular Flex-Layout

Este es un breve listado de los temas fundamentales:

- Angular Material
- Interfaces y tipado
- Pipes personalizados
- Variables de entorno
- Autocomplete de AngularMaterial
- Peticiones HTTP
- JSON-Server
- Angular Flex y Flexbox
- Y más...

Esta sección tiene por objetivo principal aprender a utilizar Angular Material, es la primera de varias secciones donde lo usaremos. Al final del día trabajaremos con muchos componentes de Angular material que les ayudará a ver cualquier otro tipo de paquete modularizado de la misma manera y ustedes sabrán aplicarlo.

En la siguiente sección después de esta, continuaremos la aplicación pero realizaremos un CRUD.

## Continuación del proyecto - HéroesApp

Vamos a seguir empleando el proyecto de la sección pasada. Para instalar los node_modules usamos el comando `npm install`, y para levantar el servidor usamos el comando `ng serve -o` lo cual abre una pestaña nueva una vez se haya compilado el proyecto. Vamos a usar [Angular Material](https://material.angular.io/) y [Angular Flex-Layout](https://www.npmjs.com/package/@angular/flex-layout), este último lo instalamos con el comando `npm i @angular/flex-layout @angular/cdk`. La intención de usar Flex-Layout es por la manera en que Angular Material usa el Grid.

Como en la única parte que vamos a usar Flex-Layout va a ser en el módulo de héroes, entonces debemos hacer la configuración dentro de `HeroesModule`:

```ts

import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    ...,
    imports: [
        ...,
        FlexLayoutModule
    ]
})
export class HeroesModule { }
```

## Material Sidenav, Toolbar e iconos

Vamos a usar el componente Sidenav de Angular Material, para ello hacemos la exportación del módulo dentro de `MaterialDesignModule`:

```ts
import { MatSidenavModule } from '@angular/material/sidenav';


@NgModule({
    exports: [
        MatSidenavModule
    ]
})
export class MaterialDesignModule { }
```

Dentro de `HeroesModule` hacemos las importación del módulo de material design:

```ts
import { MaterialDesignModule } from '../material-design/material-design.module';


@NgModule({
    ...,
    imports: [
        ...,
        MaterialDesignModule
    ]
})
export class HeroesModule { }
```

También hacemos la importación de un componente Toolbar, uno de Botton y otro de Icono en el módulo de Material Design:

```ts
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
    exports: [
        ...,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule
    ]
})
export class MaterialDesignModule { }
```

Todos los componentes anteriores los vamos a usar en el template `home.component-html`:

```html
<mat-sidenav-container fullscreen>
    <mat-sidenav #sidenav mode="push">
        <h1>Sidenav</h1>
    </mat-sidenav>

    <mat-toolbar>
        <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
        </button>
    </mat-toolbar>
</mat-sidenav-container>
```

## Material Navlist

Necesitamos un componente de Lista para nuestro menú, por lo que lo exportamos dentro de `MaterialDesignModule`:

```ts
import { MatListModule } from '@angular/material/list';

@NgModule({
    exports: [
        ...,
        MatListModule,
        ...
    ]
})
export class MaterialDesignModule { }
```

Necesitamos hacer una lista para el menú desplegable de las rutas, cada item se acompaña de un icono y una vez se da click sobre el enlace se cierra el menú:

```html
<mat-nav-list>
    <a routerLink="./list" mat-list-item (click)="sidenav.toggle()">
        <mat-icon mat-list-icon>label</mat-icon>
        <span>Listado de héroes</span>
    </a>
    <a routerLink="./add" mat-list-item (click)="sidenav.toggle()">
        <mat-icon mat-list-icon>add</mat-icon>
        <span>Añadir héroes</span>
    </a>
    <a routerLink="./search" mat-list-item (click)="sidenav.toggle()">
        <mat-icon mat-list-icon>search</mat-icon>
        <span>Buscar héroes</span>
    </a>
</mat-nav-list>
```

Al crear los componentes usamos Angular CLI con una bandera llamada `-is`, es decir *Inline Style*. Esta configuración es ideal para cuando solo queremos hacer unos pocos cambios en el css. Por ejemplo para darle estilo a algunos elementos de nuestro template:

```ts
@Component({
    ...,
    styles: [`
        mat-sidenav { width: 300px; }
        a mat-icon { margin-right: 25px; }
        .container { margin: 25px; }
    `]
})
export class HomeComponent { }
```

Dentro de nuestro toolbar principal, necesitamos un botón para hacer logout y este se debe ubicar al final del toolbar. Primero lo declaramos y luego vamos hacer uso de flex para ubicarlo:

```html
<mat-toolbar color="primary">
    <button mat-icon-button (click)="sidenav.toggle()">
        <mat-icon>menu</mat-icon>
    </button>

    <span class="spacer"></span>
    
    <button mat-stroked-button>
        Logout
    </button>
</mat-toolbar>
```

La clase `.spacer` es nuestra, por lo tanto la configuramos a nuestro gusto:

```css
.spacer { flex: 1 1 auto; }
```

## Héroes Backend - Json-Server

Vamos a usar el paquete JSON Server, el cual lo instalamos con el comando `npm i -g json-server`. Como base de datos vamos a tomar este gist [db.json](https://gist.github.com/Klerith/403c91e61d3c87284beb0dd138619958). Creamos un directorio llamado `heroes-server`, a la par del de nuestro proyecto y copiamos allí dentro la base de datos. Dentro de la consola nos dirigimos a nuestro directorio del server y usamos el comando `json-server --watch db.json`. Esto directamente nos crea 2 endpoints para los usuarios y para los héroes.

Dentro del directorio del proyecto de angular, en `src/assets` copiamos unas imágenes que sirven de referencias para nuestros héroes.

## Héroes Service - Traer información de los héroes

Vamos a crear un nuevo servicio para manipular los datos mediante peticiones Http, para ello usamos el comando `ng g s heroes/services/heroes --skip-tests`. Lo ideal es que siempre nuestro servicios estén disponibles de manera global dentro de nuestra aplicación, pero también le podemos dar un alcance local para un módulo en especifico. En nuestro caso vamos a tener el servicio en manera global y por lo tanto debemos hacer la importación de `HttpClientModule` dentro de `AppModule`:

```ts
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    ...,
    imports: [
        ...,
        HttpClientModule,
        ...
    ],
    ...
})
export class AppModule { }
```

Dentro de nuestro servicio hacemos la inyección de dependencias de `HttpClient`, y además creamos una función para obtener los héroes:

```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class HeroesService {

    constructor(private http: HttpClient) { }

    getHeroes() {
        return this.http.get('http://localhost:3000/heroes')
    }
}
```

Nuestro servicio lo vamos a usar primero dentro del componente `ListComponent`, por lo tanto hacemos inyección de dependencias de nuestro servicio en el constructor de dicha clase, y al iniciar el componente nos suscribimos al método get de `HeroesService`:

```ts
import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styles: [
    ]
})
export class ListComponent implements OnInit {

    constructor(private heroesService: HeroesService) { }

    ngOnInit(): void {
        this.heroesService.getHeroes().subscribe(console.log)
    }
}
```

## Interfaz Héroe

Vamos a copiar la respuesta que obtenemos al usar el endpoint `http://localhost:3000/heroes` y lo vamos a pasar por QuickType para poder hacer el tipado de nuestra aplicación. Creamos el archivo `hero.interface.ts` dentro del directorio de las interfaces del módulo de héroes. Vamos a añadir un campo para las urls de las imágenes.

```ts
export interface Hero {
    id:               string;
    superhero:        string;
    publisher:        Publisher;
    alter_ego:        string;
    first_appearance: string;
    characters:       string;
    alt_img?:         string;
}

export enum Publisher {
    DCComics = "DC Comics",
    MarvelComics = "Marvel Comics",
}
```

Ya podemos darle tipado a nuestra petición dentro del servicio:

```ts
import { Observable } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';

export class HeroesService {
    ...
    getHeroes = (): Observable<Hero[]> => {
        return this.http.get<Hero[]>('http://localhost:3000/heroes')
    }
}
```

Dentro del componente `ListComponent` vamos a crear un arreglo para almacenar los héroes que se obtienen de la suscripción del método del servicio:

```ts
export class ListComponent implements OnInit {
    public heroes: Hero[] = []
    ...
    ngOnInit(): void {
        this.heroesService.getHeroes()
            .subscribe(res => this.heroes = res)
    }
}
```

## Material Card - Flex Layout

Vamos a exportar el módulo Card de Angular Material dentro de `MaterialDesignModule`:

```ts
import { MatCardModule } from '@angular/material/card';


@NgModule({
    exports: [
        ...,
        MatCardModule
    ]
})
export class MaterialDesignModule { }
```

Una vez tenemos importado el módulo de las Cards, podemos usarlo dentro de nuestro template. La estructura que le vamos a dar a nuestras cartas será la siguiente:

```html
<mat-card *ngFor="let hero of heroes">
    <mat-card-header>
        <mat-card-title>{{ hero.superhero }}</mat-card-title>
        <mat-card-subtitle>{{ hero.alter_ego }}</mat-card-subtitle>
    </mat-card-header>

    <img mat-card-image src="assets/heroes/{{hero.id}}.jpg">

    <mat-card-content>
        <h3>{{ hero.publisher }}</h3>
        <p>
            <strong>Primera Aparición:</strong> {{ hero.first_appearance }}
            <br>
            <strong>Personajes:</strong> {{ hero.characters }}
        </p>
    </mat-card-content>

    <mat-card-actions>
        <button mat-raised-button>Leer más</button>
        <button mat-button color="primary">Editar</button>
    </mat-card-actions>
</mat-card>
```

El problema que tenemos en estos momentos es que las imágenes se ven muy grandes. Vamos a usar flex layout. Lo primero será definir mediante el atributo `fxLayout` que se tenga una fila, pero que los elementos que no quepan en pantalla hagan un salto de línea. Luego con `fxFlex` definimos que tanto porcentaje deba tener la tarjeta del tamaño de la fila:

```html
<div fxLayout="row wrap">
    <div fxFlex="25">
        <mat-card *ngFor="let hero of heroes">
            ...
        </mat-card>
    </div>
</div>
```

## Flex Layout - Diferentes resoluciones

Flex Layout permite hacer configuraciones dependiendo de la resolución de la pantalla. Por ejemplo:

```html
<div fxLayout="row wrap" fxLayoutAlign="center" fxLayoutGap="20px">
    <div fxFlex="25" fxFlex.xs="80" fxFlex.sm="60" fxFlex.md="40" fxFlex.lg="20" fxFlex.xl="10" *ngFor="let hero of heroes">
        ...
    </div>
</div>
```

## Tarea - HeroeTarjetaComponent

Vamos a crear un nuevo componente para poder reutilizar la Card que atrapa al héroe. Usamos el comando `ng g c heroes/components/hero-card --skip-tests -is` para crearlo. Dentro de dicho componente vamos a recibir por medio del decorador `@Input()` la información del héroe. Para evitar los errores por espacios vacios, usamos el *Non-Null assertion operator*:

```ts
export class HeroCardComponent {
    @Input() public hero!: Hero
}
```

Luego podemos dentro del template copiar toda la estructura de la tarjeta. Dentro del template `list.component.html` solo debemos usar el selector con la propiedad de la data:

```html
<div fxLayout="row wrap" fxLayoutAlign="center" fxLayoutGap="20px">
    <div fxFlex="25" fxFlex.xs="80" fxFlex.sm="60" fxFlex.md="40" fxFlex.lg="20" fxFlex.xl="10" *ngFor="let hero of heroes">
        <app-hero-card [hero]="hero"></app-hero-card>
    </div>
</div>
```

## Tarea - PipeImagen

Vamos a crear un nuevo pipe con el comando `ng g p heroes/pipes/image-hero --skip-tests`. Este pipe va a retornar un string con la el path o la url de la imagén a renderizar. Durante esta sección y la otra se va a ampliar su funcionalidad.

```ts
import { Hero } from '../interfaces/hero.interface';

@Pipe({
    name: 'imageHero'
})
export class ImageHeroPipe implements PipeTransform {
    transform(hero: Hero,): string {
        return `assets/heroes/${hero.id}.jpg`;
    }
}
```

Dentro del template `hero-card.component.html` vamos a usar el pipe de la siguiente manera:

```html
<!-- <img mat-card-image src="assets/heroes/{{hero.id}}.jpg"> -->
<img mat-card-image [src]="hero | imageHero">
```

## Tarea - Ruta Héroe y Editar Héroe

Vamos a hacer las redirecciones a las páginas respectivas de la ruta de ver más de héroe o para editarlo. Para ello usamos la propiedad `[routerLink]` que nos proporciona Angular en el template:

```html
<button [routerLink]="['/heroes', hero.id]">Leer más</button>
<button [routerLink]="['/heroes/edit', hero.id]">Editar</button>
```

Dentro del componente `HeroComponent` vamos a recibir en la función `ngOnInit()` el id que se está ingresando por parámetro. Primero vamos a hacer inyección de dependencias de `ActivatedRoute`, luego dentro del método implementado en la clase nos suscribimos al atributo `params` de nuestra propiedad `activatedRoute` para observar el id que se captura:

```ts
export class HeroComponent implements OnInit {

    constructor(private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        this.activatedRoute.params
            .subscribe(console.log)
    }
}
```

## Pantalla de Héroe

Como vamos a hacer peticiones a nuestro server, necesitamos hacer un div que se muestre mientras carga la información, por tal razón usamos el módulo `MatProgressSpinnerModule`, el cual exportamos desde el módulo `MaterialDesignModule`.

```ts
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@NgModule({
    exports: [
        ...,
        MatProgressSpinnerModule
    ]
})
export class MaterialDesignModule { }
```

También vamos a usar un pequeño grid-list directo de Angular Material:

```ts
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
    exports: [
        ...,
        MatGridListModule
    ]
})
export class MaterialDesignModule { }
```

Para traer la información de un héroe necesitamos crear un método dentro de nuestro servicio para traer un elemento por su id:

```ts
export class HeroesService {
    public urlBase: string = 'http://localhost:3000/heroes'
    ...
    getHeroeById = (id: string): Observable<Hero> => {
        return this.http.get<Hero>(`${this.urlBase}/${id}`)
    }
}
```

Ya podemos hacer la inyección de dependencias de nuestro servicio, dentro del constructor de la clase `HeroComponent`. También podemos crear una variable para almacenar la data del héroe acompañada del operado *Non-Null Assertion Operator* para determinar que simpre va a traer un valor. Luego en el método de `ngOnInit()` usamos el valor del parámetro obtenido para usar el servicio y obtener un héroe de manera local y posteriormente asignar el valor del mismo a nuestra variable.

```ts
export class HeroComponent implements OnInit {
    public hero!: Hero

    constructor(private activatedRoute: ActivatedRoute, private heroesService: HeroesService) { }

    ngOnInit(): void {
        this.activatedRoute.params
            .pipe(switchMap(({ id }) => this.heroesService.getHeroeById(id)), tap(console.log))
            .subscribe(hero => this.hero = hero)
    }
}
```

Por último, dentro del template creamos una columna del grid para ubicar el spin de carga mientras se carga la información del héroe. Una vez se traiga la información, entonces mostramos el `ng-template` de héroe correspodiente:

```html
<mat-grid-list cols="1" *ngIf="!hero; else divHero">
    <mat-grid-tile>
        <mat-spinner></mat-spinner>
    </mat-grid-tile>
</mat-grid-list>


<ng-template #divHero>
    <pre>
        {{ hero | json }}
    </pre>
</ng-template>
```

## Diseño de la pantalla Héroe

En nuestra pantlla del héroe no le vamos a dedicar mucho tiempo, simplemente necesitamos hacer el esqueleto para mostrar parte de su información y un botón para regresar a la lista de héroes.

```html
<ng-template #divHero>
    <div fxLayout="row" fxLayout.xs="column" fxLayoutGap="30px">
        <div fxFlex="50" fxFlex.xs="100">
            <h1>{{ hero.superhero }} <small>{{ hero.alter_ego }}</small></h1>
            <mat-divider></mat-divider>
            <br>
            <img [src]="hero | imageHero">
        </div>

        <div fxFlex="50" fxFlex.xs="50">
            <h1>{{ hero.publisher }}</h1>
            <mat-divider></mat-divider>
            <mat-list>
                <mat-list-item>{{ hero.first_appearance }}</mat-list-item>
                <mat-list-item>{{ hero.characters }}</mat-list-item>
                <mat-list-item>{{ hero.publisher }}</mat-list-item>
            </mat-list>
            <br>
            <button mat-button color="warn" (click)="goBack()">Regresar</button>
        </div>
    </div>
</ng-template>
```

Para la funcionalidad del botón de regresar necesitamos inyectar la dependencia de `Router` en el constructor del componente:

```ts
export class HeroComponent implements OnInit {
    ...
    constructor(..., private router: Router) { }
    ...
    goBack = () => this.router.navigate(['/heroes/list'])
}
```

## Variables de entorno

Dentro de la carpeta `environments` tenemos 2 archivos para configurar las variables de entorno en producción y en desarrollo. En nuestro caso necesitamos crear una nueva variable de entorno en desarrollo para poder poner la base de la url del backend. Dentro del archivo `environment.ts` añadimos una propiedad al objeto que ya se encuentra, para poner la base del url:

```ts
export const environment = {
    production: false,
    baseUrl: 'http://localhost:3000'
};
```

En el archivo `environment.prod.ts` añadimos la variable de entorno para la url del proyecto backend que ya se encuentra desplegado, en este momento no tenemos un backend en producción, por lo que lo dejo en blanco:

```ts
export const environment = {
    production: true,
    baseUrl: ''
};
```

Dentro de nuestro servicio podemos usar la variable de entorno para poner nuestra url. Importante que se importe el entorno de desarrollo, no el de producción.

```ts
export class HeroesService {
    private baseUrl: string = environment.baseUrl
    public baseEndpoint: string = `${this.baseUrl}/heroes`
    ...
}
```

## Material Autocomplete

Vamos a hacer el buscador de héroes, para ello vamos a implementar el módulo de autocomplete de Material Angular. Dicho modulo también necesita del módulo form-field y del módulo input.

```ts
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    exports: [
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule
        ...
    ]
})
export class MaterialDesignModule { }
```

Neceitamos importar el `FormModule` dentro de `HeroesModule`:

```ts
import { FormsModule } from '@angular/forms';

@NgModule({
    ...,
    imports: [
        ...,
        FormsModule
    ]
})
export class HeroesModule { }
```

Dentro de `SearchComponent` creamos una variable para guardar el término que se ingresa por el input y se captura con el atributo `([ngModel])`:

```ts
export class SearchComponent implements OnInit {
    public term: string = ''
    ...
}
```

```html
<input type="text" placeholder="Pick one" aria-label="Search a superhero" matInput [(ngModel)]="term" [matAutocomplete]="auto">
```

También necesitamos crear un arreglo para almacenar los resultados que coinciden con el término de búsquda, los cuales se recorren dentro de las opciones del autocomplete:

```ts
export class SearchComponent implements OnInit {
    ...
    public heroes: Hero[] = []
    ...
}
```

```html
<mat-autocomplete autoActiveFirstOption #auto="matAutocomplete">
    <mat-option *ngFor="let hero of heroes" [value]="hero">
        {{ hero.superhero }}
    </mat-option>
</mat-autocomplete>
```

Dentro del campo de texto definimos la propiedad `(input)` con un método para hacer la búsqueda:

```html
<input ... (input)="searching()" >
```

En la clase `SearchComponent` hacemos la inyección de dependencias de nuestro servicio y creamos el método que por el momento solo trae a todo los héroes sin hacer un filtro:

```ts
export class SearchComponent implements OnInit {
    ...
    constructor(private heroesService: HeroesService) { }
    ...
    searching = () => {
        this.heroesService.getHeroes()
            .subscribe(heroes => this.heroes = heroes)
    }
}
```

Si en nuestro input seleccionamos alguna de las opciones del autocompletado, entonces aparace la representación `[object Object]` la cual es la representación de pasar un objeto por el método `toString()`.

## Autocomplete - Segunda Parte

Dentro de nuestro servicio necesitamos crear un método para poder hacer el llamado a un endpoint que realice una query en los parámetros, y de ser necesario aplicando un limite de resultados:

```ts
export class HeroesService {
    ...
    getSuggestions = (term: string): Observable<Hero[]> => {
        const params = new HttpParams()
            .set('q', `${term}`)
            .set('_limit', '5')
        return this.http.get<Hero[]>(this.baseEndpoint, { params })
    }
}
```

Dentro de la clase `SearchComponent`, hacemos el llamado del método que acabamos de crear y le enviamos el término que capturamos del `([ngModel])`:

```ts
export class SearchComponent implements OnInit {
    ...
    searching = () => {
        this.heroesService.getSuggestions(this.term)
            .subscribe(heroes => this.heroes = heroes)
    }
}
```

Es importante mencionar que las opciones que aparecen en las sugerencias puede parecer que no tienen relación con lo que se ingresa, por ejemplo que se ingrese la letra B y aparece Flash, esto se debe a que hay atributos dentro de flash que coinciden con la B, como Barry Allen. El backend que estamos usando no tiene filtros tan precisos.

Una vez se hace la selección de una de las opciones de autocomplete, entonces se debe traer la información de héroe seleccionado. Necesitamos hacer uso de la propiedad `(optionSelected)` dentro del autocomplete apuntado a una función que captura el evento del mismo:

```html
<mat-autocomplete ... (optionSelected)="optionSelected($event)">...</mat-autocomplete>
```

Dentro de la clase necesitamos crear una variable para almacenar la información del héroe seleccionado. La función define el tipo del evento que se recibe, del cual obtenemos la información del héroe seleccionado. El término de búsqueda se va a igualar al nombre del superheroe. Luego nos suscribimos a la función del servicio para traer la información completa del héroe por su id.

```ts
export class SearchComponent implements OnInit {
    ...
    public heroSelected!: Hero
    ...
    optionSelected = (event: MatAutocompleteSelectedEvent) => {
        const hero: Hero = event.option.value
        this.term = hero.superhero
        this.heroesService.getHeroeById(hero.id!)
            .subscribe(hero => this.heroSelected = hero)
    }
}
```

## Tarea - Autocomplete cuando no encontró nada

Cuando se ingresa algo que no coincida con elementos dentro de la base de datos, o si se ingresa un valor vacio, no debemos hacer ninguna petición. Además debemos mostrar una opción en caso de que no hayan coincidencias:

```html
<mat-option *ngIf="heroes.length === 0 && term.trim().length > 0" value="">
    No se encontro ningún resultado por el termino "{{ term }}"
</mat-option>
```

Dentro de nuestra clase `SearchComponent` vamos a tener lo siguiente en el método de obtener la información a partir de una opción seleccionada:

```ts
export class SearchComponent implements OnInit {
    ...
    public heroSelected: Hero | undefined
    ...
    optionSelected = (event: MatAutocompleteSelectedEvent) => {
        if (!event.option.value) return
        const hero: Hero = event.option.value
        this.term = hero.superhero
        this.heroesService.getHeroeById(hero.id!)
            .subscribe(hero => this.heroSelected = hero)
    }
}
```

Para mostrar la información de héroe seleccionado, hacemos la validación de que si se haya encontrado y lo mostramos dentro de una terjeta:

```html
<div *ngIf="heroSelected" fxLayout="row wrap" fxLayoutAlign="center">
    <app-hero-card [hero]="heroSelected" fxFlex="50"></app-hero-card>
</div>
```
