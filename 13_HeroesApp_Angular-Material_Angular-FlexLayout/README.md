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
