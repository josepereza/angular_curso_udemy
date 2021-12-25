# Sección 7: GifsApp - Aplicación para buscar imágenes

La sección contendrá nuestra primera aplicación real de Angular, este es un breve listado de los temas fundamentales:

- Modularización de la aplicación
- Estructura de la aplicación de media a gran escapa
- Componentes
- ViewChild
- Servicios
- Historial de búsquedas
- Uso de Api Keys
- LocalStorage
- Peticiones HTTP
- Animaciones mediante css

## Inicio del proyecto - GifsApp

Vamos a crear un nuevo proyecto con el comando `ng new gifsApp`. Vamos a trabajar en modo estricto, sin routing y los estilos se manejaran con CSS. También trabajaremos con Bootstrap v5, copiamos el cdn del CSS y lo pegamos en el archivo `src/index.html` dentro del `head`. Levantamos el proyecto con el comando `ng serve -o`.

## Diseño inicial de nuestra aplicación de Gifs

Vamos a diseñar un pequeño esqueleto de la aplicación dentro del archivo `app.component.html`. Es la estructura básica de como se va a ver nuestra aplicación, luego separaremos la aplicación por modulos:

```html
<div class="d-flex">
    <!-- Sidebar -->
    <div class="bg-dark border-right p-3" id="sidebar">
        <h3 class="text-light">Gifs - App</h3>

        <hr class="text-light" />

        <div class="list-group list-reset">
            <a href="#" class="list-group-item list-group-item-action">Dasboard</a>
        </div>
    </div>

    <!-- Formulario y vista -->
    <div class="container">

        <!-- Form -->
        <div class="row p-3">
            <div class="col">
                <h5>Buscar</h5>
                <input type="text" class="form-control" placeholder="Buscar gifs" />
            </div>
        </div>

        <hr />
        
        <!-- Resultados -->
        <div class="row">
            <div class="col">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eligendi
                repellendus distinctio, laudantium voluptatum expedita aliquam nulla vel
                assumenda beatae excepturi? Quidem, architecto. Illo impedit voluptas
                soluta ipsam atque iste optio?
            </div>
        </div>
    </div>
</div>
```

Tenemos un estilo CSS muy básico dentro de `styles.css`:

```css
html,
body {
    height: 100%;
}

#sidebar {
    height: 100%;
    min-height: 100vh;
    min-width: 200px;
}
```

## Módulo Shared

Vamos a crear un módulo llamado `shared` mediante el comando `ng g m shared`, luego vamos a crear un componente llamado `sidebar` mediante el comando `ng g c shared/sidebar --skip-tests -is` (la última bandera es para que no se generen los estilos). Dentro del decorador `@NgModule` de la clase `SharedModule` vamos a exportar el sidebar:

```ts
@NgModule({
    ...,
    exports: [
        SidebarComponent
    ]
})
export class SharedModule { }
```

Luego, dentro del decorador de la clase `AppModule` vamos a importar el modulo `SharedModule`:

```ts
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

Todo el contendio del sidebar que estaba dentro del archivo `app.component.html` lo enviamos al template `sidebar.component.html` y ahora solo ponemos el selector.

```html
<app-sidebar></app-sidebar>
```

## GifsModule y sus componentes

Lo primero que vamos a hacer es crear un modulo para los modulos con el comando `ng g m gifs` y lo importamos dentro de `AppModule`:

```ts
@NgModule({
    ...,
    imports: [
        ...,
        GifsModule
    ],
    ...
})
export class AppModule { }
```

Necesitamos un componente para la página principal. Vamos a usar el comando `ng g c gifs/gifs-page --skip-tests -is` y exportamos el componente en la clase `GifsModule`:

```ts
@NgModule({
    ...,
    exports: [
        GifsPageComponent
    ]
})
export class GifsModule { }
```

Pasamos el input y la vista del template `app.content.html` al nuevo template `gif-page.component.ts` y en primero ponemos el selector del componente, más una clase de bootstrap:

```html
<app-gifs-page class="container"></app-gifs-page>
```

Vamos a crear un nuevo componente para la búsqueda y otro para los resultados. Usamos primero el comando `ng g c gifs/search --skip-tests -is` y luego `ng g c gifs/results --skip-tests -is`. Ambos componentes se añaden de manera automática dentro del módulo `GifsModule`.

Hacemos lo mismo de copiar el html correspondiente a cada componente del template `gifs-page.component.html` para añadirlo dentro del template de los componentes asignados, y luego hacer el reemplazo con los selectores:

```html
<!-- Form Search -->
<app-search class="row p-3"></app-search>

<hr />

<!-- Resultados -->
<app-results class="row"></app-results>
```

## `@ViewChild` - Obtener referencia a objetos del HTML

Como solo tenemos un input, no vamos a usar FormsModule, pero necesitamos capturar su valor. Lo primero que determinamos es que el texto se envie cada que se pulse la tecla enter, para ello dentro del input usamos el evento `(keyup.enter)` para usar un método:

```html
<input 
    ...
    (keyup.enter)="search()"
/>
```

Luego necesitamos capturar el valor que se ingresa, por lo que usamos una referencia:

```html
<input 
    (keyup.enter)="search(txtSearch.value)"
    #txtSearch
/>
```

Dentro de nuestra clase `SearchComponent` capturamos el valor como string y luego requerimos purgar el input. Podemos hacerlo mediante querySelector, pero esto nos mostrara un error:

```ts
export class SearchComponent {
    search = (term: string) => {
        console.log(term)
        document.querySelector('input').value = ''
    }
}
```

La mejor manera es usando el decorador `@ViewChild` el cual recibe un elemento html y lo guarda dentro de una propiedad:

```ts
import { ElementRef, ViewChild } from '@angular/core';

export class SearchComponent {
    @ViewChild('txtSearch') txtSearch: ElementRef
    ...
}
```

Si nosotros dejamos el elemento así, vamos a ver el siguiente error:

```txt
La propiedad "txtSearch" no tiene inicializador y no está asignada de forma definitiva en el constructor.
```

La manera en que evitamos dicho error es añadiendo un signo de exclamación al final de la propiedad, a esto se se llama *Non-Null assertion operator*, lo que nos permite decir que siempre tendrá algo, que nuestra propiedad no será nula o undefined:

```ts
@ViewChild('txtSearch') txtSearch!: ElementRef
```

En nuestro caso tenemos que la propiedad es de tipo `HTMLInputElement`, por lo que tipamos con la misma a `ElementRef`. Esto nos permite tener en intellisense de nuestra propiedad.

```ts
@ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>
```

Una vez tenemos la referencia a nuestro elemento, podemos obtener su valor, sin necesidad de recibir un parámetro en la función de buscar.

```ts
export class SearchComponent {

    @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>

    search = () => {
        const value = this.txtSearch.nativeElement.value
        console.log(value)
        this.txtSearch.nativeElement.value = ''
    }
}
```

```html
<input 
    type="text" 
    class="form-control" 
    placeholder="Buscar gifs" 
    (keyup.enter)="search()"
    #txtSearch
/>
```

## GifsService

Vamos a almacenar la información que se ingresa en el input dentro de un servicio centralizado. Usaremos el comando `ng g s gifs/services/gifs --skip-tests` para crear el archivo del servicio. Dentro del decorador `@Injectable` hay una propiedad llamada `providedIn: 'root'` que permite que los servicios puedan ser definidos en el bundle de la aplicación, logrando que el servicio sea único y de manera global en el root y evita que se tenga que especificar en los providers.

Vamos a crear un arreglo que almacene un tipo de historial, y también creamos un método getter para devolver su contenido, pero rompiendo la referencia con el arreglo, al retornar un nuevo arreglo, para evitar su modificación accidental en cualquier componente.

```ts
@Injectable({
    providedIn: 'root'
})
export class GifsService {
    private _record: string[] = []

    get record() {
        return [...this._record]
    }
}
```

Ahora vamos a crear un método para guardar el historial de búsqueda, para lo que vamos a pedir por parámetro el valor de búsqueda y luego lo guardamos al inicio del arreglo del historial.

```ts
export class GifsService {
    ...
    searchGifs = (query: string) => {
        this._record.unshift(query)
    }
}
```

Este servicio lo vamos a usar en el componente de la búsqueda, por lo que requerimos hacer una *inyección de dependencias* dentro del constructor de la clase `SearchComponent`, y luego usamos la función dentro del método `search`:

```ts
export class SearchComponent {
    ...
    constructor(private gifsService: GifsService) {}

    search = (): void => {
        const value = this.txtSearch.nativeElement.value
        this.gifsService.searchGifs(value)
        this.txtSearch.nativeElement.value = ''
    }
}
```

Una vez ya podemos agregar la información a nuestro arreglo, debemos consumir el servicio en el sidebar para mostrar los elementos del historial. No debemos hacer importación del servicio dentro del modulo `SharedModule`, puesto que el servicio ya está disponible en el root. Nuevamente hacemos una *inyección de dependencias* dentro del constructor de la clase `SidebarComponent` para acceder a la información del servicio, y también creamos un método getter para obtener el historial.

```ts
export class SidebarComponent {
    get record(): string[] {
        return this.gifsService.record
    }

    constructor(private gifsService: GifsService) { }
}
```

Para renderizar los elementos dentro del template usamos un `*ngFor` para iterar el arreglo:

```html
<a href="#" *ngFor="let r of record" class="list-group-item list-group-item-action">{{ r }}</a>
```

## Controlar el historial de búsquedas

Vamos a controlar que no se ingresen valores vacios a nuestro historial, para ello vamos a validar el método que recibe el valor del input en el `SearchComponent`:

```ts
export class SearchComponent {
    ...
    search = (): void => {
        const value = this.txtSearch.nativeElement.value
        if (value.trim().length === 0) return
        ...
    }
}
```

También vamos a limitar el historial a 10 elementos dentro del método `searchGifs` del servicio:

```ts
export class GifsService {
    ...
    searchGifs = (query: string) => {
        this._record.unshift(query)
        this._record = this._record.splice(0, 10)
    }
}
```

Otra cosa que vamos a validar es que no se ingresen valores repetidos dentro del arreglo, pasando la consulta a minusculas:

```ts
export class GifsService {
    ...
    searchGifs = (query: string = '') => {
        query = query.trim().toLowerCase()
        if (this._record.includes(query)) return
        ...
    }
}
```

Si queremos que visualmente se vea capitalizado los valores del arreglo, usamos un *pipe* dentro del template `sidebar.component.html`:

```html
<a href="#" *ngFor="let r of record" class="list-group-item list-group-item-action">{{ r | titlecase }}</a>
```

## Giphy Api Key - Giphy Developers

Vamos a ingresar a la página [Giphy Developers](https://developers.giphy.com/) y creamos una cuenta o nos logeamos con una ya existente. Luego ingresamos al dashboard y creamos una nueva app. Lo primero es seleccionar que sea API para que no haya un coste economico, luego le damos un nombre y descripción y por último aceptamos terminos y condiciones. Esto finalmente nos genera una API KEY que podemos guardar como variale dentro de nuestro servicio:

```ts
export class GifsService {
    private API_KEY: string = 'UMxyzmG7A4NAsIH4vzodoaeu88tZRouC'
    ...
}
```

El endpoint básico para buscar es `api.giphy.com/v1/gifs/search`. Es importante observar la documentación de los endpoints de la página para conocer la manera en que se deben realizar las consultas.

## Realizar una petición HTPP

Podríamos hacer las peticiones mediante un fetch, pero ya Angular nos ofrece una manera un poco más sencilla. Primero vamos a ir a la clase de `AppModule` para hacer la importación del modulo `HttpClientModule`:

```ts
import { HttpClientModule } from '@angular/common/http'

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

Dentro de nuestro servicio vamos a hacer una inyección de dependencias para usar `HttpClient`:

```ts
export class GifsService {
    ...    
    constructor(private http: HttpClient) { }
}
```

Este modulo de HttpClient trabaja bajo Observables, lo cuales son más "poderosos" que las promesas. Para hacer uso del modulo escribimos lo siguiente:

```ts
export class GifsService {
    ...
    constructor(private http: HttpClient) { }
    
    searchGifs = (query: string = '') => {
        ...
        this.http.get(`https://api.giphy.com/v1/gifs/search?api_key=${this.API_KEY}&q=${query}`)
            .subscribe((res: any) => console.log(res.data))
    }
}
```

## Mostrar los resultados en pantalla

Dentro de nuestro servicio vamos a crear una variable para almacenar los resultados, va a ser de tipo pública, por que no pensamos persistir esa información:

```ts
export class GifsService {
    ...
    public results: any[] = []
    ...
    searchGifs = (query: string = '') => {
        ...
        this.http.get(`https://api.giphy.com/v1/gifs/search?api_key=${this.API_KEY}&q=${query}`)
            .subscribe((res: any) => {
                ...
                this.results = res.data
            })
    }
}
```

Dentro de nuestro componente `ResultsComponent` vamos a hacer una inyección de dependencias de nuestro servicio y a crear un getter para obtener los resultados:

```ts
export class ResultsComponent {
    get results() {
        return this.gifsService.results
    }

    constructor(private gifsService: GifsService) { }
}
```

Dentro de nuestro template vamos a crear tarjetas para cada resultado, usando `*ngFor`:

```html
<div class="row">
    <div class="col-md-4 col-sm-6" *ngFor="let gif of results">
        <div class="card">
            <img [src]="gif.images.downsized_medium.url" [alt]="gif.title" class="card-image-top">
            <div class="card-body">
                <p class="card-text">
                    {{ gif.title }}
                </p>
            </div>
        </div>
    </div>
</div>
```

## Colocando tipado a las peticiones HTTP

Vamos a ingresar a la siguiente página para crear un tipado a partir de la respuesta que nos entrega la API: [QuickType](https://app.quicktype.io/). Si ingresamos a Postman o a Thunder, y enviamos una petición, vamos a obtener un resultado de la data. Dicha respuesta la vamos a copiar y la vamos a pegar dentro de la página antes mencionada. Seleccionamos el lenguaje, en este caso TS y lo configuramos para que solo genere interfaces y procedemos a copiar lo que se genera.

Luego creamos un archivo para almacenar lo copiado, en este caso se va a llamar `gifs/interface/gifs.interface.ts`. Cambiamos el nombre a algunas variables y gurdamos.

Cuando pasamos al observable de la petición http, como este es generico, le asignamos el tipo de lo que acabamos de crear:

```ts
import { SearchGifsResponse } from '../interface/gifs.interface';

export class GifsService {
    ...
    searchGifs = (query: string = '') => {
        ...
        this.http.get<SearchGifsResponse>(`https://api.giphy.com/v1/gifs/search?api_key=${this.API_KEY}&q=${query}&limit=10`)
            .subscribe((res) => {
                console.log(res.data)
                this.results = res.data
            })
    }
}
```

Nuestro arreglo de resultado también debe tener un tipo:

```ts
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
    providedIn: 'root'
})
export class GifsService {
    ...
    public results: Gif[] = []
    ...
}
```

Como ya hemos tipado nuestro servicio, entonces ya podemos tipar el componente de resultados:

```ts
export class ResultsComponent {
    get results(): Gif[] {
        return this.gifsService.results
    }
    ...
}
```

El tipado nos da la ventaja de tener las propiedades dentro del intellisense de VSCode.

## LocalStorage

Existe el Local Storage y el Session Storage. Ambos nos ayudan a guardar información y a que no se pierda cuando se recargue la aplicación. Pero lo que los diferencia es que el Local Storage persiste la información aún despues de cerrar el navegador, función que no tiene el Session Storage. Para guardar en el Local Storage vamos usar el método `setItem()`, el cual recibe un nombre y una cadena de texto:

```ts
export class GifsService {
    ...
    searchGifs = (query: string = '') => {
        ...
        localStorage.setItem('record', JSON.stringify(this._record))
        ...
    }
}
```

El mejor lugar para recuperar la data almacenada en el local storage, es en el constructor de nuestro servicio, ya que este se ejecuta solo al principio de la aplicación. Lo primero que vamos a hacer es verificar si existe un campo en el LocalStorage que almacene nuestro historial. En ese caso nuestro arreglo va a tomar ese valor. Como estamos en un modo estricto de Angular nos mostrara un error: `No se puede asignar un argumento de tipo "string | null" al parámetro de tipo "string". El tipo 'null' no se puede asignar al tipo 'string'.` Para solucionarlo solo agregamos el *Non-Null assertion operator*, es decir, el signo `!`

```ts
export class GifsService {
    ...
    constructor(private http: HttpClient) { 
        if (localStorage.getItem('record')) {
            this._record = JSON.parse(localStorage.getItem('record')!)
        }
    }
    ...
}
```

Una manera más sencilla de hacer lo anterior sería lo siguiente:

```ts
export class GifsService {
    ...
    constructor(private http: HttpClient) { 
        this._record = JSON.parse(localStorage.getItem('record')!) || []
    }
    ...
}
```

## Cargar imágenes automáticamente

Vamos a almacenar los resultados de la última búsqueda dentro del Local Storage. Puede parecer mucha información, pero su peso en realidad no excede de los 100 KB, puesto que hemos limitado a solo 10 resultados. Además en el LocalStorage contamos con 5 MB de almacenamiento.

```ts
export class GifsService {
    ...
    searchGifs = (query: string = '') => {
        ...
        this.http.get<SearchGifsResponse>(`${this.urlBase}&q=${query}&limit=10`)
            .subscribe((res) => {
                ...
                localStorage.setItem('results', JSON.stringify(this.results))
            })
    }
}
```

Para dejar los resultados de la última consulta por defecto al entrar a la página, volvemos a darle valor a nuestra variable desde el constructor:

```ts
export class GifsService {
    ...
    constructor(private http: HttpClient) {
        ...
        this.results = JSON.parse(localStorage.getItem('results')!) || []
    }
    ...
}
```

## Obtener imágenes desde el sidebar

Para obtener los resultados desde el sidebar, necesitamos añadir un evento a la lista de elementos buscados en el template `sidebar.component.html`:

```html
<a href="#" *ngFor="let r of record" (click)="search(r)" class="list-group-item list-group-item-action">{{ r | titlecase }}</a>
```

Dentro de la clase `SidebarComponent` añadimos la funcionalidad del método:

```ts
export class SidebarComponent {
    ...
    search(item: string) {
        this.gifsService.searchGifs(item)
    }
}
```

Por último le debemos dar una pequeña refactorización a la lógica del método de nuestro servicio:

```ts
export class GifsService {
    ...
    searchGifs = (query: string = '') => {
        query = query.trim().toLowerCase()
        if (!this._record.includes(query)) {
            this._record.unshift(query)
            this._record = this._record.splice(0, 10)
            localStorage.setItem('record', JSON.stringify(this._record))
        }
        ...
    }
}
```

## `HttpParams`

Vamos a determinar los parámetros de busqueda de nuestra aplicación, para ello creamos una constante con los parámetros:

```ts
export class GifsService {
    ...
    searchGifs = (query: string = '') => {
        ...
        const params = new HttpParams()
            .set('api_key', this.API_KEY)
            .set('limit', '10')
            .set('query', query)
        ...
    }
}
```

Luego vamos a definir una constante con la url base y la usamos en nuestro método, junto a un objeto que serán nuestro parámetros:

```ts
export class GifsService {
    ...
    private urlBase: string = `https://api.giphy.com/v1/gifs`
    ...
    searchGifs = (query: string = '') => {
        this.http.get<SearchGifsResponse>(`${this.urlBase}/search`, { params })
            ....
    }
}
```

## Animate.style CSS

Vamos a copiar el CDN de [Animate.css](https://animate.style/) y lo vamos a pegar en el head del archivo `index.html`. Por ejemplo, cuando mostramos los resultados, podemos poner una animación de animated.css:

```html
<div class="col-md-4 col-sm-6 animate__animated animate__fadeInUp" *ngFor="let gif of results">
    ...
</div>
```
