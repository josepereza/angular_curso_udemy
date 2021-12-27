# Sección 9: Continuación aplicación de Países - Sugerencias, debounce y más

Aquí continuaremos la aplicación de países, pero enfocados en la parte de las sugerencias y auto-completado, este es un breve listado de los temas fundamentales:

- ngClass y diferentes formas de manipular clases
- CSS condicionales
- Optimizaciones a peticiones HTTP
- Animaciones de CSS
- Auto-completado en la búsqueda de países

No es una sección muy larga, pero dejaremos las bases de cómo funciona un auto-completado en general.

## Continuación del proyecto - PaísesApp

Tomamos como base el proyecto de la sección anterior, pero en este caso necesitamos instalar los paquete de node_modules con el comando `npm install` y levantamos el servidor con el comando `ng serve -o` lo que abre una nueva pestaña una vez compile el proyecto.

## `class`, `[class]` y `[ngClass]`

Dentro de nuestro componente de `ByRegionComponent` vamos a manejar un arreglo con las regiones que se nos muestran en la API. Creamos un botón por cada elemento mediante el `*ngFor`. Cada que seleccionamos una región, se muestra cual región esta activa o seleccionada:

```ts
export class ByRegionComponent {
    public regions: string[] = ['africa', 'america', 'asia', 'europe', 'oceania']
    public activeRegion: string = ''
    ...
    activateRegion(region: string) {
        this.activeRegion = region
    }
}
```

Nuestros botones van a tener una clase CSS establecida con el atributo `class`:

```html
<h3>Buscar por región <small>{{ activeRegion | titlecase }}</small></h3>
<hr>

<h5>Seleccione la región:</h5>
<div class="row">
    <div class="col">
        <button 
            *ngFor="let region of regions" 
            (click)="activateRegion(region)"  
            class="btn btn-outline-primary mx-3"
        >
            {{ region }}
        </button>
    </div>
</div>
```

Nosotros podemos poner una clase de manera condicional cuando un valor sea verdadero. Por ejemplo queremos añadir una clase a los botones cuyo valor sea igual a la región activa. Para ello vamos a usar `[class.<nombre de la clase>]="condición"`:

```html
<button 
    *ngFor="let region of regions" 
    (click)="activateRegion(region)"  
    class="btn btn-outline-primary mx-3" 
    [class.btn-primary]="region === activeRegion"
>
    {{ region }}
</button>
```

Pero esto aún tiene un inconveniente y es que mantiene la clase anterior, lo que puede entrar en conflicto visual.

Otra manera para poner una clase de manera condicional sería mediante `[ngClass]`, el cual recibe un objeto con la llave siendo el nombre de la clase, y el valor siendo la condición a evaluar. El inconveniente es que hace la evaluación por cada propiedad, lo cual puede resultar en una perdida de rendimiento:

```html
<button 
    *ngFor="let region of regions" 
    (click)="activateRegion(region)"  
    class="btn btn-outline-primary mx-3" 
    [ngClass]="{
        'btn-primary': activeRegion === region,
        'btn-outline-primary': region !== activeRegion
    }"
>
    {{ region }}
</button>
```

## Clases de CSS condicionales

La 3 forma de poner clases según una condición, es mediante `[class]` en donde podemos poner un ternario que realice la evaluación y determine que clase poner según la evaluación:

```html
<button 
    *ngFor="let region of regions" 
    (click)="activateRegion(region)"
    class="mx-1 btn"  
    [class]="(region === activeRegion) ? 'btn-primary' : 'btn-outline-primary'" 
>
    {{ region }}
</button>
```

También podemos crear un método dentro de la clase `ByRegionComponent` y llamarlo en lugar el ternario en el template:

```ts
export class ByRegionComponent {
    ...
    getClassCSS = (region: string): string => {
        return (region === this.activeRegion) ? 'btn-primary' : 'btn-outline-primary'
    }
}
```

```html
<button 
    *ngFor="let region of regions" 
    (click)="activateRegion(region)"
    class="mx-1 btn"  
    [class]="getClassCSS(region)" 
>
    {{ region }}
</button>
```

## Mostrar países por región

Vamos a crear un nuevo método dentro de nuestro servicio para hacer la búsqueda por región:

```ts
export class CountryService {
    ...
    searchByRegion = (term: string = ''): Observable<Country[]> => {
        const url = `${this.apiURL}/region/${term}`
        return this.http.get<Country[]>(url)
    }
    ...
}
```

Dentro de nuestro componente `ByRegionComponent` vamos a crear una variable para almacenar los resultados de los países. Además hacemos una inyección de dependencias para usar nuestro servicio y por último, cuando usemos el método para hacer el cambio de una región activa nos vamos a suscribir a la función recien creada del servicio.

```ts
export class ByRegionComponent {
    ...
    public countries: Country[] = []

    constructor(private countryService: CountryService) { }

    activateRegion = (region: string): void => {
        this.activeRegion = region
        this.countryService.searchByRegion(this.activeRegion)
            .subscribe(countries => this.countries = countries)
    }
    ...
}
```

Podemos mejorar el método de activar una región, diciendo que si la región activa es igual a la región que se está recibiendo, entonces no continue con el método, y además podemos purgar el arreglo de países para cada petición:

```ts
export class ByRegionComponent {
    ...
    activateRegion = (region: string): void => {
        if (this.activeRegion === region) return
        this.countries = []
        this.activeRegion = region
        this.countryService.searchByRegion(this.activeRegion)
            .subscribe(countries => this.countries = countries)
    }
    ...
}
```

## Optimizar las peticiones HTTP

Podemos reducir la cantidad de información que recibimos por parte de la API al usar los filtros que nos ofrece su propia documentación. En nuestro caso necesitamos filtrar el nombre, la capital, el alphaCode o cca2, la bandera y la población para hacer las búsquedas. De lado del componente de ver más si podemos dejar toda la información. Por ejemplo para el método de buscar por región:

```ts
export class CountryService {
    ...
    searchByRegion = (term: string = ''): Observable<Country[]> => {
        const url = `${this.apiURL}/region/${term}?fields=name,capital,cca2,flag,population`
        return this.http.get<Country[]>(url)
    }
    ...
}
```

Si usamos el operador de RxJs llamado `tap` podemos interceptar la respuesta que nos llega antes de la suscripción.

```ts
export class CountryService {
    ...
    searchByRegion = (term: string = ''): Observable<Country[]> => {
        const url = `${this.apiURL}/region/${term}?fields=name,capital,cca2,flag,population`
        return this.http.get<Country[]>(url)
            .pipe(tap(console.log))
    }
    ...
}
```

Podemos hacer más limpio nuestro método si usamos HttpParams para extraer los parámetros de nuestro endpoint.

```ts
export class CountryService {
    ...
    searchByRegion = (term: string = ''): Observable<Country[]> => {
        const params = new HttpParams()
            .set('fields', 'name,capital,cca2,flag,population')
        const url = `${this.apiURL}/region/${term}`
        return this.http.get<Country[]>(url, { params })
    }
    ... 
}
```

Una manera más sencilla de usar los mismos parámetros en todos los métodos es mediante un getter:

```ts
export class CountryService {

    get httpParams() {
        return new HttpParams().set('fields', 'name,capital,cca2,flag,population')
    }
    ...
    searchByRegion = (term: string = ''): Observable<Country[]> => {
        const url = `${this.apiURL}/region/${term}`
        return this.http.get<Country[]>(url, { params: this.httpParams })
    }
    ...
}
```

También podemos hacer algo similar con la url que se debe usar en cada endpoint:

```ts
export class CountryService {
    ...
    getURL = (genre: string, term: string): string => {
        return `${this.apiURL}/${genre}/${term}`
    }
    ...
    searchByRegion = (term: string = ''): Observable<Country[]> => {
        return this.http.get<Country[]>(this.getURL('region', term), { params: this.httpParams })
    }
    ...
}
```

## Animaciones de CSS

Podemos usar la librería Animate.css con sus animaciones en los componentes que se desee.

## Mostrar sugerencias al escribir - autocomplete

Vamos a crear dentro del componente `ByCountryComponent` un arreglo para que almacene los países sugeridos que se obtienen de suscribirse al método de buscar países por termino. Como esta suscripción esta dentro del debounce del input, solo se hace la petición cada 3 segundos, según lo que configuramos:

```ts
export class ByCountryComponent {
    ...
    public countriesSuggested: Country[] = []
    ...
    suggestions = (term: string) => {
        this.isError = false
        this.countryService.searchCountry(term)
            .subscribe({
                next: countries => this.countriesSuggested = countries.splice(0, 3),
                error: error => this.countriesSuggested = []
            })
    }
}
```

Dentro del template recorremos el arreglo de los paises sugeridos y mostramos su nombre.

```html
<ul class="list-group">
    <li class="list-group-item list-group-item-action" *ngFor="let cs of countriesSuggested">
        {{ cs.name.official }}
    </li>
</ul>
```

También podemos hacer que se le de click a la sugerencia y me dirija a la descripción completa del país, mediante `[routerLink]`

```html
<li class="list-group-item list-group-item-action" *ngFor="let cs of countriesSuggested">
    <a [routerLink]="['/country', cs.cca2]" class="nav-link">{{ cs.name.official }}</a>
</li>
```

Podemos hacer que se muestre todos los países que coinciden con el termino de búsqueda:

```html
<li class="list-group-item list-group-item-action" (click)="search(term)">
    <a class="nav-link">Buscar "{{ term }}"</a>
</li>
```

Por último, creamos una variable para mostrar u ocultar las sugerencias, dependiendo del método que se está ejecutando:

```ts
export class ByCountryComponent {
    ...
    public showSuggest: boolean = false
    ...
    search = (term: string): void => {
        this.showSuggest = false
        ...
    }
    suggestions = (term: string) => {
        this.showSuggest = true
        ...
    }
}
```
