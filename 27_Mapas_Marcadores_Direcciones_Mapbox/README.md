# Sección 27: Bonus: Mapas - Marcadores y Direcciones con Mapbox

Esta es una sección agregada al curso después de haber sido concluido, la cual tiene por objetivo enseñar:

- Uso de Mapbox
- Marcadores
- Polylinles
- Rutas
- Direcciones
- Distancias
- Custom Http Clients ( muy útil )
- Y más

Es una aplicación relativamente fácil de seguir, pero tiene un par de interacciones interesantes entre servicios y objetos con librerías que no son soportadas por TypeScript.

## Inicio del proyecto - MapasApp

Vamos a crear una nueva aplicación con el comando `ng new maps-app`. Dejamos el modo estricto, sin routing, y con CSS. Vamos a usar Bootstrap mediante el CDN. Para levantar el proyecto usamos el comando `ng serve -o`.

## Configuraciones iniciales del proyecto

Vamos a crear un módulo con el comando `ng g m maps` e importamos el módulo en `AppModule`:

```ts
import { MapsModule } from './maps/maps.module';

@NgModule({
    ...,
    imports: [
        ...,
        MapsModule
    ],
    ....
})
export class AppModule { }
```

Creamos un componente para las pages o screens con el comando `ng g c maps/screens/maps-screen --skip-tests -is`. Exportamos el componente dentro de `MapsModule`:

```ts
import { MapsScreenComponent } from './screens/maps-screen/maps-screen.component';


@NgModule({
    ...,
    exports: [
        MapsScreenComponent
    ]
})
export class MapsModule { }
```

Y por último llamamos el componente dentro de `app.component.html`:

```html
<app-maps-screen></app-maps-screen>
```

## Obtener la geolocalización del usuario

Necesitamos validar que el navegador soporte la geolocalización, por lo que en el archivo `main.ts` hacemos la siguiente condición:

```ts
if (!navigator.geolocation) {
    alert('Navegador no soporta la geolocalización')
    throw new Error('Navegador no soporta la geolocalización')
}
```

Dentro de Las herramientas de desarrollo de Google Chrome, podemos buscar la configuración de los sensores y establecer una ubicación, o simplemente establecer la opción de No override. Como necesitamos la configuración de la geolocazación a través de nuestra aplicación, creamos un servicio con el comando `ng g s maps/services/places --skip-tests`. Podemos centralizar la exportación de los servicios dentro de un archivo `index.ts` en la carpeta de los servicios:

```ts
export { PlacesService } from './places.service'
```

Nuestro servicio va a tener un arreglo para la localización, y un getter para saber cuando está lista la ubicación del usuario:

```ts
export class PlacesService {
    public userLocation!: [number, number]

    get isUserLocationReady(): boolean {
        return !!this.userLocation
    }
}
```

También se creo un método que retorna una promesa con las coordenadas del usuario. Dicho método siempre se llamará cada que si inyecte el servicio, por lo que referenciamos el método dentro del constructor del servicio. La función consiste en retornar una promesa en la que se obtiene la posición actual mediante el método `getCurrentPosition()` de `navigator.geolocation`. Si recibimos una respuesta exitosa, desestructuramos las coordenadas y actualizamos la ubicación del usuario con la longitud y latitud, las cuales enviamos en ese orden, puesto que Mapbox las requiere así. Luego resolvemos la promesa con las coordenadas del usuario, y en caso de error hacemos un reject.

```ts
export class PlacesService {
    ...
    constructor() {
        this.getUserLocation()
    }

    getUserLocation = async (): Promise<[number, number]> => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    this.userLocation = [coords.longitude, coords.latitude]
                    resolve(this.userLocation)
                },
                (error) => {
                    alert('No se pudo obtener la Geolocation')
                    console.log(error)
                    reject()
                }
            )
        })
    }
}
```

Inyectamos el servicio dentro de `MapsScreenComponent`:

```ts
import { PlacesService } from '../../services';

...
export class MapsScreenComponent {
    constructor(private _placesServices: PlacesService) { }
}
```

Si vamos a nuestro navegador, podemos observar el mensaje que se muestra para conocer la ubicación. En caso de que el navegador o el usuario no permitan dar a conocer la ubicación, entonces se muestra una alerta y no nos deja seguir. Si tenemos instalada la extensión ***Angular DevTools***, podemos observar en las herramientas de desarrollador, que nuestro componente tiene una propiedad del servicio en donde se capturar la ubicación del usuario.

## Mostrar un mensaje de carga

La obtención de la ubicación del usuario es un proceso síncrono, por lo que requerimos un elemento que se muestre mientras se carga la información. Vamos a crear un nuevo componente con el comando `ng g c maps/components/map-view --skip-tests -is` para mostrar el mapa, y otro con el comando `ng g c maps/components/loading --skip-tests -is` para mostrar un elemento de espera.

Dentro del template `loading.component.html` ponemos la siguiente estructura:

```html
<div class="loading-map d-flex justify-content-center align-items-center">
    <div class="text-center alert alert-primary w-25">
        <h3>Espere por favor</h3>
        <span>Localizando...</span>
    </div>
</div>
```

Como tenemos una clase personalizada, la definimos dentro de los estilos inline de `LoadingComponent`:

```ts
@Component({
    ...,
    styles: [`.loading-map {
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        height: 100vh;
        position: fixed;
        right: 0;
        top: 0;
        width: 100vw;
    }`]
})
export class LoadingComponent { ... }
```

Dentro del componente `MapScreenComponent` creamos un getter para saber si ya están cargadas las coordenadas, y de tal manera gestionar el contenido a mostrar:

```ts
export class MapsScreenComponent {
    get isUserLocationReady() {
        return this._placesServices.isUserLocationReady
    }
    ...
}
```

Luego llamamos el selector del loading dentro del template `map-screen.component.html` con la condición de que se muestre si las coordenadas no están listas, en caso contrario muestra un template:

```html
<app-loading *ngIf="!isUserLocationReady; else mapReady"></app-loading>

<ng-template #mapReady>
    <app-map-view></app-map-view>
</ng-template>
```

Dentro de la clase `MapViewComponent` inyectamos nuestro servicio:

```ts
export class MapViewComponent implements OnInit {
    constructor(private _placesService: PlacesService) { }
    ...
}
```

## Mostrar un map de Mapbox

Ingresamos a Mapbox y copiamos el token de acceso que usaremos dentro de nuestra aplicación. Dicho token lo pegamos dentro de los archivos de variables de entorno de la carpeta `environments`:

```ts
export const environment = {
    production: ...,
    tokenMapbox: "pk.eyJ1IjoiY2FybG9zLXBhZXpmIiwiYSI6ImNreTNvNnVtcjAzemUyd21ubmk3c3NpN3AifQ.zVXhWf-evufYvB8_roxkWQ"
};
```

Otra manera, sería hacer la global el token dentro de nuestra aplicación si vamos al archivo `main.ts` y configuramos el token de acceso:

```ts
import mapboxgl from 'mapbox-gl' 


mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9zLXBhZXpmIiwiYSI6ImNreTNvNnVtcjAzemUyd21ubmk3c3NpN3AifQ.zVXhWf-evufYvB8_roxkWQ'
```

Para poder usar un mapa con Mapbox vamos ai instalar el módulo de mapbox con el comando `npm i --save mapbox-gl` y copiamos el CSS de la documentación de Mapbox dentro del archivo `index.html`. En una sección pasada hablamos de que para poder usar librerías que han sido creadas en JS necesitamos darles tipado, y esto lo logramos con el comando `npm i --save-dev @types/mapbox-gl`, luego vamos al archivo `tsconfig.json` y añadimos la siguiente propiedad:

```json
{
    ...,
    "compilerOptions": {
        "allowSyntheticDefaultImports": true,
        ...
    }
    ...
}
```

Dentro del template `map-view.component.html` creamos un div con una clase especifica, dicho div nos servirá luego para crear nuestro mapa. También tendrá una referencia local:

```html
<div #mapDiv class="map-container"></div>
```

En la clase `MapViewComponent` establecemos los estilos inline del div y además implementamos la interfaz `AfterViewInit` en vez de `OnInit` ya que nuestro mapa puede necesitar data que aún no se ha logrado cargar al inicializar el componente:

```ts
@Component({
    selector: 'app-map-view',
    templateUrl: './map-view.component.html',
    styles: [`
        .map-container {
            position: fixed;
            top: 0;
            right: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.8);
        }
    `]
})
export class MapViewComponent implements AfterViewInit {

    constructor(private _placesService: PlacesService) { }

    ngAfterViewInit(): void {
        ...
    }
}
```

Por medio del decorado `@ViewChild()` traemos el div que referenciamos y usamos dentro de la configuración del mapa, junto a las coordenadas del usuario desestructuradas del arreglo que obtenemos mediante el servicio.

```ts
import { Map } from 'mapbox-gl';


...
export class MapViewComponent implements AfterViewInit {
    @ViewChild('mapDiv') public mapDivElement!: ElementRef<HTMLElement>
    ...
    ngAfterViewInit(): void {
        if (!this._placesService.userLocation) throw new Error('No hay coordenadas en el servicio')

        const [lon, lat] = this._placesService.userLocation

        const map = Map({
            container: this.mapDivElement.nativeElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lon, lat],
            zoom: 9
        });
        
    }
}
```

## Marcadores y Popups

Para añadir un marcador con un popup necesitamos importar las clases correspondientes y hacer la siguiente configuración:

```ts
import { Popup, Marker } from 'mapbox-gl';

...
export class MapViewComponent implements AfterViewInit {
    ...
    ngAfterViewInit(): void {
        ...
        const popup = new Popup()
            .setHTML(`
                <h6>Aquí estoy</h6>
                <span>Estoy en este lugar</span>
            `)

        new Marker({
            color: 'red'
        })
            .setLngLat(this._placesService.userLocation)
            .setPopup(popup)
            .addTo(map)
    }
}
```

## Botón flotante y logo de Angular

Vamos a crear un nuevo componente con el comando `ng g c maps/components/btn-my-location --skip-tests -is` y otro con `ng g c maps/components/angular-logo --skip-tests -is`. Dentro de `angular-logo.component.html` copiamos una imagen en base64:

```html
<img
    width="100"
    alt="Angular Logo"
    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg=="
  />
```

Le damos estilo, y por útlimo lo llamamos dentro de `maps-screen.component.html`:

```ts
@Component({
    selector: 'app-angular-logo',
    templateUrl: './angular-logo.component.html',
    styles: [`
        img {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }
    `]
})
export class AngularLogoComponent { }
```

Hacemos el mismo proceso con el botón flotante, pero esté tiene la cualidad de que va a apuntar a una función cuando se le de click, aunque que por el momento es un cascarón. Finalmente llamamos los 2 últimos componentes dentro de `maps-screen.component.html` de la siguiente manera:

```html
<app-loading *ngIf="!isUserLocationReady; else mapReady"></app-loading>

<ng-template #mapReady>
    <app-map-view></app-map-view>
    <app-btn-my-location></app-btn-my-location>
</ng-template>

<app-angular-logo></app-angular-logo>
```

## Servicio para controlar el mapa

Vamos a crear un servicio con el comando `ng g s maps/services/map --skip-tests` y lo exportamos dentro del archivo `index.ts` de los servicios. Este servicio va a tener una propiedad privada para administrar el mapa. Ofrecemos un getter para tener las caracteristicas el mismo, junto a un setter para modificar por un nuevo mapa. También crearmos un método para ir a una coordenada especifica que se pasa por parámetros.

```ts
import { Injectable } from '@angular/core';
import { LngLatLike, Map } from 'mapbox-gl';

@Injectable({
    providedIn: 'root'
})
export class MapService {

    private _map?: Map

    get isMapReady(): boolean {
        return !!this._map
    }

    setMap(map: Map) {
        this._map = map
    }

    flyTo = (coords: LngLatLike) => {
        if (!this.isMapReady) throw new Error('El mapa no esta inicializado');
        this._map?.flyTo({
            zoom: 14,
            center: coords
        })
    }
}
```

Dentro de la clase `MapViewComponent`, en el hook `ngAfterViewInit`, luego de configurar el mapa, popup y marker, seteamos el mapa del servicio por el que acabamos de crear:

```ts
export class MapViewComponent implements AfterViewInit {
    ...
    constructor(..., private _mapService: MapService) { }

    ngAfterViewInit(): void {
        ...
        const map = new Map({...});
        ...
        this._mapService.setMap(map)
    }
}
```

Ahora si procedemos a darle la funcionalidad al botón que nos lleva a nuestra ubicación. Necesitamos inyectar nuestros 2 servicios dentro del constructor y luego validar si tanto las coordenas, como el mapa están listos para poder viajar a nuestra ubicación.

```ts
export class BtnMyLocationComponent {
    constructor(private _mapService: MapService, private _placesService: PlacesService) { }

    goToMyLocation = () => {
        if (!this._placesService.isUserLocationReady) throw new Error('No hay ubicación de usuario')        
        if (!this._mapService.isMapReady) throw new Error('No se ha inicializado el mapa')        

        this._mapService.flyTo(this._placesService.userLocation!)
    }
}
```

## Diseño de componentes de búsqueda y detalles

Vamos a crear 2 nuevos componentes con los comandos `ng g c maps/components/search-bar --skip-tests` y `ng g c maps/components/search-results --skip-tests`. El primero que vamos a diseñar será el la barra de búsqueda:

```html
<div class="search-container">
    <input type="text" class="form-control" placeholder="Search">

    <app-search-results></app-search-results>
</div>
```

```css
.search-container {
    background-color: white;
    border-radius: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1); 
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
    left: 20px;
    padding: 5px;
    position: fixed;
    top: 20px;
    width: 300px;
    z-index: 1000;
}
```

Luego hacemos el esqueleto de los resultados:

```html
<div class="alert alert-primary mt-2 text-center">
    <h6>Cargando...</h6>
    <span>Espere por favor</span>
</div>

<ul class="list-group mt-2">
    <li class="list-group-item list-group-item-action pointer">
        <h6>Lugar</h6>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, delectus illum quas inventore corporis
            libero provident ipsa suscipit vitae recusandae esse ab eum a quidem saepe impedit. Nemo, aliquid
            perspiciatis.</p>
            <button class="btn btn-sm btn-outline-primary">
                Direcciones
            </button>
    </li>
</ul>
```

```css
.pointer {
    cursor: pointer;
}

p {
    font-size: 15px;
}
```

## Debounce Manual

Dentro de la caja de búsqueda vamos a crear una referencia local para poder capturar el valor y enviarlo a una función que se ejecuta cada que se presiona una tecla:

```html
    <input ... #txtQuery (keyup)="onQueryChanged(txtQuery.value)">
```

Luego dentro del componente `SearchComponent` comenzamos a crear el debounce manual:

```ts
export class SearchBarComponent {
    private debounceTimer?: NodeJS.Timeout

    onQueryChanged = (query: string = '') => {
        
    }
}
```

Para que nos reconozca `NodeJS` necesitmos añadir el siguiente tipo tanto dentro de `tsconfig.app.json` como `tsconfig.json`:

```json
{
    ...,
    "compilerOptions": {
        ...,
        "types": [
            "node"
        ]
    },
    ...
}
```

Reiniciamos el servidor y podemos continuar.

La idea del Debounce, es que después de dejar de escribir pase cierto tiempo y ahi si se envia la petición. En nuestro caso queremos que después de escribir espere 0.5 s y se envié la petición:

```ts
export class SearchBarComponent {
    private debounceTimer?: NodeJS.Timeout
    ...
    onQueryChanged = (query: string = '') => {
        if (this.debounceTimer) clearTimeout(this.debounceTimer)
        this.debounceTimer = setTimeout(() => {...}, 500)
    }
}
```

## Realizar petición HTTP para obtener lugares

Necesitamos importar `HttpClientModule` dentro de `AppModule` para poder realizar las peticiones http:

```ts
import { HttpClientModule } from '@angular/common/http'

@NgModule({
    ...,
    imports: [
        ...,
        HttpClientModule
    ],
    ...
})
export class AppModule { }
```

Dentro del servicio `PlacesServices` necesitamos hacer la inyección de `HttpClient` para poder hacer la petición y luego dentro del método para la petición, creamos la url a donde apuntamos con el query, y una instancia de `HttpParams` para poder añadir los parámetros de la búsqueda. Algunas variables de obtienes de las variables de entorno:

```ts
export class PlacesService {
    private _baseURL = environment.urlQuery
    private _accessToken = environment.tokenMapbox
    ...
    constructor(private _http: HttpClient) {
        ...
    }
    ...
    getPlacesByQuery = (query: string = '') => {
        const url = `${this._baseURL}/${query}.json`

        const params = new HttpParams()
            .set('proximity', '-73.990593,40.740121')
            .set('types', 'place,postcode,address')
            .set('language', 'es')
            .set('access_token', this._accessToken)

        this._http.get(url, { params })
            .subscribe(console.log)
    }
}
```

Regresamos a `SearchBarComponent` y hacemos la inyección de nuestro servicio para poder hacer la consulta en base a una query:

```ts
export class SearchBarComponent {
    ...
    constructor(private _placesService: PlacesService) { }

    onQueryChanged = (query: string = '') => {
        if (this.debounceTimer) clearTimeout(this.debounceTimer)
        this.debounceTimer = setTimeout(() => {
            this._placesService.getPlacesByQuery(query)
        }, 500)
    }
}
```

Teniendo la respuesta, podemos hacer una interfaz para luego darle tipado a nuestras respuestas:

```ts
export interface PlacesResponse {
    type:        string;
    query:       string[];
    features:    Feature[];
    attribution: string;
}

export interface Feature {
    id:                   string;
    type:                 string;
    place_type:           string[];
    relevance:            number;
    properties:           Properties;
    text_es:              string;
    place_name_es:        string;
    text:                 string;
    place_name:           string;
    bbox?:                number[];
    center:               number[];
    geometry:             Geometry;
    context:              Context[];
    language_es?:         string;
    language?:            string;
    matching_text?:       string;
    matching_place_name?: string;
}

export interface Context {
    id:           string;
    wikidata?:    string;
    short_code?:  string;
    text_es:      string;
    language_es?: Language;
    text:         string;
    language?:    Language;
}

export enum Language {
    Es = "es",
}

export interface Geometry {
    type:        string;
    coordinates: number[];
}

export interface Properties {
    wikidata?: string;
    accuracy?: string;
}
```

Ya podemos añadir tipado:

```ts
export class PlacesService {
    ...
    getPlacesByQuery = (query: string = ''): Observable<PlacesResponse> => {
        ...
        return this._http.get<PlacesResponse>(url, { params })
    }
}
```

Necesitamos que nuestro servicio nos retorne los 5 elementos de la respuesta dentro de un arreglo, además de que sepamos en que momento está cargando la data:

```ts
export class PlacesService {
    ....
    public isLoadingPlaces: boolean = false
    public places: Feature[] = []
    ...
    getPlacesByQuery = (query: string = ''): Observable<Feature[]> => {
        this.isLoadingPlaces = true

        const url = `${this._baseURL}/${query}.json`

        const params = new HttpParams()
            .set('proximity', '-73.990593,40.740121')
            .set('types', 'place,postcode,address')
            .set('language', 'es')
            .set('access_token', this._accessToken)

        return this._http.get<PlacesResponse>(url, { params })
            .pipe(map(res => {
                this.isLoadingPlaces = false
                return this.places = res.features
            }))
    }
}
```

## Custom Http Client - PlacesApiClient

Vamos a crear un archivo llamado `api/places-api-client.ts` en que creamos un cliente personalizado para poder hacer las peticiones necesarias sobre el backend de Mapbox. Lo primero a saber, es que es un servicio por lo que necesitamos el decorador `@Injectable` y lo proveemos en la raiz del proyecto. Luego heradamos de `HttpClient` y dentro del constructor heredamos todos los métodos y propiedades de `HttpHandler`:

```ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpHandler } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PlacesApiClient extends HttpClient {
    constructor(handler: HttpHandler) {
        super(handler)
    }
}
```

Lo  que prosigue es sobrescribir el método `get` de tipo generico, con el cual recibimos una url que la suamamos a la url que tenemos dentro de las variables de entorno, y hacemos la petición junto con los parámetros que queremos de manera estatica.

```ts
import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";


export class PlacesApiClient extends HttpClient {
    private _accessToken = environment.tokenMapbox
    public baseUrl: string = environment.urlQuery
    ...
    public override get<T>(url: string) {
        url = this.baseUrl + url

        return super.get<T>(url, { params: { 
            types: 'place,postcode,address',
            language: 'es',
            access_token: this._accessToken
        } })
    }
}
```

Ahora bien, queremos otro parámetro para proveer la proximidad, pero no podemos violar la firma del método, por lo tanto necesitamos traer el tipado de los parámetros que se encuentran en las opciones, por lo tanto sacamos de la firma todo el elemento que le da tipado a los parámetros:

```ts
export class PlacesApiClient extends HttpClient {
    ...
    public override get<T>(url: string, options: {
        params?: HttpParams | {
            [params: string]: string | number | boolean | ReadonlyArray<string | number | boolean>
        }
    }) {
        ...
    }
}
```

Por último, pasamos el contenido de nuestro parámetros estaticos, junto a los nuevos parámetros que nos envien al usar el cliente en el servicio

```ts
export class PlacesApiClient extends HttpClient {
    ...
    public override get<T>(url: string, options: {
        params?: HttpParams | {
            [params: string]: string | number | boolean | ReadonlyArray<string | number | boolean>
        }
    }) {
        ...
        return super.get<T>(url, { params: { 
            ...,
            ...options.params 
        } })
    }
}
```

Volvemos a nuestro servicio `PlacesServices` y en vez de usar `HttpClient`, ahora inyectamos nuestro custom client, y cuando lo llamemos en el método, si o si le debemos pasar la url y un nuevo objeto de parámetros:

```ts
export class PlacesService {
    ...
    constructor(private _placesAPI: PlacesApiClient) {
        ....
    }
    ...
    getPlacesByQuery = (query: string = ''): Observable<Feature[]> => {
        if (!this.userLocation) throw new Error('No hay coordenadas del usuario');
        
        this.isLoadingPlaces = true

        const url = `/${query}.json`

        const params = new HttpParams()
            .set('proximity', this.userLocation!.join(','))

        return this._placesAPI.get<PlacesResponse>(url, { params })
            .pipe(map(res => {
                this.isLoadingPlaces = false
                return this.places = res.features
            }))
    }
}
```

## Mostrar los resultados de la búsqueda

Para mostrar los resultados, requerimos inyectar el servicio `PlacesService` dentro del componente `SearchResultsComponent`, y crear métodos get para saber si está cargando la información y obtener los lugares:

```ts
export class SearchResultsComponent {
    get isLoadingPlaces(): boolean {
        return this._placesService.isLoadingPlaces
    }

    get places(): Feature[] {
        return this._placesService.places
    }

    constructor(private _placesService: PlacesService) { }
}
```

Luego, dentro del template, podemos hacer validaciones de estado de carga y de la cantidad de resultados:

```html
<div ... *ngIf="isLoadingPlaces; else results">
    ...
</div>

<ng-template #results>
    <ul ... *ngIf="places.length > 0">
        <li ... *ngFor="let place of places">
            <h6>{{ place.text_es }}</h6>
            <p>{{ place.place_name }}</p>
            ...
        </li>
    </ul>
</ng-template>
```

Para poder ir hasta el lugar de los resultados, necesitamos inyectar el otro servicio y crear un método que se active con el click sobre los resultados. Dicho método debe recibir el lugar para poder obtener las coordenadas del mismo:

```ts
export class SearchResultsComponent {
    ...
    constructor(..., private _mapService: MapService) { }

    flyTo = (place: Feature) => {
        const [lng, lat] = place.center
        this._mapService.flyTo([lng, lat])
    }
}
```

Luego en el template solo resta llamar el método:

```html
<li ... (click)="flyTo(place)">...</li>
```

También podemos hacer la validación para saber cual elemento está seleccionado y cambiar su estilo basado en ello:

```ts
export class SearchResultsComponent {
    public selectedId: string = ''
    ...
    flyTo = (place: Feature) => {
        this.selectedId = place.id
        ...
    }
}
```

```html
<li ... [class.active]="place.id === selectedId">
    ...
    <button ... [ngClass]="(place.id === selectedId) ?  'btn-outline-light' : ' btn-outline-primary'">
        Direcciones
    </button>
</li>
```

En caso de que no haya nada en la caja de búsqueda, entonces no se hace ninguna petición:

```ts
export class PlacesService {
    ...
    getPlacesByQuery = (query: string = ''): Observable<Feature[]> | undefined => {
        if (query.trim().length === 0) {
            this.places = []
            this.isLoadingPlaces = false
            return
        }
        ...
    }
}
```

Es importante mencionar que dentro de `SearchBarComponent` debemos suscribirnos al método de la siguiente manera:

```ts
export class SearchBarComponent {
    ...
    onQueryChanged = (query: string = '') => {
        ...
        this.debounceTimer = setTimeout(() => {
            this._placesService.getPlacesByQuery(query)
                ?.subscribe()
        }, 500)
    }
}
```

## Agregar marcadores en los lugares encontrados

Vamos a crear un nuevo método dentro del servicio `MapServices` con el que vamos a añadir nuevos marcadores teniendo en cuenta los resultados de la búsqueda:

```ts
export class MapService {
    ...
    private _markers: Marker[] = []
    ...
    createMarkersFromPlaces = (places: Feature[]) => {
        if (!this._map) throw new Error('Mapa no inicializado')
        this._markers.forEach(marker => marker.remove())
        const newMarkers = []

        for (const place of places) {
            const [ lng, lat ] = place.center as [number, number]
            const popup = new Popup()
                .setHTML(`
                    <h6>${place.text_es}</h6>
                    <span>${place.place_name}</span>
                `)
            const newMarker = new Marker()
                .setLngLat([lng, lat])
                .setPopup(popup)
                .addTo(this._map)

            newMarkers.push(newMarker)
        }
        this._markers = newMarkers
    }
}
```

Dentro de `PlacesService` necesitamos inyectar la dependencia que maneja el mapa, para que apartir de los resultados de la petición, se puedan crear los marcadores:

```ts
export class PlacesService {
    ...
    constructor(..., private _mapService: MapService) {
        ...
    }
    ...
    getPlacesByQuery = (query: string = ''): Observable<Feature[]> | undefined => {
        ...
        return this._placesAPI.get<PlacesResponse>(url, { params })
            .pipe(map(res => {
                ...
                this._mapService.createMarkersFromPlaces(this.places)
                return this.places
            }))
    }
}
```

## Ajustar el mapa para mostrar todos los marcadores encontrados

Podemos ajustar el mapa para que muestre todos los marcadores resultantes dentro del mapa, sin ocultar ninguno. Para ello, necesitamos añadir una configuración al servicio `MapService`:

```ts
export class MapService {
    ...
    createMarkersFromPlaces = (places: Feature[]) => {
        ...
        if (places.length === 0) return
        ...
        const bounds = new LngLatBounds()
        newMarkers.forEach( marker => bounds.extend(marker.getLngLat()))
        this._map.fitBounds(bounds, {
            padding: 100
        })
    }
}
```

También debemos tener en consideración el marcador de nuestra ubicación, por lo que necesitamos saber nuestra ubicación, pero se debe tener cuidado de tener una dependencia ciclica al inyectar dependecias, por ello mejor pasamos nuestras coordenadas dentro del método para crear los marcadores:

```ts
export class MapService {
    ...
    createMarkersFromPlaces = (places: Feature[], userLocation: [number, number]) => {
        ...
        const bounds = new LngLatBounds()
        ...
        bounds.extend(userLocation)
        ...
    }
}
```

Dentro de `PlacesService` debemos añadir el nuevo argumento:

```ts
export class PlacesService {
    ...
    getPlacesByQuery = (query: string = ''): Observable<Feature[]> | undefined => {
        ...
        return this._placesAPI.get<PlacesResponse>(url, { params })
            .pipe(map(res => {
                ...
                this._mapService.createMarkersFromPlaces(this.places, this.userLocation)
                ...
            }))
    }
}
```

## Obtener la ruta entre 2 puntos

Vamos a crear el tipado de las direcciones, en base a la respuesta que obtenemos de usar el enlace generado por el Playground de Mapbox:

```ts
export interface DirectionsResponse {
    routes:    Route[];
    waypoints: Waypoint[];
    code:      string;
    uuid:      string;
}

export interface Route {
    weight_name: string;
    weight:      number;
    duration:    number;
    distance:    number;
    legs:        Leg[];
    geometry:    Geometry;
}

export interface Geometry {
    coordinates: Array<number[]>;
    type:        string;
}

export interface Leg {
    via_waypoints: any[];
    admins:        Admin[];
    weight:        number;
    duration:      number;
    steps:         any[];
    distance:      number;
    summary:       string;
}

export interface Admin {
    iso_3166_1_alpha3: string;
    iso_3166_1:        string;
}

export interface Waypoint {
    distance: number;
    name:     string;
    location: number[];
}
```

Dentro de las variables de entorno cambiamos el nombre de la ruta anterior, y añadimos la nueva ruta para las direcciones:

```ts
export const environment = {
    ...,
    urlGeocoding: `https://api.mapbox.com/geocoding/v5/mapbox.places`,
    urlDirections: `https://api.mapbox.com/directions/v5/mapbox/driving`
}
```

Luego creamos un nuevo custom client para poder hacer las peticiones de las direcciones (``):

```ts
@Injectable({
    providedIn: 'root'
})
export class DirectionsApiClient extends HttpClient {

    private _accessToken = environment.tokenMapbox
    public baseUrl: string = environment.urlDirections

    constructor(handler: HttpHandler) {
        super(handler)
    }

    public override get<T>(url: string) {
        url = this.baseUrl + url

        return super.get<T>(url, { params: { 
            alternatives: false,
            continue_straight: false,
            geometries: 'geojson',
            overview: 'simplified',
            steps: false,
            lenguage: 'es',
            access_token: this._accessToken
        } })
    }
}
```

## Obtener la distancia y duración del recorrido

Para obtener la respuesta acerca de las direcciones entre un punto y otro, requerimos crear un método dentro de `MapService` para poder hacer la petición con nuestro custom client y a una dirección especifica tomando un punto de inicio y un fin:

```ts
export class MapService {
    ...
    constructor(private _directionsAPI: DirectionsApiClient) {}
    ...
    getRouteBetweenPoints = (start: [number, number], end: [number, number]) => {
        const url = `/${start.join(',')};${end.join(',')}`

        this._directionsAPI.get<DirectionsResponse>(url)
            .subscribe(console.log)
    }
}
```

Luego dentro de `SearchResultsComponent` creamos una método para poder usar el servicio:

```ts
export class SearchResultsComponent {
    ...
    getDirections = (place: Feature) => {
        if (!this._placesService.userLocation) throw new Error('No hay coordenadas del usuario')
        const start = this._placesService.userLocation
        const end = place.center as [number, number]
        this._mapService.getRouteBetweenPoints(start, end)
    }
}
```

Dentro del template llamamos el método:

```html
<button ... (click)="getDirections(place)">
    Direcciones
</button>
```

Dentro del servicio creamos un método privado que nos permite obtener las coordenadas de las rutas, luego podemos crear una instancia de `LngLatBounds` para poder hacer un fitbound entre la ruta de destino y la coordenada del usuario.

```ts
export class MapService {
    ...
    getRouteBetweenPoints = (start: [number, number], end: [number, number]) => {
        const url = `/${start.join(',')};${end.join(',')}`

        this._directionsAPI.get<DirectionsResponse>(url)
            .subscribe(res => this._drawPolyline(res.routes[0]))
    }

    private _drawPolyline = (route: Route) => {
        console.log({ distance: route.distance / 1000 })
        console.log({ duration: route.duration / 60 })

        if (!this._map) throw new Error('No hay un mapa instanciado')

        const coords = route.geometry.coordinates

        const bounds = new LngLatBounds()
        coords.forEach(([lng, lat]) => bounds.extend([lng, lat]))
        this._map.fitBounds(bounds, {
            padding: 100
        })
    }
}
```

## Dibujar la PolyLine o LineString

Lo primero que debemos hacer es definir el source, es decir las coordenadas para la polyline:

```ts
export class MapService {
    ...
    private _drawPolyline = (route: Route) => {
        ...
        const sourceData: AnySourceData = {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: coords
                        }
                    }
                ]
            }
        }
    }
}
```

Luego añadimos el recurso al mapa y añadimos una capa para poder mostrar la polyline:

```ts
export class MapService {
    ...
    private _drawPolyline = (route: Route) => {
        ...
        this._map.addSource('RouteString', sourceData)
        this._map.addLayer({
            id: 'RouteString',
            type: 'line',
            source: 'RouteString',
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': 'black',
                'line-width': 3
            }
        })
    }
}
```

Si seleccionamos un punto del mapa, podemos generar la linea de recorrido, pero si luego nosotros tratamos de generar otro recorrido, simplemente tendremos el problema del que el id ya ha sido tomado para la última ruta, por lo tanto necesitamos eliminarla cuando queramos una nueva, tanto id como recurso:

```ts
export class MapService {
    ...
    private _drawPolyline = (route: Route) => {
        ...
        if (this._map.getLayer('RouteString')) {
            this._map.removeLayer('RouteString')
            this._map.removeSource('RouteString')
        }
        ...
    }
}
```

## Ocultar el menú de lugares

Para ocultar el menú de los resultados, creamos un método dentro de `PlaceService` para poder vaciar el arreglo y de tal manera lograr que el componente `SearchResultsComponent` limpie los resultados y oculte el menú:

```ts
export class PlacesService {
    ...
    deletePlaces = () => {
        this.places = []
    }
}
```

```ts
export class SearchResultsComponent {
    ...
    getDirections = (place: Feature) => {
        ...
        this._placesService.deletePlaces()
        ..
    }
}
```

Otra manera sería crear un setter dentro del componente, o una variable que funcione como bandera, o incluso una clase para volver traslucido el componente.

## Desplegar la aplicación de mapas

Vamos a usar Netlify para subir el bundle de nuestra aplicación. Por lo tanto necesitamos ejecutar el comando `ng build` o `npm run build` y subir el contenido de dist en un despliegue nuevo en la aplicación del hosting. Tenemos el problema de que al generar el bundled de producción se excede el budget debido al peso de mapbox-gl. Una manera de solucionar esto, es mediante el CDN de Mabbox, pero nuestra aplicación ya está muy anidada a la librería, por lo que lo solucionaremos con la segunda opción.

Dentro de `angular.json` ampliamos el budget cambiando la configuración:

```json
"budgets": [
    {
        "type": "initial",
        "maximumWarning": "500kb",
        "maximumError": "2mb"
    },
    ...
],
```

Volvemos a tratar de generar el build y ahora si pudemos subir la versión de producción al hosting. Cambiamos el nombre del dominio y listo: este es mi despliegue [curso-angular-mapbox](https://curso-angular-mapbox.netlify.app/)
