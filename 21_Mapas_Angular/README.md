# Sección 21: Mapas en Angular

Este es un breve listado de los temas fundamentales:

- Manejo de librerías escritas en JavaScript en TypeScript
- Uso de Mapas basados en Mapbox (el API es similar a la de Google Maps)
- Marcadores
- Eventos
- FlyTo
- Coordenadas geográficas
- Componentes para re-utilización de mapas
- Mantener objetos de forma persistente
- @types
- Zoom
- Range
- Y más

Aunque el uso de mapas no es algo directamente relacionado con Angular, ya que todo se realiza mediante un objeto de una librería de terceros, en este caso Mapbox, es interesante comprender cómo funcionan esas librerías dentro de Angular y cómo poder tener control de los objetos como si fueran propiedades de nuestras clases.

## Inicio de sección - MapasApp

Vamos a crear un nuevo proyecto con el comando `ng new maps-app`. Lo manejamos en modo estricto, con routing y CSS. Vamos a usar el CDN de Bootstrap, también vamos a usar [Mapbox](https://www.mapbox.com/), el cual es el sistema de mapas que vamos a emplear. Vamos a crear una cuenta en Mapbox o a ingresar con una en caso de tenerla. Luego podemos crear un nuevo Token para nuestra aplicación.

Para levantar el proyecto en una nueva pestaña usamos el comando `ng serve -o`

## Creando los componente necesarios y rutas

Vamos a crear los módulos y componentes con los siguientes comandos:

- `ng g m maps --routing`
- `ng g c maps/components/mini-map --skip-tests -is`
- `ng g c maps/pages/full-screen --skip-tests -is`
- `ng g c maps/pages/markers --skip-tests -is`
- `ng g c maps/pages/zoom-range --skip-tests -is`
- `ng g c maps/pages/estate --skip-tests -is`
- `ng g m shared`
- `ng g c shared/components/menu --skip-tests -is`

Vamos a cargar las páginas mediante Lazyload. Lo primero será crear las rutas hijas dentro de `MapsRoutingModule`:

```ts
const routes: Routes = [
    {
        path: '',
        children: [
            { path: 'full-screen', component: FullScreenComponent },
            { path: 'markers', component: MarkersComponent },
            { path: 'zoom-range', component: ZoomRangeComponent },
            { path: 'estate', component: EstateComponent },
            { path: '**', redirectTo: 'full-screen' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MapsRoutingModule { }
```

Dentro de `AppRoutingModule` hacemos la carga perezosa:

```ts
const routes: Routes = [
    { path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule) },
    { path: '**', redirectTo: 'maps' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
```

Dentro de `app.component.html` hacemos el llamado a `<router-outlet>`

## Menú de la aplicación

Primero necesitamos hacer la exportación del componente `MenuComponent` dentro del módulo `SharedModule`:

```ts
import { MenuComponent } from './components/menu/menu.component';

@NgModule({
    ...,
    exports: [ MenuComponent ]
})
export class SharedModule { }

```

Dentro dentro de `AppModule` hacemos la importación del módulo `SharedModule`:

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

Creamos una interfaz con el comando `ng g i shared/interfaces/menu-item`, dentro de la cual escribimos la siguiente estructura:

```ts
export interface MenuItem {
    path: string
    name: string
}
```

Dentro del componente `MenuComponent` creamos un arreglo para los items de nuestro menú:

```ts
export class MenuComponent {

    public menuItems: MenuItem[] = [
        { path: '/maps/full-screen', name: 'Full Screen' },
        { path: '/maps/zoom-range', name: 'Zoom Range' },
        { path: '/maps/markers', name: 'Marcadores' },
        { path: '/maps/estate', name: 'Inmuebles' }
    ]

}
```

Para poder usar rutas necesitamos hacer la importación de `RouterModule` dentro del módulo de Shared:

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

En el template `menu.component.html` creamos una lista en la que se recorre nuestro arreglo y se le establecen las rutas:

```html
<ul class="list-group">
    <li *ngFor="let item of menuItems" 
        [routerLink]="item.path" 
        routerLinkActive="active" 
        class="list-group-item" >
            {{ item.name }}
    </li>
</ul>
```

También le vamos a dar algunos estilos CSS a nuestro componente. Lo primero serán estilos globales dentro de `styles.css`:

```css
app-menu {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 100;
    width: 200px;
}
```

Luego dentro de los estilos inline del componente estilamos lo siguiente:

```ts
@Component({
    ...,
    styles: [` li { cursor: pointer; } `]
})
export class MenuComponent { ... }
```

## Mostrar un mapa en pantalla completa

Necesitamos el access token que generamos en `MapBox` y lo copiamos en las variables de entorno de los archivos `enviroments/environment.prod.ts` y `enviroments/environment.ts`:

```ts
export const environment = {
    production: ...,
    mapboxToken: 'pk.eyJ1IjoiY2FybG9zLXBhZXpmIiwiYSI6ImNreTNvNnVtcjAzemUyd21ubmk3c3NpN3AifQ.zVXhWf-evufYvB8_roxkWQ'
};
```

Vamos a instalar el paquete de Mapbox con el comando `npm install --save mapbox-gl`. La documentación de como seguir los pasos lo encontramos en [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/). Incluimos los estilos CSS dentro del head de `index.html` con la siguiente línea:

```html
<!-- CSS Mapbox -->
<link href='https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css' rel='stylesheet' />
```

Dentro de `FullScreenComponent` hacemos la importación de mapbox-gl:

```ts
import mapboxgl from 'mapbox-gl';
```

Lo anterior nos muestra un error por la falta de tipado de la librería, puesto que ha sido escrita en JS. Para solucionar el error necesitamos ejecutar el siguiente comando `npm i --save-dev @types/mapbox-gl` y luego cambiar la importación de la siguiente manera:

```ts
import * as mapboxgl from 'mapbox-gl';
```

Ahora si procedemos a crear una instancia del mapa dentro del componente:

```ts
export class FullScreenComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
        (mapboxgl as any).accessToken = environment.mapboxToken
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [-70, 0], // starting position [lng, lat]
            zoom: 7 // starting zoom
        });
    }

}
```

La propiedad container hace referencia al id del elemento que va a contener el mapa, por lo que dentro del template del componente creamos un nuevo div con dicho id:

```html
<div id="map"></div>
```

Es importante darle algunos estilos a nuestra aplicación para que se puedan ejecutar de manera correcta los de mapbox. En los estilos globales añadimos lo siguiente:

```css
html,
body {
    width: 100%;
    height: 100%;
}
```

Dentro de los estilos inline del componente añadimos lo siguiente:

```ts
@Component({
    ...,
    styles: [` 
        #map {
            height: 100%;
            width: 100%;
        }
    `]
})
export class FullScreenComponent implements OnInit { ... }
```

## Punto central, zoom y accessToken de forma global

Cuando estamos manejando los mapas, en cualquier componente, siempre vamos a tener 1 línea repetida que sirve para el access token de la API. Debemos recordar que el primer componente que se renderiza es el `AppComponent`. Siempre se inicia de primeras, y además envuelve los demás módulos o componentes, por lo que podemos manipular elementos globales de nuestra aplicación dentro de dicha clase. Aprovechando ese principio, podemos configurar el access token dentro de `AppComponent` y por referencia implícita, lo demás componentes lo podrán reconocer.

```ts
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    ngOnInit(): void {
        (mapboxgl as any).accessToken = environment.mapboxToken
    }
}
```

De esta manera ya podemos eliminar la línea de access token dentro del component `FullScreenComponent`.

La configuración del mapa posee varios elementos, por el momento nos vamos a enfocar en el punto centro del mapa y en el zoom inicial del mismo. Mapbox maneja la combinación de coordenadas como (longitud y latitud).

```ts
export class FullScreenComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [-73.47055905008489, 6.888389210280588], // starting position [lng, lat]
            zoom: 7 // starting zoom
        });
    }

}
```

## Página Zoom-Range

Vamos a replicar la creación del mapa dentro del component `ZoomRangeComponent`. La diferencia radica en que el contenedor del mapa, en vez de tener un id, tendrá una clase para ubicar los estilos. Posteriormente creamos la estructura de nuestro visor de rango y coordenada del punto centro:

```html
<div id="map" class="map-container"></div>

<div class="row">
    <div class="col-12">
        <label class="form-label">
            Zoom: 16 - Lng, Lat: [123, 133]
        </label>
        <input type="range" class="form-range">
    </div>

    <div class="col-12">
        <button class="btn btn-primary">-</button>
        <button class="btn btn-primary float-end">+</button>
    </div>
</div>
```

Vamos a estilizar el contenedor del `row`:

```ts
@Component({
    ...,
    styles: [`
        .map-container {
            width: 100%;
            height: 100%;
        }
        .row {
            background-color: white;
            z-index: 101;
            position: fixed;
            bottom: 50px;
            left: 50px;
            border-radius: 5px;
        }
    `]
})
export class ZoomRangeComponent implements OnInit { ... }
```

## Controlar el objeto del mapa - ZoomIn y ZoomOut

Para poder manejar las propiedades del mapa, necesitamos crear una variable que nos ayude a guardar su referencia y sus configuraciones:

```ts
export class ZoomRangeComponent implements OnInit {

    public map!: mapboxgl.Map

    ngOnInit(): void {
        this.map = new mapboxgl.Map({...});
    }
}
```

Podemos crear los métodos para alejar y para acercar mediante los botones:

```ts
export class ZoomRangeComponent implements OnInit {
    ...
    zoomOut = () => {
        this.map.zoomOut()
    }

    zoomIn = () => {
        this.map.zoomIn()
    }
}
```

Hay algo que debemos tener en claro. Si dentro de nuestro template llegamos a tener más de un id en los elementos html, que tengan el mismo nombre, se tiene el problema de que solo reconocerá al primero y a los demás los va a ignorar. Una manera de evitar esto y lograr que se tengan varios mapas con referencias distintas, es usando un identificador de Angular, el cual cada vez que se llama un componente va a generar una referencia nueva y única, lo que nos evita conflictos.

A continuación, observamos como quitamos el id y lo reemplazamos por la referencia:

```html
<div #map class="map-container"></div>
```

Para poder acceder a la referencia necesitamos usar el decorador `@ViewChild()` dentro de la clase del componente:

```ts
export class ZoomRangeComponent implements OnInit {
    @ViewChild('map') divMap!: ElementRef
    ...
}
```

Si nosotros imprimimos el valor de está nueva referencia dentro del constructor o dentro del hook `ngOnInit()` vamos a recibir un `undefined`, porque en ninguno de los 2 momentos del ciclo de vida donde aplican las funciones antes nombradas, se va a tener un elemento terminado. Pero si nosotros intentamos ver el valor de la referencias dentro de alguno de los métodos, podemos observar su contenido, un comportamiento que no es bueno para nosotros en este momento.

```ts
export class ZoomRangeComponent implements OnInit {

    @ViewChild('map') divMap!: ElementRef

    public map!: mapboxgl.Map

    constructor() { 
        console.log(this.divMap) // undefined ❌
    }

    ngOnInit(): void {
        console.log(this.divMap) // undefined ❌
    }

    zoomOut = () => {
        console.log(this.divMap) // ElementRef ✔️
    }
}
```

La mejor manera de asegurarnos de que recibimos un elemento y no una referencia vacía, es implementando la interfaz `AfterViewInit` en vez de `OnInit`. Además como ya no estamos obteniendo un id del elemento, sino una referencia del mismo, entonces necesitamos cambiar la configuración del elemento `container` del mapa:

```ts
export class ZoomRangeComponent implements AfterViewInit {

    @ViewChild('map') divMap!: ElementRef

    public map!: mapboxgl.Map

    ngAfterViewInit(): void {
        console.log(this.divMap)
        this.map = new mapboxgl.Map({
            container: this.divMap.nativeElement, // container ID
            ...
        });
    }
    ...
}
```

Con lo anterior logramos evitar que `AppComponent` no logre reconocer los diferentes mapas en los componentes hijos por tener un mismo id, y en vez de ello cada mapa tiene una referencia diferente para que se reconozca en cada llamado a los componentes.

## Controlar el nivel del Zoom

Podemos crear una variable que almacene el valor del zoom. También podemos usar un método de Mapbox para obtener el zoom cada vez que se llama:

```ts
export class ZoomRangeComponent implements AfterViewInit {

    ...
    public zoomLevel: number = 5

    ngAfterViewInit(): void {
        this.map = new mapboxgl.Map({
            ...,
            zoom: this.zoomLevel
        });
    }

    zoomOut = () => {
        this.map.zoomOut()
        this.zoomLevel = this.map.getZoom()
    }
    ...
}
```

El inconveniente que vamos a tener es que el zoom que se obtiene es el valor anterior y no el actual, además si nosotros usamos la rueda del mouse o el gesto del pellizco, sin tocar los botones, el valor que se está mostrando se desactualiza por que no está escuchando los cambios. Para solucionar estos errores vamos a crear un `EventListener`.

## Crear EventListeners del mapa

Vamos a crear un EventListener que escuche cada que cambia que zoom tanto acercandose como alejandose. El valor que se obtiene justo en ese instante, es el que se le asignara a la variable del zoom:

```ts
export class ZoomRangeComponent implements AfterViewInit {
    ...
    public zoomLevel: number = 5

    ngAfterViewInit(): void {
        ...
        this.map.on('zoom', (e) => this.zoomLevel = this.map.getZoom())
    }

    zoomOut = () => {
        this.map.zoomOut()
    }

    zoomIn = () => {
        this.map.zoomIn()
    }
}
```

De esta manera logramos hacer la imporlación de los datos en tiempo real. Además en nuestro template podemos usar el pipe de number para limitar la cantidad de cifras que queremos gráficamente:

```html
<label class="form-label">Zoom: {{ zoomLevel | number:'.0-2' }}</label>
```

## Restringir el Zoom y uso del Range

Podemos limitar la cantidad de zoom permitido mediante otro EventListener:

```ts
export class ZoomRangeComponent implements AfterViewInit {
    ...
    ngAfterViewInit(): void {
        ...
        this.map.on('zoomend', (e) => (this.map.getZoom() > 18) && this.map.zoomTo(18))
    }
    ...
}
```

Para poder usar el input-range, no necesitamos ni de `FormsModule`, ni de `ReactiveFormsModule` puesto que es un solo input sencillo. Por tal motivo vamos a usar una referencias local, con la que conseguimos obtener su valor, el cual pasaremos a una función que nos permite hacer n zoom, al igual que el listener anterior. En el input vamos a escuchar el valor del zoom actual, le definimos el valor mínimo y el máximo, luego creamos la referencia local, y en cada movimiento del rango emitimos la función de cambiar el zoom:

```html
<input type="range" class="form-range" 
    [value]="zoomLevel" 
    min="0.8" max="18" 
    #zoomInput (input)="zoomChange(zoomInput.value)">
```

```ts
export class ZoomRangeComponent implements AfterViewInit {
    ...
    zoomChange = (value: string): mapboxgl.Map => this.map.zoomTo(Number(value))
}
```

## Obtener las coordenadas centrales del mapa

Vamos a crear un arreglo para poner los valores iniciales de la longitud y la latitud del punto centro. Cada que nos movemos debemos actualizar dicho centro, por lo que necesitamos de un EventListener:

```ts
export class ZoomRangeComponent implements AfterViewInit {
    ...
    public center: [number, number] = [-73.25, 3.70]

    ngAfterViewInit(): void {
        this.map = new mapboxgl.Map({
            ...,
            center: this.center,
        });
        ...
        this.map.on('move', (e) => {
            const { lng, lat } = e.target.getCenter()
            this.center = [lng, lat]
        })
    }
    ...
}
```

Dentro del template podemos hacer la interpolación aplicando el pipe number para la cantidad de dígitos:

```html
<label class="form-label">
    Zoom: {{ zoomLevel | number:'.2-2' }} 
    - Lng, Lat: [{{ center[0] | number:'.4-4'}}, {{ center[1] | number:'.4-4'}}]
</label>
```

Es muy importante que siempre que estamos escuchando eventos, los destruyamos junto al componente cada que se destruye. Por tal motivo vamos a implementar la interfaz `OnDestroy`, en cuyo método dejamos de escuchar los eventos mediante el método `off`.

```ts
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {
    ...
    ngOnDestroy(): void {
        this.map.off('zoom', () => {})
        this.map.off('zoomend', () => {})
        this.map.off('move', () => {})
    }
    ...
}
```

## Marcadores en el mapa

Dentro del componente `MarkersComponent` creamos nuevamente un mapa, por lo que podemos usar la misma estrategia o lógica que usamos en el componente `ZoomRangeComponent`.

```ts
export class MarkersComponent implements AfterViewInit {

    @ViewChild('map') divMap!: ElementRef
    public map!: mapboxgl.Map
    public zoomLevel: number = 5
    public center: [number, number] = [-73.25, 3.70]

    ngAfterViewInit(): void {
        this.map = new mapboxgl.Map({
            container: this.divMap.nativeElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: this.center,
            zoom: this.zoomLevel
        });
    }
}
```

La creación en duro de un marcador no es complicada, tan solo necesitamos crear una instancia de la clase `Marker`, añadimos el arreglo con longitud y latitud, y le indicamos el mapa en el que se debe añadir.

```ts
export class MarkersComponent implements AfterViewInit {
    ...
    ngAfterViewInit(): void {
        ...
        const marker = new mapboxgl.Marker()
            .setLngLat(this.center)
            .addTo(this.map)
    }
}
```

También podemos añadir elementos personalizados como marcador. Podemos pasarle un avatar, un icono, un emoji, o incluso simplemente texto:

```ts
export class MarkersComponent implements AfterViewInit {
    ...
    ngAfterViewInit(): void {
        ...
        const element: HTMLElement = document.createElement('div');
        element.innerHTML = 'Marcador Personalizado 😃'

        const marker = new mapboxgl.Marker({ element })
            ...
    }
}
```

## Añadir marcadores de forma dinámica

Podemos crear dentro de template una lista con un item para agregar marcadores y debajo los marcadores creados. Por el momento solo está la funcionalidad de agregar un marcador:

```html
<ul class="list-group">
    <li class="list-group-item list-group-item list-group-item-info" (click)="addMarker()">💣 Agregar</li>
    <li class="list-group-item list-group-item" (click)="goToMarker()">Marker 1</li>
</ul>
```

Le damos un poco de estilo a los marcadores desde el CSS inline del componente:

```ts
@Component({
    selector: 'app-markers',
    templateUrl: './markers.component.html',
    styles: [`
        .list-group {
            position: fixed;
            right: 20px;
            top: 20px;
            z-index: 101;
        }

        li {
            cursor: pointer;
        }
    `]
})
export class MarkersComponent implements AfterViewInit {...}
```

La funcionalidad de crear un marcador lo pasamos a la función de nuestro botón:

```ts
export class MarkersComponent implements AfterViewInit {
    ...
    addMarker = () => {
        const marker = new mapboxgl.Marker()
            .setLngLat(this.center)
            .addTo(this.map)
    }
    
    goToMarker = () => {}
}
```

Podemos hacer que el marcador tenga la propiedad de draggable para moverlo por cualquier punto del mapa:

```ts
export class MarkersComponent implements AfterViewInit {
    ...
    addMarker = () => {
        const marker = new mapboxgl.Marker({
            draggable: true
        })
            ....
    }
    ...
}
```

También podemos generar colores aleatorios para los marcadores:

```ts
export class MarkersComponent implements AfterViewInit {
    ...
    addMarker = () => {
        const color = '#xxxxxx'.replace(/x/g, y => (Math.random()*16|0).toString(16))

        const marker = new mapboxgl.Marker({
            ...,
            color
        })
            ...
    }
    ...
}
```

## Mantener el arreglo de marcadores y colores

Cada que añadimos un nuevo marcador, lo vamos a guardar en un arreglo de marcadores:

```ts
export class MarkersComponent implements AfterViewInit {
    ...
    public markers: mapboxgl.Marker[] = []
    ...
    addMarker = () => {
        ...
        this.markers.push(marker)
    }
    ...
}
```

Luego, podemos usar un `ngFor` para mostrar los elementos:

```html
<li class="list-group-item list-group-item" (click)="goToMarker()" *ngFor="let marler of markers; let i = index">
    Marker {{ i + 1 }}
</li>
```

Si queremos mostrar la lista de los objetos con el color que se le asigno, debemos refactorizar un poco el código. Primero creamos una interfaz:

```ts
import * as mapboxgl from 'mapbox-gl';

export interface MarkerColor {
    color: string;
    marker: mapboxgl.Marker
}
```

Volvemos a nuestro componente y cambiamos el tipado del arreglo de marcadores, y lo que le añadimos al arreglo cada que agregamos un marcador:

```ts
export class MarkersComponent implements AfterViewInit {
    ...
    public markers: MarkerColor[] = []
    ...
    addMarker = () => {
        ...
        this.markers.push({ color, marker })
    }
    ...
}
```

Dentro del template le estamos estilo a los elementos de la lista mediante la propiedad `[ngStyle]`:

```html
<li ... *ngFor="let marker of markers; let i = index" [ngStyle]="{'background-color': marker.color}">
    Marker {{ i + 1 }}
</li>
```

## FlyTo

Dentro del template podemos usar el elemento que se está iterando, para enviar la información del marcador dentro de la función:

```html
<li *ngFor="let marker of markers; let i = index"
        (click)="goToMarker(marker.marker)" 
        ... >
    Marker {{ i + 1 }}
</li>
```

Una vez obtenemos la información del marcador, podemos saber la coordenada del mismo mediante la función `getLngLat()`, a la cual, luego de aplicar desestructuración, podemos enviar el centro al que de ir `flyTo`:

```ts
export class MarkersComponent implements AfterViewInit {
    ...
    goToMarker = (marker: mapboxgl.Marker) => {
        const { lng, lat } = marker.getLngLat()
        this.map.flyTo({
            center: [lng, lat]
        })
    }
}
```

Una manera más sencilla de la función sería la siguiente:

```ts
export class MarkersComponent implements AfterViewInit {
    ...
    goToMarker = (marker: mapboxgl.Marker) => {
        this.map.flyTo({
            center: marker.getLngLat()
        })
    }
}
```

## Guardar y leer LocalStorage

Para guardar los marcadores dentro del localStorage, primero vamos a modificar la interfaz `MarkerColor`:

```ts
export interface MarkerColor {
    color: string;
    marker?: mapboxgl.Marker
    center?: [number, number]
}
```

Modificamos el template para decirle que siempre va a existir el marcador con el *Non-null assertion operator*:

```html
<li ... (click)="goToMarker(marker.marker!)">
    Marker {{ i + 1 }}
</li>
```

El método para guardar los marcadores en el LocalStorage crea un arreglo para guardar el centro y color del marcador. Luego, por cada marcador en la lista global de marcadores, se agregar el color, longitud y latitud al arreglo local. Por último se graba el arreglo serializandolo a string dentro del localStorage:

```ts
export class MarkersComponent implements AfterViewInit {
    ...
    saveMarkersLocalStorage = () => {
        const lngLatArr: MarkerColor[] = []
        this.markers.forEach(m => {
            const color = m.color
            const { lng, lat } = m.marker!.getLngLat()
            lngLatArr.push({
                color: color,
                center: [lng, lat]
            })
        })
        localStorage.setItem('markers', JSON.stringify(lngLatArr))
    }
}
```

Este método lo usamos cada que creamos un nuevo marcador:

```ts
export class MarkersComponent implements AfterViewInit {
    ...
    addMarker = () => {
        ...
        this.saveMarkersLocalStorage()
    }
}
```

Para leer los elementos del localStorage, validamos que se encuentre la colección de marcadores dentro del mismo, y luego creamos un arreglo en el que obtenemos parseado la colección guardada:

```ts
export class MarkersComponent implements AfterViewInit {
    ...
    readLocalStorage = () => { 
        if (!localStorage.getItem('markers')) return
        const lngLatArr: MarkerColor[] = JSON.parse(localStorage.getItem('markers')!)
    }
}
```

Este método lo vamos a usar en el hook `ngAfterViewInit()`:

```ts
export class MarkersComponent implements AfterViewInit {
    ...
    ngAfterViewInit(): void {
        ...
        this.readLocalStorage()
    }
    ...
}
```

Algo que también debemos hacer cuando estamos leyendo la colección guardada, es que debemos recorrer el arreglo locar para poder crear nuevos marcadores cada que cargamos nuestro componente, y también debemos añadir los nuevos marcadores al arreglo global que almacena y nos ayuda a manipular los arreglos desde otros lugares de la clase.

```ts
export class MarkersComponent implements AfterViewInit {
    ...
    readLocalStorage = () => { 
        ...
        lngLatArr.forEach(m => {
            const newMarker = new mapboxgl.Marker({
                color: m.color,
                draggable: true,
            })
                .setLngLat(m.center!)
                .addTo(this.map)

            this.markers.push({
                marker: newMarker,
                color: m.color
            })
        })
    }
}
```

## Borrar y actualizar marcadores

Para poder actualizar la información de los marcadores cuando se mueven por el mapa, necesitamos añadir un listener del evento que se lanza cuando se termina de hacer drag.

```ts
export class MarkersComponent implements AfterViewInit {
    ...
    addMarker = () => {
        ...
        marker.on('dragend', () => {
            this.saveMarkersLocalStorage()
        })
    }
    ...
    readLocalStorage = () => {
        ...
        lngLatArr.forEach(m => {
            ...
            newMarker.on('dragend', () => {
                this.saveMarkersLocalStorage()
            })
        })
    }
}
```

Para eliminar los marcadores vamos a escuchar un evento llamado `dblclick` dentro del elemento `li` y actuar cada que se detecte dicho evento:

```html
<li *ngFor="let marker of markers; let i = index" ... (dblclick)="deleteMarker( i )">
    Marker {{ i + 1 }}
</li>
```

La función dentro de la clase actua de la siguiente manera: Primero elimina la información del marcador dentro de la lista, luego eliminar el elemento en la posición de dicho indice y por último guarda nuevamente la información de los marcadores.

```ts
export class MarkersComponent implements AfterViewInit {
    ...
    deleteMarker = (index: number) => {
        this.markers[index].marker?.remove()
        this.markers.splice(index, 1)
        this.saveMarkersLocalStorage()
    }
}
```

## Lista de Inmuebles - Diseño y estructura de la data

Vamos a declarar una interfaz llamada `maps/interfaces/estate.interface.ts` en la cual creamos esta estructura para el tipado que vamos a manejar:

```ts
export interface Estate {
    title: string;
    description: string;
    lngLat: [number, number]
}
```

También vamos a crear un arreglo para almacenar alcunas ubicaciones de los inmuebles dentro de la clase `EstateComponent`:

```ts
export class EstateComponent {
    public estates: Estate[] = [
        {
            title: 'Casa residencial, Canadá',
            description: 'Bella propiedad en Katana, Canadá',
            lngLat: [-75.92722289474008, 45.280015511264466]
        },
        {
            title: 'Casa de playa, México',
            description: 'Hermosa casa de playa en Acapulco, México',
            lngLat: [-99.91287720907991, 16.828940930185748]
        },
        {
            title: 'Apartamento, Argentina',
            description: 'Lujoso apartamento en el corazón de Buenos Aires, Argentina',
            lngLat: [-58.430166677283445, -34.57150108832866]
        },
        {
            title: 'Local comercial, España',
            description: 'Local comercial disponible en Madrid, España, cerca de El Jardín Secreto.',
            lngLat: [-3.7112735618380177, 40.42567285425766]
        },
    ]
}
```

Dentro del template del componente vamos a crear una pequeña estructura que nos permite observar los elementos que se recorren del arreglo dentro de tarjetas.

## Componente MiniMapa

Vamos a usar el componente del minimapa para mostrar una pequeña imagen con un marcador de la ubicación del inmueble. Primero creamos el div que va a almacenar el mapa, con una referencia local:

```html
<div #map></div>
```

Vamos a darle un poco de estilo al div de manera inline dentro del componente:

```ts
@Component({
    ...,
    styles: [` div { width: 100%; height: 200px; margin: 0; }`]
})
export class MiniMapComponent implements AfterViewInit { ... }
```

Dentro de la clase `MiniMapComponent.ts` usamos el decorador `@Input` que nos permite recibir las coordenadas del inmueble, para ponerlas como centro del mapa y como ubicación del marcador. Además bloqueamos la interacción del usuario con el mapa.

```ts
export class MiniMapComponent implements AfterViewInit {
    @Input() lngLat!: [number, number]
    @ViewChild('map') mapRef!: ElementRef
    public map!: mapboxgl.Map 

    ngAfterViewInit(): void {
        this.map = new mapboxgl.Map({
            container: this.mapRef.nativeElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: this.lngLat,
            zoom: 15,
            interactive: false
        });

        new mapboxgl.Marker()
            .setLngLat(this.lngLat)
            .addTo(this.map)
    }
}
```

Dentro del template `estate.component.html` usamos el componente que acabamos de configurar:

```html
<div class="row">
    <div class="col-4 mb-2" *ngFor="let e of estates">
        <div class="card">
            <app-mini-map [lngLat]="e.lngLat" ></app-mini-map>
            <div class="card-body">
                <h5 class="card-title">{{ e.title }}</h5>
                <div class="card-text">{{ e.description }}</div>
            </div>
        </div>
    </div>
</div>
```

De este manera tenemos una sección donde tenemos tarjetas con información del inmueble y la ubicación en el mapa.
