# Sección 8: SPA - PaísesAPP

Este es un breve listado de los temas fundamentales:

- Rutas
- RouterLink y RouterLinkActive
- Componentes especializados
- DebounceTime
- Inputs
- SwitchMaps
- Consumo de APIs
- Tipado de datos
- Menú de aplicación
- Y más

En esta sección daremos los fundamentos de una aplicación SPA (Single Page Application), y luego, las seguiremos haciendo pero mediante carga perezosa (lazyload), esta es otra aplicación real que nos enseñara mucho de cómo funciona Angular y como la información fluye en ella.

## Inicio del proyecto

Vamos a crear un nuevo proyecto con el comando `ng new paises-app`. Dejamos el modo estricto, aun no vamos a usar el generador de rutas y seleccionamos CSS. Vamos a usar el servicio de [REST Countries](https://restcountries.com/). Para lanzar el proyecto usamos el comando `ng serve -o`

## Estructura y explicación de la aplicación de países

Primero vamos a vaciar el archivo `app.component.html` y vamos a copiar el CDN del CSS de Bootstrap y el CDN de Animate.css dentro del head del archivo `index.html`:

```html
<!-- CSS Bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

<!-- Animate.css -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
```

Vamos a crear un modulo llamado `Shared`, en el que vamos a incluir los componentes que se pueden reutilizar, como un footer, un sidebar, un header. También vamos a crear otro modulo llamado `Countries` en que tendremos las interfaces, las páginas, los componentes y los servicios que estén por completo relacionado con los países. En este proyecto tendremos este árbol de directorios dentro de nuestra carpeta `src`:

```txt
- src
    - app
        - countries
            - components
            - interfaces
            - pages
            - services
        - shared
            - sidebar
```

## Creando los módulos y los componentes básicos

Vamos a usar Angular CLI para generar los módulos: `ng g m countries` y `ng g m shared`. Dichos modulos los importamos dentro del decorador `@NgModule` de la clase `AppModule`:

```ts
@NgModule({
    ...,
    imports: [
        ...,
        SharedModule,
        CountriesModule
    ],
    ...
})
export class AppModule { }
```

Vamos a generar un componente dentro del módulo de Shared llamado Sidebar, con el comando `ng g c shared/sidebar --skip-tests -is`. Automáticamente se hace la declaración del componente dentro del módulo de Shared. Ahora vamos a crear los componentes de las páginas que están dentro del módulo de Countries. Generamos el componente de países por capital con el comando `ng g c countries/pages/by-capital --skip-tests -is`, buscar país por el nombre `ng g c countries/pages/by-country --skip-tests -is`, países por región `ng g c countries/pages/by-region --skip-tests -is`, y el componente para ver el país de manera independiente `ng g c countries/pages/show-country --skip-tests -is`.

Ahora vamos a analizar que componentes debemos exportar por módulos. Por ejemplo, necesitamos exportar el sidebar para poderlo usar el componente de App:

```ts
@NgModule({
    ...,
    exports: [
        SidebarComponent
    ]
})
export class SharedModule { }
```

También vamos a exportar los componentes de las páginas de los países:

```ts
@NgModule({
    ...,
    exports: [
        ByCapitalComponent,
        ByCountryComponent,
        ByRegionComponent,
        ShowCountryComponent
    ]
})
export class CountriesModule { }
```

## Estructura HTML de nuestra aplicación

Dentro del archivo `app.component.html` vamos a determinar más o menos como se ha de ver nuestra aplicación:

```html
<div class="row container mt-3">
    <div class="col-3">
        <h2>Búsquedas</h2>
        <hr>
        <ul class="list-group">
            <li class="list-group-item active">Buscar país</li>
            <li class="list-group-item">Por región</li>
            <li class="list-group-item">Por capital</li>
        </ul>
    </div>

    <div class="col">
        <h2>Por capital</h2>
        <hr>
        <app-by-capital></app-by-capital>
    </div>
</div>
```

## RoutesModule - Rutas de nuestra aplicación

Como es la primera vez que hacemos routing, vamos a hacer el proceso de manera manual. Creamos dentro del directorio del componente `app` un archivo llamado `app-routing.module.ts` y seguimos la estructura básica de un módulo:

```ts
import { NgModule } from "@angular/core";

@NgModule({
    imports: [],
    exports: []
})
export class AppRoutingModule {}
```

Vamos a crear un arreglo con objetos que definen nuestros paths. Las propiedades que vamos a usar son el path, el componente a usar por ruta y la coincidencia con el path (este último esta por defecto en `prefix` por lo que va a buscar coincidencias con los prefijos de la ruta, los cambiamos a `full` para que haga match con la ruta completa). En caso de que necesitamos un parámetro para buscar, por ejemplo un país en especifico, usamos la nomenclatura `:elementoABuscar`:

```ts
import { Routes } from "@angular/router";

const routes: Routes = [
    { path: '', component: ByCountryComponent, pathMatch: 'full' },
    { path: 'region', component: ByRegionComponent },
    { path: 'capital', component: ByCapitalComponent },
    { path: 'country/:id', component: ShowCountryComponent },
]
```

En caso de que el usuario no ingrese a ninguna de las rutas anteriores, lo redireccionamos a la primera ruta, o podemos mostrar un componente nuevo:

```ts
const routes: Routes = [
    ...,
    { path: '**', redirectTo: '' }
]
```

Necesitamos importar un modulo llamado `RouterModule` para configurar las rutas y también exportar dicha configuración:

```ts
import { RouterModule } from "@angular/router";

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
```

Para usar este módulo lo debemos importar dentro de `AppModule`:

```ts
@NgModule({
    ...,
    imports: [
        ...,
        AppRoutingModule,
        ...
    ],
    ...
})
export class AppModule { }
```

Dentro del template del componente App vamos a usar un selector que nos genera RouterModule llamado `router-outlet`:

```html
<div class="row container mt-3">
    ...

    <div class="col">
        <router-outlet></router-outlet>
    </div>
</div>
```

## RouterLink

Si usamos un anchor tag (`<a>`), podemos redirigir mediante un enlace, pero esto genera un Full Refresh. En vez de ello podemos uar una propiedad que nos brinda `RouterModule` llamada `routerLink`, el cual nos lleva al path que necesitamos sin refrescar el navegador, además de que contamos con la propiedad `routerLinkActive` para darle una clase al enlace en el momento en que esté activo:

```html
<div class="row container mt-3">
    <div class="col-3">
        ...
        <ul class="list-group">
            <li routerLink="" routerLinkActive="active" class="list-group-item">Buscar país</li>
            <li routerLink="region" routerLinkActive="active" class="list-group-item">Por región</li>
            <li routerLink="capital" routerLinkActive="active" class="list-group-item">Por capital</li>
        </ul>
    </div>
    ...
</div>
```

Pero se presenta un "error", porque mantiene como activo el elemento que lleva al path principal. Necesitamos definir el valor de un argumento llamado `routerLinkActiveOptions` para que detecte la ruta exacta y no solo el subfijo:

```html
<li routerLink="" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="list-group-item">Buscar país</li>
```

## Componente Sidebar

Vamos a mover las opciones de enlaces al componente del Sidebar, y a usar solo el selector dentro del template de App:

```html
<div class="row container mt-3">
    <app-sidebar class="col-3"></app-sidebar>

    <div class="col">
        <router-outlet></router-outlet>
    </div>
</div>
```

Cuando movemos los enlaces al nuevo componente y tratamos de usar `routerLink`, `routerLinkActive` o `routerLinkActiveOptions` nos muestra el siguiente error: `Can't bind to 'routerLinkActiveOptions' since it isn't a known property of 'li'.`. Para solucionarlo simplemente debemos importar la configuración de RouterModule a nuestro modulo Shared:

```ts
import { RouterModule } from '@angular/router';

@NgModule({
    ...,
    imports: [
        ...,
        RouterModule
    ],
    ...
})
export class SharedModule { }
```

También podemos definir que los elementos `li` del sidebar tengan un cursor específico para mostrar que son enlaces:

```ts
@Component({
    ...,
    styles: [
        `
            li {
                cursor: pointer;
            }   
        `
    ]
})
export class SidebarComponent {...}
```

## Componente para buscar por país

Vamos al template de `by-country.componente.html` y creamos un pequeño formulario para buscar un país por el nombre, también definimos la estructura en caso de que nos encuentre ningún resultado por el término de búsqueda o la tabla con los resultados. Para nuestro formulario vamos a usar FormModule, por lo que lo importamos en la clase `CountryModule`:

```ts
import { FormsModule } from '@angular/forms';

@NgModule({
    ...,
    imports: [
        CommonModule,
        FormsModule
    ],
    ...
})
export class CountriesModule { }
```

Dentro de nuestro input de la template vamos a asociar un `[(ngModel)]` con una propiedad en el componente `ByCountryComponent`, y al formulario le asignamos un `(ngSubmit)` con una función:

```html
<form (ngSubmit)="search()" autocomplete="off">
    <input type="text" name="term" [(ngModel)]="term" placeholder="Buscar país..." class="form-control">
</form>
```

```ts
export class ByCountryComponent {
    public term: string = ''
    
    search = (): void => console.log(this.term)
}
```

## Servicio para buscar países

Creamos un servicio para hacer la búsqueda de los países. Usamos Angular CLI con el comando `ng g s countries/services/country --skipt-tests`. Es importante recordar que el servicio se va a proveer en toda la aplicación a manera de Singleton, por lo que no necesita de ser importado en ningún módulo, a no ser que sea necesario.

Necesitamos importar el módulo de `HttpClientModule` dentro de `AppModule`, para poderlo usar en cualquier otro lugar de nuestra aplicación:

```ts
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    ...,
    imports: [
        BrowserModule,
        HttpClientModule,
        ...
    ],
    ...
})
export class AppModule { }
```

Luego, en nuestro servicio hacemos una inyección de dependencias para HttpClient:

```ts
import { HttpClient } from '@angular/common/http';

...
export class CountryService {
    ...
    constructor(private http: HttpClient) { }
    ...
}
```

Vamos a crear una función para buscar un país y que me retorne un Observable de tipo any al que se debe subscribir el componente que lo use, no directamente el servicio:

```ts
import { Observable } from 'rxjs';

...
export class CountryService {
    ...
    searchCountry = (term: string = ''): Observable<any> => {
        const url = `${this.apiURL}/name/${term}`
        return this.http.get(url)
    }
}
```

Volvemos al componente de `ByCountryModule`, inyectamos la dependencia del servicio y nos subscribimos al método del servicio dentro del método del componente.

```ts
import { CountryService } from '../../services/country.service';

...
export class ByCountryComponent {
    ...
    constructor(private countryService: CountryService) { }

    search = (): void => {
        this.countryService.searchCountry(this.term)
            .subscribe(res => console.log(res))
    }
}
```

## Manejo de errores

Cuando hacemos una petición al servidor y nos responde con un 404, queremos mostrar un div con una alerta. Para ello creamos una variable boleana que nos sirva de bandera para saber cuando hay un error. Cuando hacemos el subscribe al método del servicio vamos a capturar la respuesta, o en caso contrario, el error, en ese caso ponemos nuestra bandera en true.

```ts
export class ByCountryComponent {
    ...
    public isError: boolean = false
    ...
    search = (): void => {
        this.isError = false
        this.countryService.searchCountry(this.term)
            .subscribe({
                next: res => { },
                error: error => this.isError = true
            })
    }
}
```

Dentro de nuestro template vamos a usar un `*ngIf` para validar nuestra bandera y mostrar el div dependiendo el resultado. Aunque, cuando escribimos un término que no existe y volvemos a modificar nuestro input sin hacer enter, da la falsa impresión de que lo que estamos escribiendo en el momento es lo que no existe. Más adelante lo vamos a corregir. También usamos el `*ngIf` para mostrar o no la tabla:

```html
<div *ngIf="isError" class="alert alert-danger">No se encontro nada con el término "{{ term }}"</div>

<div *ngIf="!isError" class="row">...</div>
```

Otra manera de atrapar el error y retornar un valor por defecto, es mediante los operadores de `rxjs` dentro del método del servicio. (Lo siguiente no se aplicó en el proyecto, solo es explicación). Cuando hacemos la petición http concatenamos el método `pipe`, dentro del que usamos la función `catchError` de rxjs para capturar cualquier error. En caso de que se encuentre, por medio de `of()` convertimos en Observable un arreglo para la respuesta. Esto hace que nuestra petición siempre tenga una respuesta pero nuestra bandera de error aún no se activa:

```ts
import { catchError, Observable, of } from 'rxjs';

export class CountryService {
    ...
    searchCountry = (term: string = ''): Observable<any> => {
        ...
        return this.http.get(url)
            .pipe(catchError(error => of([])))
    }
}
```

## Tipado de la petición de RESTCountries

Siempre en bueno hacer un tipado de los datos que vamos a usar. Nuestro Observable está en este momento de tipo `any` y necesitamos que la respuesta tenga un tipo determinado. Vamos a usar POSTMAN para copiar una de las respuestas que el servidor nos muestra por nombre y luego vamos a pegarla en QuickType para poder transformarla en interfaces de TypeScript. Por medio manual o con Angular CLI con el comando `ng g i countries/interfaces/country`, creamos un archivo para almacenar nuestras interfaces.

Dentro de nuestro servicio ya podemos definir el tipo del método que busca el o los países:

```ts
export class CountryService {
    ...
    searchCountry = (term: string = ''): Observable<Country[]> => {
        ...
        return this.http.get<Country[]>(url)
    }
}
```

## LLenar la tabla de los países

Lo primero que hacemos es crear un arreglo que pueda almacenar la información que llega de la suscripción al método del servicio.

```ts
export class ByCountryComponent {
    ...
    public countries: Country[] = []
    ...
    search = (): void => {
        ...
        this.countryService.searchCountry(this.term)
            .subscribe({
                next: countries => {
                    this.countries = countries
                },
                error: error => {
                    this.isError = true
                    this.countries = []
                }
            })
    }
}
```

Luego, dentro del template del componente, en el cuerpo de la tabla usamos un `*ngFor` para recorrer el arreglo y poder extraer lo datos que necesitamos por columna:

```html
<tbody>
    <tr *ngFor="let country of countries; let i = index">
        <th>{{ i + 1 }}</th>
        <th><img [src]="country.flags.png" class="small-flag" alt=""></th>
        <th>{{ country.name.official }}</th>
        <th>{{ country.population | number }}</th>
        <th><a [routerLink]="['/country', country.cca2]" href="">Ver más</a></th>
    </tr>
</tbody>
```

También es importante que importemos `RouterModule` dentro del modulo de `CountriesModule` para poder usar las funciones de las rutas, ya que en este caso necesitamos construir el path para poder ver más del país:

```ts
@NgModule({
    ...,
    imports: [
        ...,
        RouterModule
    ],
    ...
})
export class CountriesModule { }
```

## Componente Input y Tabla

Vamos a crear un componente nuevo para poder reutilizar la tabla. Usamos el comando `ng g c countries/components/country-table --skip-tests -is`. Dentro del template del nuevo componente copiamos todo el html que se refiere a la tabla, esto nos genera un error porque no reconoce el arreglo a recorrer. Para solucionar el problema del arreglo, creamos una array dentro del componente `CountryTableComponent` que use el decorador `@Input()` y que pueda recibir la data mediante un argumento en el selector.

```ts
export class CountryTableComponent {
    @Input('data') countries: Country[] = []
}
```

```html
<div *ngIf="!isError && countries.length !== 0" class="row">
    <app-country-table [data]="countries"></app-country-table>
</div>
```

También vamos a sacar el Input como un componente nuevo, así que usamos el comando `ng g c countries/components/country-input --skip-tests -is` y movemos todo el contenido del template, además de que creamos una variable y un método vacio para evitar los errores:

```html
<app-country-input></app-country-input>
```

```ts
export class CountryInputComponent {
    public term: string = ''

    search = () => {}
}
```

## Funcionalidad del componente CountryInputComponent

Vamos a usar el decorador `@Output()` para emitir un evento con el valor del termino que se recibe dentro del componente `CountryInputComponent`:

```ts
export class CountryInputComponent {
    @Output() onEnter: EventEmitter<string> = new EventEmitter<string>()
    public term: string = ''

    search = () => this.onEnter.emit(this.term)
}
```

Cuando usemos el selector de este componente vamos a escuchar un evento:

```html
<app-country-input (onEnter)="search($event)"></app-country-input>
```

Como ahora recibimos un parámetro, debemos indicarle a la función del componente donde se usa nuestro selector, que recibar el termino para buscar:

```ts
export class ByCountryComponent {
    ...
    search = (term: string): void => {
        ...
        this.term = term
        ...
    }
}
```

## DebounceTime en el Input

Dentro del componente `CountryInputComponent` vamos a crear otro evento de salida para poder emitir un evento.

```ts
export class CountryInputComponent {
    ...
    @Output() onDebounce: EventEmitter<string> = new EventEmitter()
    ...
}
```

Creamos una variable para inicializar un tipo especial de observable, el cual permite que los valores sean difundidos en en redes a varios Observadores. Los Subjects son como EventEmitters. Cada `Subject` es un observable y un observador. Podemos suscribirnos a un `Subject` y también podemos llamar luego los valores del feed como el valor de error y de completado.

```ts
export class CountryInputComponent {
    ...
    public debouncer: Subject<string> = new Subject()
    ...
}
```

Necesitamos implementar la interfaz `OnInit` con su método `ngOnInit()` el cual se ejecuta solo 1 vez cada que se lanza el componente. Dentro de dicho componente usamos una conexión con una función de `rxjs` llamada `debounceTime()`, la cual emite una notificación del evento observado luego de cierta cantidad de tiempo entre emisión y emisión. En este caso queremos que emita el evento de `onDebounce` cada 3 segundos.

```ts
export class CountryInputComponent implements OnInit {
    ...
    ngOnInit(): void {
        this.debouncer
            .pipe(debounceTime(300))
            .subscribe(value => this.onDebounce.emit(value))
    }
    ...
}
```

El evento será escuchado cada que se ingrese un nuevo valor en el input, por lo que necesitamos crear una función para usar observable difundido.

```ts
export class CountryInputComponent implements OnInit {
    ...
    keyPressed = () => this.debouncer.next(this.term)
}
```

Dentro del template usamos el evento `input` para que invoque el método anterior.

```html
<input ... (input)="keyPressed()" ...>
```

En los componentes donde usemos el selector para el input, además de escuchar el evento `onEnter`, también deben escuchar el evento `onDebounce` para dar sugerencias:

```html
<app-country-input (onEnter)="search($event)" (onDebounce)="suggestions($event)"></app-country-input>
```

Cuando creamos el método asignado para el evento, logramos quitarnos el error de la falsa alerta cuando ingresabamos un valor luego de una entrada erronea Ahora espera a evaluar cuando se vuelva a enviar la petición.

```ts
export class ByCountryComponent {
    ...
    suggestions = (term: string) => {
        this.isError = false
    }
}
```

## Por Capital

Copiamos el template que teniamos para buscar países por su nombre, dentro del template de países por capital, igualmente copiamos sus variables y métodos, pero cambiamos el método del servicio, usando el siguiente método establecido en `CountryService`:

```ts
export class CountryService {
    ...
    searchByCapital = (term: string = ''): Observable<Country[]> => {
        const url = `${this.apiURL}/capital/${term}`
        return this.http.get<Country[]>(url)
    }
}
```

Otra diferencia va a ser que no vamos a manejar sugerencias en este componente, por lo que no escucharemos el evento `onDebounced` del componente Input.

Para diferenciar los placeholders del input en cada componente que se emplea, vamos a usar una variable con el decorador `@Input` para recibir el placeholder:

```ts
export class CountryInputComponent implements OnInit {
    @Input() placeholder: string = ''
    ...
}
```

```html
<form (ngSubmit)="search()" autocomplete="off">
    <input ... [placeholder]="placeholder">
</form>
```

Dentro de los componentes, mandamos quemado un string para dar el placeholder, por ejemplo:

```ts
export class ByCapitalComponent {
    ...
    public placeholder: string = 'Buscar por capital'
}
```

```html
<div class="col">
    <app-country-input [placeholder]="placeholder" (onEnter)="search($event)"></app-country-input>
</div>
```

Otra manera es enviar de manera directa el string por medio del template:

```html
<div class="col">
    <app-country-input placeholder="Buscar por nombre del país" (onEnter)="search($event)"></app-country-input>
</div>
```

## Ver país de manera independiente

Necesitamos suscribirnos a los cambios de la URL, con el fin de poder detectar en que momento se cambia el código del país a mostrar. Lo primero va ser un inyección de dependencias para `ActivateRoute` el que nos brinda un observable de nuestra ruta, y al suscribirnos a ese observable podemos obtener el valor que se pasa por parámetros. (El param `id` viene de definir el valor en nuestras rutas):

```ts
import { ActivatedRoute } from '@angular/router';

export class ShowCountryComponent implements OnInit {

    constructor(private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        this.activatedRoute.params
            .subscribe(({ id }) => console.log(id))
    }
}
```

Creamos un nuevo método en nuestro servicio para buscar por el código alpha que brinda la API, y que retorne retorne un solo elemento de tipo Country:

```ts
export class CountryService {
    ...
    getCountryByCode = (code: string = ''): Observable<Country[]> => {
        const url = `${this.apiURL}/alpha/${code}`
        return this.http.get<Country[]>(url)
    }
}
```

Volvemos a nuestro componente `ShowCountryComponent` y hacemos la inyección de dependencias del servicio, y usamos el método recien creado para hacer la búsqueda por el id recién capturado:

```ts
export class ShowCountryComponent implements OnInit {

    constructor(private activatedRoute: ActivatedRoute, private countryService: CountryService) { }

    ngOnInit(): void {
        this.activatedRoute.params
            .subscribe(({ id }) => {
                this.countryService.getCountryByCode(id)
                    .subscribe(country => console.log(country))
            })
    }
}
```

## RxJs - SwitchMap

Una manera más sencilla de hacer una suscripción a partir de otra suscripción, es mediante el operador `switchMap` de RxJs. Por ejemplo el método anterior lo podemos ver resumido de la siguiente manera:

```ts
import { switchMap } from 'rxjs';

export class ShowCountryComponent implements OnInit {
    ...
    ngOnInit(): void {
        this.activatedRoute.params
            .pipe(switchMap(({ id }) => this.countryService.getCountryByCode(id)))
            .subscribe(res => console.log(res))
    }
}
```

## Terminar la pantalla de ver país

Vamos a crear una variable para almacenar el resultado que obtenemos de la suscripción, y como TS detecta que puede llegar en null o undefined, usamos el *Non-Null assertion operator* para saltarnos el error.

```ts
export class ShowCountryComponent implements OnInit {
    public country!: Country
    ...
    ngOnInit(): void {
        this.activatedRoute.params
            .pipe(switchMap(({ id }) => this.countryService.getCountryByCode(id)), tap(console.log))
            .subscribe(country => this.country = country[0])
    }
}
```

Luego, en el template del componente vamos a poner un div con un `*ngIf` a modo de loading y un `ng-template` una vez haya cargado la información. A partir de allí lo demás es interpolar valores del objeto que se obtiene.
