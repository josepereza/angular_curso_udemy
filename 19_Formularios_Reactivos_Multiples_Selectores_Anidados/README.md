# Sección 19: Formulario Reactivos - Múltiples selectores anidados

Esta sección es una extensión de los formularios reactivos, la cual cubre un tema muy preguntado, que es el manejo de selectores anidados. Es decir, un selector muestra información, y al cambiar, carga información basado en la primera selección y luego llegamos hasta un tercer nivel. Es un ejercicio que puede verse complicado, pero vamos paso a paso, llenando select por select y al final se muestra una forma de organizar mejor el código usando RXJS.

## Inicio del proyecto - Selectores

Vamos a crear un nuevo proyecto con el comando `ng new selectores`. Lo dejamos en modo estricto, con las rutas y con CSS. También necesitamos el CDN de Bootstrap y la documentación de [REST Countries](https://restcountries.com/) para obtener los endpoints que necesitamos.

```html
<!-- CSS Bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
```

Levantamos la aplicación con el comando `ng serve -o` para abrir en una nueva pestaña.

## Estructura de directorios para esta aplicación

Vamos a crear la estructura de nuestro proyecto con los siguientes comandos:

- `ng g m countries --routing`
- `ng g c countries/pages/selector-page --skip-tests -is`
- `ng g s countries/services/country --skip-tests`
- `ng g i countries/interfaces/country`

Dentro de `CountriesRouting` vamos a configurar las rutas hijas para seguir repasando el tema de LazyLoad:

```ts
const routes: Routes = [
    {
        path: '',
        children: [
            { path: 'selector-page', component: SelectorPageComponent },
            { path: '**', redirectTo: 'selector-page' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CountriesRoutingModule { }
```

Dentro de `AppRouting` cargamos el módulo manera perezosa:

```ts
const routes: Routes = [
    { path: 'countries', loadChildren: () => import('./countries/countries.module').then(m => m.CountriesModule) },
    { path: '**', redirectTo: 'countries' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
```

Dentro del archivo `app.component.html` escribimos lo siguiente:

```html
<router-outlet></router-outlet>
```

## Formulario reactivo - Primer selector

Para crear un formulario reactivo necesitamos hacer la importación del módulo `ReactiveFormsModule` dentro de `CountriesModule`:

```ts
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    ...,
    imports: [
        ...,
        ReactiveFormsModule
    ]
})
export class CountriesModule { }
```

Vamos a usar `FormBuilder` por lo que necesitamos hacer la inyección del mismo dentro del componente `SelectorPageComponent`, luego podemos crear un formulario con los controles necesarios.

```ts
export class SelectorPageComponent {

    public form: FormGroup = this._fb.group({
        region: ['', Validators.required]
    })

    constructor(private _fb: FormBuilder) { }
}
```

Una vez tenemos la referencia y los controles, los asociamos con el template mediante los atributos `[formGroup]` y `formControlName`:

```html
<form [formGroup]="form">
    ...
    <select class="form-control" formControlName="region">...</select>
    ...
</form>
```

También vamos a crear una función de enviar y un método para validar si un campo es invalido:

```ts
export class SelectorPageComponent {
    ...
    isInvalidField = (field: string) => {
        const f = this.form.get(field)
        return f?.errors && f?.touched && f?.invalid
    }

    save = () => {
        if (this.form.invalid) {
            this.form.markAllAsTouched()
            return
        }
        console.log(this.form.value)
    }
}
```

Ambos métodos están asociados en el formulario de la siguiente manera:

```html
<form [formGroup]="form" (ngSubmit)="save()">
    ...
    <span *ngIf="isInvalidField('region')">Por favor seleccione un continente</span>
    ...
</form>
```

## Selector de regiones

Dentro de nuestro servicio vamos a crear un arreglo de regiones privadas y luego creamos un getter que nos permita obtener los elementos del array, pero rompiendo la referencias al mismo con el fin de evitar modificaciones accidentales:

```ts
@Injectable({
    providedIn: 'root'
})
export class CountryService {

    private _regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

    get regions(): string[] {
        return [...this._regions]
    }
    ...
}
```

Dentro del componente, creamos un arreglo que permita obtener los valores de las regiones del servicio al iniciar el tiempo de via del componente, por lo tanto también necesitamos hacer la inyección de nuestro servicio y hacer uso de la función `ngOnInit()`:

```ts
export class SelectorPageComponent implements OnInit {
    ...
    public regions: string[] = []

    constructor(private _fb: FormBuilder, private _cs: CountryService) { }

    ngOnInit(): void {
        this.regions = this._cs.regions
    }
    ...
}
```

Luego, en el template recorremos el arreglo y de asignamos los valores a las opciones. Es necesario que los valores de las options estén en minúsculas, por lo que usamos el pipe `lowerCase`:

```html
<select class="form-control" formControlName="region">
    <option value="">-- Seleccione Continente --</option>
    <option *ngFor="let region of regions" [value]="region | lowercase">{{ region }}</option>
</select>
```

## Segundo Selector anidado

Necesitamos hacer una petición HTTP a la API de REST Countries, pero no necesitamos toda la información de la respuesta, por lo que vamos a hacer uso del filtro que ellos nos proponen. En la [Sección 9](https://github.com/carlos-paezf/Curso_Angular/tree/main/9_Continuacion_SPA_PaisesApp#optimizar-las-peticiones-http) vimos como se puede hacer una petición más limpia y aplicando el filtro.

Lo primero que vamos a hacer es importar el módulo `HttpClientModule` dentro de `AppModule` ya que los servicios están provistos de manera global:

```ts
import { HttpClientModule } from '@angular/common/http'


@NgModule({
    ...,
    imports: [
        ..,
        HttpClientModule
    ],
    ...
})
export class AppModule { }
```

Luego hacemos la inyección de `HttpClient` dentro de nuestro servicio:

```ts
import { HttpClient } from '@angular/common/http';


export class CountryService {
    ...
    constructor(private _http: HttpClient) { }
}
```

Vamos también usar el concepto de las variables de entorno, por lo que dentro del archivo `environments/environment.ts` y `environments/environment.prod.ts` añadimos la url base de los endpoints:

```ts
export const environment = {
    ...,
    urlBase: 'https://restcountries.com/v3.1'
};
```

Dentro del servicio creamos algunas variables para simplificar un poco más el código:

```ts
export class CountryService {
    ...
    private _endpointRegion: string = `${environment.urlBase}/region`
    private _filter: string = `fields=name,cca2`
    ...
}
```

Ahora si procedemos a crear un método que nos permita obtener los países por región:

```ts
export class CountryService {
    ...
    getCountriesByRegion = (region: string) => {
        return this._http.get(`${this._endpointRegion}/${region}?${this._filter}`)
    }
}
```

También podemos generalizar y hacer un poco más limpio nuestro código de la siguiente manera:

```ts
export class CountryService {
    ...
    get httpParams() {
        return new HttpParams().set('fields', 'name,cca2')
    }
    ...
    getCountriesByRegion = (region: string) => {
        const url = `${this._endpointRegion}/${region}`
        return this._http.get(url, { params: this.httpParams })
    }
}
```

Como usualmente usamos tipado, entonces vamos a crear la interfaz para el país.

```ts
export interface Country {
    name: Name;
    cca2: string;
}

export interface Name {
    common: string;
    official: string;
    nativeName: NativeName;
}

export interface NativeName {
    fra?: Translation;
    spa?: Translation;
}

export interface Translation {
    official: string;
    common:   string;
}
```

Con lo anterior, nuestro método para obtener los países por región quedaría así:

```ts
export class CountryService {
    ...
    getCountriesByRegion = (region: string): Observable<Country[]> => {
        const url = `${this._endpointRegion}/${region}`
        return this._http.get<Country[]>(url, { params: this.httpParams })
    }
}
```

Volviendo a nuestro componente, creamos un arreglo de países en que guardaremos la respuesta de la suscripción al método del servicio:

```ts
export class SelectorPageComponent implements OnInit {
    ...
    public countries: Country[] = []
    ...
    ngOnInit(): void {
        this.regions = this._cs.regions
        this.form.get('region')?.valueChanges
            .subscribe(region => {
                this._cs.getCountriesByRegion(region)
                    .subscribe(countries => {
                        this.countries = countries
                        console.log(this.countries)
                    })
            })
    }
    ...
}
```

Dentro del template podemos hacer la interpolación de los datos del arreglo de países, y la sección aparece luego de que el arreglo de países no esté vacío.

```html
<div class="row mb-5" *ngIf="countries.length !== 0">
    <div class="col">
        <label class="form-label">País</label>

        <select class="form-control" formControlName="country">
            <option value="">-- Seleccione País --</option>
            <option *ngFor="let country of countries" [value]="country.cca2 | lowercase">{{ country.name.common }}
            </option>
        </select>

        <span class="form-text text-danger" *ngIf="isInvalidField('country')">Por favor seleccione un
            país</span>
    </div>
</div>
```

## Limpiar país cuando el primer selector cambia

Primero vamos a optimizar el código evitando una suscripción dentro de otra suscripción, y mejor vamos a usar el operador `switchMap` de RxJs:

```ts
export class SelectorPageComponent implements OnInit {
    ...
    ngOnInit(): void {
        this.regions = this._cs.regions
        this.form.get('region')?.valueChanges
            .pipe(
                switchMap(region => this._cs.getCountriesByRegion(region))
            )
            .subscribe(countries => this.countries = countries)
    }
    ...
}
```

Necesitamos que cada vez que se seleccione una nueva región, se limpie el control del país dentro del formulario, razón por la cual vamos a aplicar un efecto secundario al cambio de los valores mediante el operador `tap`:

```ts
export class SelectorPageComponent implements OnInit {
    ...
    ngOnInit(): void {
        this.regions = this._cs.regions
        this.form.get('region')?.valueChanges
            .pipe(
                tap(_ => this.form.get('country')?.reset('')),
                switchMap(region => this._cs.getCountriesByRegion(region))
            )
            .subscribe(countries => this.countries = countries)
    }
    ...
}
```

## Tercer Selector Anidado

Necesitamos añadir un nuevo elemento a nuestro tipado para las fronteras:

```ts
export interface Country {
    ...
    borders?: string[];
}
```

Luego, en el servicio creamos un método para encontrar países por el `cca2`. Este servicio puede recibir un valor vacio, por lo que en ese caso retornamos como respuesta un null, el cual convertimos en observable mediante el operado `of` de RxJs:

```ts
export class CountryService {
    ...
    private _endpointCountry: string = `${environment.urlBase}/alpha`
    ...
    getCountryByCAA2 = (cca2: string): Observable<Country[] | null> => {
        if (!cca2) return of(null)
        const url = `${this._endpointCountry}/${cca2}`
        return this._http.get<Country[]>(url, { params: this.httpParams })
    }
}
```

Dentro del componente podemos atrapar el valor del código del país que se selecciona para luego hacer una suscripción al mismo:

```ts
export class SelectorPageComponent implements OnInit {
    ...
    ngOnInit(): void {
        ...
        this.form.get('country')?.valueChanges
            .pipe(
                tap(_ => this.form.get('border')?.reset('')),
                switchMap(cca2 => this._cs.getCountryByCAA2(cca2))
            )
    }
    ...
}
```

## Llenar Tercer Selector

Es importante que limpiemos por completo el arreglo de fronteras cuando se selecciona un país diferente, por lo que vamos a escribir más código dentro del operador `tap`. También necesitamos que podamos capturar los bordes de los países una vez se tenga la información de los mismos:

```ts
export class SelectorPageComponent implements OnInit {
    ...
    public borders: string[] = []
    ...
    ngOnInit(): void {
        ...
        this.form.get('country')?.valueChanges
            .pipe(
                tap(_ => {
                    this.borders = []
                    this.form.get('border')?.reset('')
                }),
                switchMap(cca2 => this._cs.getCountryByCAA2(cca2))
            )
            .subscribe(country => this.borders = country?.borders || []) 
    }
    ...
}
```

Dentro del template hacemos la interpolación de la data:

```html
<div class="row mb-5" *ngIf="borders.length !== 0">
    <div class="col">
        <label class="form-label">Fronteras</label>
        <select class="form-control" formControlName="border">
            <option value="">-- Seleccione Frontera --</option>
            <option *ngFor="let border of borders" [value]="border">{{
                border }}
            </option>
        </select>
        <span class="form-text text-danger" *ngIf="isInvalidField('border')">Por favor seleccione una frontera</span>
    </div>
</div>
```

## Mejorar la experiencia de usuario

Vamos a crear una alerta en el template, la cual se muestra de manera condicional cada que está cargando la data:

```html
<div class="row" *ngIf="loading">
    <div class="col">
        <div class="alert alert-primary">Cargando</div>
    </div>
</div>
```

Dentro de la clase del componente vamos a crear la variable boolean con la que vamos a hacer el condicional. Dicha variable se activa cuando se limpia o carga la data y se desactiva cuando la data está lista. Esto aplica para el arreglo de países y de fronteras:

```ts
export class SelectorPageComponent implements OnInit {
    ...
    public loading: boolean = false 
    ...
    ngOnInit(): void {
        ...
        this.form.get('region')?.valueChanges
            .pipe(
                tap(_ => {
                    ...
                    this.loading = true
                }),
                ...
            )
            .subscribe(countries => {
                ...
                this.loading = false
            })
    }
    ...
}
```

## Cambiar códigos de fronteras por los nombres de los países

Necesitamos hacer varios cambios en nuestra aplicación. La primera es duplicar un servicio, pero sin que retorne null, solo debe retornar el observable de tipo `Country`.

```ts
export class CountryService {
    ...
    getCountryByCAA2Small = (cca2: string): Observable<Country> => {
        const url = `${this._endpointCountry}/${cca2}`
        return this._http.get<Country>(url, { params: this.httpParams })
    }
    ...
}
```

Luego creamos un método dentro del servicio para poder obtener un arreglo de países de acuerdo al arreglo de códigos que se nos pasen por parámetro al buscar las fronteras. Si no se pasa ningún valor en el arreglo de fronteras retornamos un array vacio como observable. En caso de que si hayan fronteras, entonces creamos un arreglo para las peticiones de tipo Arreglo de Observables de tipo País. Recorremos las fronteras y por cada código consultamos el país al que pertenece. Luego añadimos el valor de la petición al arreglo de peticiones. Por último retornamos todo el arreglo de observable combinado en uno solo mediante el operado `combineLatest` de RxJs para poder manejar una sola suscripción.

```ts
export class CountryService {
    ...
    getCountriesByCodes = (borders: string[]): Observable<Country[]> => {
        if (!borders) return of([])
        const request: Observable<Country>[]  = []
        borders.forEach(cod => {
            const req = this.getCountryByCAA2Small(cod)
            request.push(req)
        })
        return combineLatest(request)
    }
}
```

Dentro del componente cambiamos el tipo del arreglo de fronteras, y cuando interceptamos el cambio de valores de los países, capturamos las fronteras de los mismos y enviamos los bordes como parámetro a la función del servicio arriba explicado:

```ts
export class SelectorPageComponent implements OnInit {
    ...
    public borders: Country[] = []
    ...
    ngOnInit(): void {
        ...
        this.form.get('country')?.valueChanges
            .pipe(
                tap(_ => {
                    this.borders = []
                    this.form.get('border')?.reset('')
                    this.loading = true
                }),
                switchMap(cca2 => this._cs.getCountryByCAA2(cca2)),
                switchMap(country => this._cs.getCountriesByCodes(country?.borders!))
            )
            .subscribe(countries => {
                this.borders = countries
                this.loading = false
            }) 
    }
    ...
}
```

Solo necesitamos hacer 2 cambios en el template: Cambiar el valor de las options de las fronteras y el nombre que se interpola:

```html
<select class="form-control" formControlName="border">
    <option value="">-- Seleccione Frontera --</option>
    <option *ngFor="let border of borders" [value]="border.cca2">
        {{ border.name.common }}
    </option>
</select>
```
