# Sección 22: Gráficas en Angular

Este es un breve listado de los temas fundamentales:

- Gráficas dinámicas
- Gráficas de Barra y Dona
- Re-dibujar valores de gráfica
- Gráficas basadas en peticiones HTTP
- Componentes especializados para la re-utilización de gráficas
- Y más...

Esta sección tiene por objetivo enseñarles a usar otra librería de terceros en Angular, para que comprendamos como mostrar de forma visual la data de nuestros componentes.

## Inicio del proyecto - GráficasApp

Vamos a crear un nuevo proyecto con el comando `ng new graphs-app`, lo dejamos en modo estricto, con routing y CSS. Vamos a usar [ng2-charts](https://valor-software.com/ng2-charts/) para crear las gráficas. También vamos a usar Bootstrap para darle formato a nuestro proyecto. Para levantar el proyecto usamos el comando `ng serve -o`.

## Estructura del proyecto

Vamos a usar los siguientes comandos para estructurar nuestro proyecto:

- `ng g m graphs --routing`
- `ng g c graphs/pages/bar-chart --skip-tests -is`
- `ng g c graphs/pages/double-chart --skip-tests -is`
- `ng g c graphs/pages/doughnut-chart --skip-tests -is`
- `ng g c graphs/pages/doughnut-chart-http --skip-tests -is`
- `ng g c graphs/components/bar --skip-tests -is`
- `ng g s graphs/services/graphs --skip-tests`
- `ng g m shared`
- `ng g c shared/components/menu --skip-tests -is`

## Rutas y LazyLoad

Vamos a crear las rutas del módulo de gráficas dentro de `GraphsRoutingModule`:

```ts
const routes: Routes = [
    {
        path: '',
        children: [
            { path: 'bar-chart', component: BarChartComponent },
            { path: 'double-chart', component: DoubleChartComponent },
            { path: 'doughnut-chart', component: DoughnutChartComponent },
            { path: 'doughnut-chart-http', component: DoughnutChartHttpComponent },
            { path: '**', redirectTo: 'bar-chart' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GraphsRoutingModule { }
```

Implementamos la carga perezosa en `AppRoutingModule`:

```ts
const routes: Routes = [
    { path: 'graphs', loadChildren: () => import('./graphs/graphs.module').then(m => m.GraphsModule) },
    { path: '**', redirectTo: 'graphs' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
```

En el template `app.component.html` renderizamos el contenido de las rutas con el selector:

```html
<router-outlet></router-outlet>
```

Para poder usar el componente del menú que se encuentra dentro del módulo Shared debemos hacer la exportación del mismo dentro de `SharedModule`:

```ts
@NgModule({
    ...,
    exports: [ MenuComponent ]
})
export class SharedModule { }
```

Luego importamos el módulo de Shared dentro de `AppModule`:

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

## Menú de la aplicación

Vamos a crear una interfaz con el comando `ng g i shared/interfaces/menu-item` y creamos la siguiente estructura:

```ts
export interface MenuItem {
    path: string;
    text: string;
}
```

Para poder usar las configuraciones de las rutas necesitamos importar `RouterModule` dentro de `SharedModule`:

```ts
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

Dentro de `MenuComponent` creamos un arreglo para los items del Menú:

```ts
export class MenuComponent {
    public menu: MenuItem[] = [
        { path: '/graphs/bar-chart', text: 'Diagrama de Barras' },
        { path: '/graphs/double-chart', text: 'Doble Gráfica' },
        { path: '/graphs/doughnut-chart', text: 'Diagrama de Dona' },
        { path: '/graphs/doughnut-chart-http', text: 'Diagrama de Dona - HTTP' },
    ]
}
```

Dentro del template del mismo componente recorremos el menu para poder mostrar los items:

```html
<ul class="list-group">
    <li *ngFor="let item of menu" [routerLink]="item.path" class="list-group-item" routerLinkActive="active">
        {{ item.text }}
    </li>
</ul>
```

Convertimos el puntero en pointer sobre los items:

```ts
@Component({
    ...,
    styles: [` li { cursor: pointer; }`]
})
export class MenuComponent { ... }
```

Por último, llamamos el selector del menú dentro de `app.component.html`:

```html
<div class="row m-5">
    <div class="col-sm-12 col-md-3 mb-5">
        <app-menu></app-menu>
    </div>


    <div class="col-sm-12 col-md-9">
        <router-outlet></router-outlet>
    </div>
</div>
```

## Gráfica de Barra

Vamos a instalar ng2-charts con el comando `npm i --save ng2-charts` junto a `npm i --save chart.js`. Hacemos la importación dentro de `GraphsModule`:

```ts
import { NgChartsModule } from "ng2-charts";

@NgModule({
    ...,
    imports: [
        ...,
        NgChartsModule
    ]
})
export class GraphsModule { }
```

En caso de que se nos muestre una advertencia sobre el uso de `CommonJS` sobre la librería Charts.js, necesitamos ir a `angular.json` y hacer el siguiente cambio. (Es importante reiniciar el servidor para poder tomar la configuración.):

```json
{
    ...,
    "projects": {
        ...,
        "graphs-app": {
            ...,
            "architect": {
                ...,
                "build": {
                    ...,
                    "options": {
                        "allowedCommonJsDependencies": ["charts.js"],
                        ...
                    }
                }
            }
        }
    }
}
```

De la documentación de ng2-charts copiamos el ejemplo que nos comparten:

```html
<div class="row">
    <div class="col">
        <div style="display: block">
            <canvas baseChart 
                [data]="barChartData" 
                [options]="barChartOptions" 
                [type]="barChartType" 
                (chartHover)="chartHovered($event)" 
                (chartClick)="chartClicked($event)">
            </canvas>
        </div>
        <button class="btn btn-primary" (click)="randomize()">Update</button>
    </div>
</div>
```

```ts
import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styles: [
    ]
})
export class BarChartComponent {

    @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

    public barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        // We use these empty structures as placeholders for dynamic theming.
        scales: {
            x: {},
            y: {
                min: 10
            }
        },
        plugins: {
            legend: {
                display: true,
            }
        }
    };
    public barChartType: ChartType = 'bar';

    public barChartData: ChartData<'bar'> = {
        labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
        datasets: [
            { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
            { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
        ]
    };

    // events
    public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
        console.log(event, active);
    }

    public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
        console.log(event, active);
    }

    public randomize(): void {
        this.barChartData.datasets[0].data = [
            Math.round(Math.random() * 100),
            Math.round(Math.random() * 100),
            Math.round(Math.random() * 100),
            Math.round(Math.random() * 100),
            Math.round(Math.random() * 100),
            Math.round(Math.random() * 100),
            Math.round(Math.random() * 100)
        ];

        this.chart?.update();
    }
}
```

## Personalizar la gráfica

La personalización de la gráfica se toma en base a la lectura de la documentación de la misma, podemos cambiar la cantidad de series a mostrar, los valores, los nombres, y colores de las mismas, entre otras cosas. Podemos personalizar la lógica cada que se emiten los eventos relacionados con la gráfica, y también podemos hacer actualizaciones de los datos en base de algún servicio.

## Componente personalizado para mostrar gráficas

Los componentes nos brindan la habilidad de reutilizar código, por lo que se hace más sencillo crear una clases que administre la lógica de un componente y luego se llama dentro de un template con datos que ingresen por el decorador `@Input()`. Por el momento copiamos la información del diagrama de barras dentro del componente `BarComponent` y luego lo llamamos dentro de `double-chart.component.html`:

```html
<h1>Gráficas Dobles</h1>
<hr>

<div class="row">
    <div class="col-sm-12 col-md-6">
        <app-bar></app-bar>
    </div>


    <div class="col-sm-12 col-md-6">
        <app-bar></app-bar>
    </div>
</div>
```

## Añadir flexibilidad a nuestro componente personalizado

Dentro de `DoubleCharComponent` creamos algunos arreglos para poder tener una data por defecto:

```ts
import { Component } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
    selector: 'app-double-chart',
    templateUrl: './double-chart.component.html',
    styles: [
    ]
})
export class DoubleChartComponent {

    proveedoresData: ChartData = {
        labels: ['2021', '2022', '2023', '2024', '2025'],
        datasets: [
            { data: [100, 200, 300, 400, 500], label: 'Vendedor A' },
            { data: [50, 250, 30, 450, 200], label: 'Vendedor B' },
        ]
    }

    productoData: ChartData = {
        labels: ['2021', '2022', '2023', '2024', '2025'],
        datasets: [
            { data: [200, 300, 400, 300, 100], label: 'Carros', backgroundColor: 'blue' },
        ]
    }

}
```

Dentro del template `double-chart.component.html` ponemos la siguiente estructura:

```html
<div class="row">
    <div class="col-sm-12">
        <app-bar [data]="proveedoresData"></app-bar>
    </div>

    <hr>

    <div class="col-sm-12">
        <app-bar [line]="true" [data]="productoData"></app-bar>
    </div>
</div>
```

Como nos podemos dar cuenta, se presentan 2 inputs, uno para determinar el tipo de gráfica, y otro para determinar la dará a mostrar. Esto lo logramos cuando configuramos el componente `BarComponent` de la siguiente manera:

```ts
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'app-bar',
    templateUrl: './bar.component.html',
    styles: [
    ]
})
export class BarComponent implements OnInit {
    
    @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

    @Input() line: boolean = false
    @Input('data') barChartData: ChartData = {
        labels: [],
        datasets: []
    }

    public barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
    };

    public barChartType: ChartType = 'bar';

    ngOnInit(): void {
        this.line && (this.barChartType = 'line')
    }
}
```

## Gráfica de Dona

Vamos a copiar de nuevo el ejemplo que se encuentra en la documentación de la librería. El diagrama de donas es más sencillo:

```ts
import { Component } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';

@Component({
    selector: 'app-doughnut-chart',
    templateUrl: './doughnut-chart.component.html',
    styles: [
    ]
})
export class DoughnutChartComponent {

    public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];

    public doughnutChartData: ChartData<'doughnut'> = {
        labels: this.doughnutChartLabels,
        datasets: [
            { data: [350, 200, 100], backgroundColor: ['#a2333d', '#22ca34', '#3b748c'] },
        ]
    };

    public doughnutChartType: ChartType = 'doughnut';
}
```

```html
<div class="row">
    <div class="col-12">
        <div style="display: block">
            <canvas baseChart [data]="doughnutChartData" [type]="doughnutChartType">
            </canvas>
        </div>
    </div>
</div>
```

## Gráfica de dona mediante petición HTTP

Vamos a crear un pequeño backend dentro de un directorio al nivel de la carpeta que contiene nuestro proyecto. Dentro de dicha carpeta creamos el archivo `db.json` y ponemos la siguiente data:

```json
{
    "graph": {
        "facebook": 327000,
        "youtube": 273000,
        "whatsapp": 2117000,
        "instagram": 227000,
        "messenger": 7000
    }
}
```

Luego vamos a usar el comando `json-server --watch db.json` dentro de la carpeta del backend, para simular un servidor externo y poder hacer peticiones al mismo. Para poder hacer peticiones http, necesitamos importar el módulo `HttpClientModule` dentro de `AppModule`:

```ts
import { HttpClientModule } from "@angular/common/http";

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

Dentro de `GraphsService` hacemos la inyección de dependencias de `HttpClient`:

```ts
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class GraphsService {
    constructor(private _http: HttpClient) { }
}
```

Creamos un método para poder obtener la data desde el endpoint que nos genera json-server:

```ts
export class GraphsService {
    public endpoint: string = 'http://localhost:3000/graph'
    ...
    getUsers = () => this._http.get(this.endpoint)
}
```

Dentro de `DoughnutChartHttpComponent` hacemos la inyección de nuestro servicio, y dentro del método `ngOnInit()` nos suscribimos al método creado:

```ts
export class DoughnutChartHttpComponent implements OnInit {
    constructor(private _gs: GraphsService) { }

    ngOnInit() {
        this._gs.getUsers().subscribe(data => console.log(data))
    }
}
```

## Mostrar la información gráfica

Para mostrar la información debemos capturarla del servicio y luego usar los elementos del objeto `doughnutChartData` para ingresar la data:

```ts
export class DoughnutChartHttpComponent implements OnInit {

    public doughnutChartType: ChartType = 'doughnut';

    public doughnutChartData: ChartData<'doughnut'> = {
        labels: [],
        datasets: []
    };

    constructor(private _gs: GraphsService) { }

    ngOnInit() {
        this._gs.getUsers().subscribe(data => {
            this.doughnutChartData.labels = Object.keys(data)
            this.doughnutChartData.datasets.push({ data: Object.values(data) })
        })
    }
}
```

## Cambiar la información mediante RxJs

Podemos crear otro método dentro del servicio que nos permita atrapa la información y retornar un objeto personalizado para luego poder enviarle la información al componente de una manera más sencilla:

```ts
export class GraphsService {
    ...
    getUsersForChart = () => {
        return this.getUsers()
            .pipe(
                map(data => {
                    return { labels: Object.keys(data), datasets: [{ data: Object.values(data) }] }
                })
            )
    }
}
```

Dentro del componente ya podemos llamar la información de la siguiente manera:

```ts
export class DoughnutChartHttpComponent implements OnInit {
    ...
    ngOnInit() {
        this._gs.getUsersForChart().subscribe(data => this.doughnutChartData = data)
    }
}
```

Como es un servidor local, podemos agregar un delay y de esa manera observar el loading.
