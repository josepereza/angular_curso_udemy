# Sección 16: Formularios - Template y LazyLoad

Este es un breve listado de los temas fundamentales:

- Template driven
- ViewChild
- Two way databinding
- Formularios dinámicos
- Checks, radios y switches
- Directivas personalizadas - Nota: este tema se cubre a profundidad después en una sección especializada
- Manejo del formulario y validaciones
- Encapsular módulos y scope de los mismos

Este es un tema fundamental, pero no es el único, hay varias formas de manejar el estado de un formulario, principalmente tenemos Template driven y Model Driven o formularios reactivos, en esta sección trabajaremos con formularios por template.

## Inicio de la Sección - Formularios

Vamos a crear un nuevo proyecto con el comando `ng new formularios-app`. Vamos a dejar el modo estricto, seleccionamos las rutas y dejamos CSS como formato de la hoja de estilos. Vamos a usar Bootstrap como framework de CSS, por lo que copiamos el CDN dentro del header del archivo `index.html`.

```html
<head>
    ...
    <!-- CSS Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
</head>
```

Para levantar el proyecto usamos el comando `ng serve -o`.

## Creación de módulos necesarios

Vamos a crear un módulo shared con el comando `ng g m shared`, dentro del mismo, creamos un componente para el sidemenu con el comando `ng g c shared/sidemenu --skip-tests -is`. Dentro de `AppModule` hacemos la importación del módulo shared:

```ts
import { SharedModule } from './shared/shared.module';

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

Para poder hacer visible el componente SideMenu dentro de nuestra App, necesitamos exportar el componente dentro de `SharedModule`:

```ts
import { SidemenuComponent } from './sidemenu/sidemenu.component';

@NgModule({
    ...,
    exports: [
        SidemenuComponent
    ]
})
export class SharedModule { }
```

Vamos a crear un módulo con rutas hijas y lo vamos a hacer de manera directa con el comando de Angular CLI: `ng g m template --routing`. También vamos a crear otro módulo nuevamente con el comando `ng g m reactive --routing`.

## Componentes y LazyLoad de formularios

Vamos a crear los componente del módulo `reactive`:

- `ng g c reactive/pages/basics --skip-tests -is`
- `ng g c reactive/pages/dynamic --skip-tests -is`
- `ng g c reactive/pages/switches --skip-tests -is`

Ahora definimos las rutas de los componentes que acabamos de crear:

```ts
const routes: Routes = [
    {
        path: '', children: [
            { path: 'basics', component: BasicsComponent },
            { path: 'dynamic', component: DynamicComponent },
            { path: 'switches', component: SwitchesComponent },
            { path: '**', redirectTo: 'basics' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReactiveRoutingModule { }
```

Dentro del módulo `template` vamos a crear los mismos componentes:

- `ng g c template/pages/basics --skip-tests -is`
- `ng g c template/pages/dynamic --skip-tests -is`
- `ng g c template/pages/switches --skip-tests -is`

Y hacemos la misma configuración de las rutas:

```ts
const routes: Routes = [
    {
        path: '', children: [
            { path: 'basics', component: BasicsComponent },
            { path: 'dynamic', component: DynamicComponent },
            { path: 'switches', component: SwitchesComponent },
            { path: '**', redirectTo: 'basics' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TemplateRoutingModule { }
```

Vamos a cargar las rutas mediante LazyLoad, por lo que dentro de `AppRoutingModule` configuramos el arreglo de rutas de la siguiente manera:

```ts
const routes: Routes = [
    { path: 'reactive', loadChildren: () => import('./reactive/reactive.module').then(m => m.ReactiveModule) },
    { path: 'template', loadChildren: () => import('./template/template.module').then(m => m.TemplateModule) },
    { path: '**', redirectTo: 'reactive' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
```

## SideMenu

Para poder usar las rutas dentro del SideMenu, requerimos hacer la importación de `RouterModule` dentro del módule de Shared:

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

Vamos a crear una interfaz para lo items del menu lateral:

```ts
export interface MenuItem {
    text: string;
    path: string;
}
```

Dentro de `SidemenuComponent` vamos a crear 2 arreglos para las rutas de los formularios template y reactivos:

```ts
export class SidemenuComponent {
    public templateMenu: MenuItem[] = [
        { text: 'Básicos', path: './template/basics' },
        { text: 'Dinámicos', path: './template/dynamic' },
        { text: 'Switches', path: './template/switches' }
    ]

    public reactiveMenu: MenuItem[] = [
        { text: 'Básicos', path: './reactive/basics' },
        { text: 'Dinámicos', path: './reactive/dynamic' },
        { text: 'Switches', path: './reactive/switches' }
    ]
}
```

Dentro del template `sidemenu.component.html` vamos a hacer la interpolación de la data:

```html
<h2>Template</h2>
<hr>

<ul class="list-group">
    <li *ngFor="let item of templateMenu" [routerLink]="item.path" routerLinkActive="active" class="list-group-item" >
        {{ item.text }}
    </li>
</ul>



<h2 class="mt-5">Reactive</h2>
<hr>

<ul class="list-group">
    <li *ngFor="let item of reactiveMenu" [routerLink]="item.path" routerLinkActive="active" class="list-group-item" >
        {{ item.text }}
    </li>
</ul>
```

## Template: Diseño del formulario básico

La diferencias entre Template y Reactive, es que la aproximación por template le permite a Angular manejar la mayor parte del formulario desde el lado del HTML. Los formularios reactivos procuran que el html sea lo más sencillo posible y que la lógica se tenga en el componente de TS.

Dentro de `basic.component.html` vamos a crear la estructura de un formulario para agregar un producto, su precio y las existencias del mismo.

## Template: FormsModule

Para poder hacer uso de la aproximación por template, debemos hacer la importación de `FormsModule` dentro de `TemplateModule`:

```ts
import { FormsModule } from '@angular/forms';


@NgModule({
    ...,
    imports: [
        ...,
        FormsModule
    ]
})
export class TemplateModule { }
```

Sabemos que FormsModule está funcionando correctamente cuando al presionar el botón de enviar en el formulario, no se recarga la página. Para poder obtener la información del formulario, debemos crear una referencia al mismo y pasarlo a un método que pueda capturar por parámetro dicha información:

```html
<form (ngSubmit)="save(myForm.value)" #myForm="ngForm">...</form>
```

```ts
export class BasicsComponent implements OnInit {
    ...
    save = (form: NgForm) => {
        console.log(form)
    }
}
```

Para decirle al formulario que los input son parte del mismo usamos el atributo `ngModel` acompañado del atributo `name`:

```html
<input ... ngModel name="product">
```

Podemos observar el estado de nuestro formulario junto a lo que se ingresa en mismo en tiempo real:

```html
<div class="row">
    <div class="col">
        <span>Valid</span>
        <pre>{{ myForm.valid | json }}</pre>
        <span>Valor</span>
        <pre>{{ myForm.value | json }}</pre>
    </div>
</div>
```

## Template: Mostrar mensajes de error

Vamos a observar otras 2 propiedades del formulario: `Pristine` se muestra cuando no se ha alterado la información inicial con la que se presenta el formulario. `Touched` presenta si el usuario ha tocado el formulario, no es necesario modificar la data.

```html
<div class="row">
    <div class="col">
        <span>Pristine</span>
        <pre>{{ myForm.pristine | json }}</pre>

        <span>Touched</span>
        <pre>{{ myForm.touched | json }}</pre>
    </div>
</div>
```

Podemos ponerle alguna regla de validación a los inputs para poder determinar si el formulario es valido o no. Hasta que no se cumpla la condición, no se cambia el estado del formulario de false a true:

```html
<input ... required minlength="3">
```

Para mostrar un error podemos usar las propiedades de invalid, touched, pristine o cualquier otra que sea conveniente a lo que pretendemos hacer. En este caso necesitamos comprobar que el input del nombre del producto sea valido, en caso contrario y mientras se haya tocado el formulario, se muestra un mensaje de error.

```html
<span *ngIf="myForm.controls['product']?.invalid && myForm.touched" class="form-text text-danger">Debe de ser de 3 letras</span>
```

La aproximación por template puede hacerse muy largo, pero podemos optimizarla.

## ViewChild

La referencia que tenemos dentro del template (`#myForm`), es una referencia local, pero nosotros necesitamos una referencia de nuestro formulario dentro del componente en TypeScript, por lo que usamos el decorador `@ViewChild()` junto al *Non-Null Assertion Operator*, y con ello ya no tenemos que enviar la referencia del formulario mediante un parámetro de una función:

```ts
export class BasicsComponent {
    @ViewChild('myForm') public form!: NgForm
    ...
    save = () => console.log(this.form)
}
```

Dentro de la misma clase podemos crear un método que evalué las condiciones en las que nuestro input es valido, y luego podemos entregar la función dentro del `*ngIf`:

```ts
export class BasicsComponent implements OnInit {
    @ViewChild('myForm', {static: true}) public form!: NgForm
    ... 
    validProduct = (): boolean => {
        return this.form?.controls['product']?.invalid && this.form?.controls['product']?.touched
    }
    ...
}
```

```html
<span *ngIf="validProduct()" class="form-text text-danger">Debe de ser de 3 letras</span>
```

## Template: Validar número igual o mayor a 0

Queremos validar que el valor que se ingresa dentro del input del precio sea mayor o igual a 0, además de que será un campo requerido. Lo primero será poner indicaciones en input:

```html
<input ... type="number" ngModel name="price" required min="0">
<span *ngIf="validPrice()" class="form-text text-danger">El precio debe ser mayor o igual a 0</span>
```

En la lógica del componente creamos una función para evaluar el contenido y dependiendo el caso mostrar el error:

```ts
export class BasicsComponent implements OnInit {
    ...
    validPrice = (): boolean => {
        return this.form?.value.price < 0 || this.form?.value.price === '' && this.form?.controls['price']?.touched
    }
    ...
}
```

También podemos hacer que el botón de envió esté desactivado mientras el formulario es invalido:

```html
<button ... [disabled]="myForm.invalid">Guardar</button>
```

## Directivas personalizadas - CustomMin (Opcional)

Vamos a crear un folder para las directivas dentro del módulo Template, en este caso haremos una de manera manual. En próximas secciones se miraran a fondo las directivas.

Dentro del input de las existencias vamos a poner el selector que vamos a usar para nuestra directiva y también una propiedad que vamos a extender desde nuestra directiva:

```html
<input customMin [minimum]="10" required>
```

Nuestra directiva solo va a actuar en aquellos lugares que tengan un ngModel asociado:

```ts
import { Directive, Input } from "@angular/core";

@Directive({
    selector: '[customMin] [ngModel]'
})
export class CustomMinDirective { }
```

Nuestras directivas deben estar provistas dentro del módulo que las va a usar, por lo que dentro de `TemplateModule` vamos a declararla:

```ts
import { CustomMinDirective } from './directives/custom-min.directive';


@NgModule({
    declarations: [
        ...,
        CustomMinDirective
    ],
    ...
})
export class TemplateModule { }
```

Nuestra directiva implementa la interfaz `Validator`, de la cual usamos la función `validate` en la que comparamos el valor que se ingresa por el input vs el valor de la propiedad que le hemos extendido. Además se cuenta con algunos providers para su correcto funcionamiento (en próximas secciones se explica):

```ts
@Directive({
    selector: '[customMin] [ngModel]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: CustomMinDirective,
        multi: true
    }]
})
export class CustomMinDirective implements Validator {
    @Input() public minimum!: number

    constructor() { }

    validate(control: FormControl) {
        const inputValue = control.value
        return (inputValue < this.minimum) ? { 'customMin': true } : null
    }
}
```

Si queremos ver como está funcionando la directiva, podemos escribir lo siguiente en nuestro template:

```html
<span>Custom Directives</span>
<pre>{{ myForm.controls['stocks'].errors | json }}</pre>
```

## Template: Limpiar Formulario

Una vez enviemos el formulario deberíamos resetear los campos, pero si lo hacemos de la forma "tradicional" los errores se mostrarían puesto que no se actualizan las propiedades de `prisine` y `touched`. Lo bueno es que en Angular ya tenemos la referencia a nuestro formulario, el cual cuenta con la propiedad `resetForm()`:

```ts
export class BasicsComponent implements OnInit {
    ...
    save = () => {
        this.form.resetForm()
    }
}
```

E incluso podemos pasarle valores por defecto una vez se haga el reset del formulario:

```ts
export class BasicsComponent implements OnInit {
    ...
    save = () => {
        this.form.resetForm({
            price: 0,
            stocks: 0
        })
    }
}
```

## Template: Formularios dinámicos y arreglos

Creamos un formulario dentro de `dynamic.component.ts`, y volvemos a aplicar la referencia local del formulario y algunas validaciones sobre los errores:

```html
<form (ngSubmit)="save()" #myForm="ngForm" autocomplete="off">
    ...
    <input ... ngModel name="name" minlength="3" required>
    <span ... *ngIf="myForm.controls['name']?.invalid && myForm.controls['name']?.touched">Debe ser más de 3 letras</span>

    ...

    <button ... (click)="save()" [disabled]="myForm.invalid">Guardar</button>

    ...
</form>
```

## Agregar elementos de manera dinámica

Vamos a crear una interfaz dentro del módulo de template para poder darle un tipado a los elementos que vamos a añadir a un objeto con arreglo. El archivo se llama `dynamic.interface.ts`:

```ts
export interface Person {
    name: string;
    favorites: Favorites[];
}


export interface Favorites {
    id: number;
    name: string;
}
```

Cremaos un objeto de prueba dentro del componente `DynamicComponent`:

```ts
export class DynamicComponent implements OnInit {
    public person: Person = {
        name: 'David Ferrer',
        favorites: [
            { id: 1, name: 'Batman' },
            { id: 2, name: 'Spider-Man' }
        ]
    }
    ...
}
```

Dentro del template hacemos una interpolación de la data, tanto para el nombre, como para los elementos dentro del array de favoritos:

```html
<input ... [ngModel]="person.name" name="name">

...

<input *ngFor="let game of person.favorites; let i = index" [ngModel]="game.name" name="game_{{i}}" required>

...
```

Cuando tenemos los inputs de los juegos favoritos, necesitamos actualizar la data cada que se hace un cambio en la entrada. Por tal razón en vez de solo escuchar `[ngModel]` debemos emitir con `[(ngModel)]`, de esa manera ya se actualiza la información con lo que se está ingresando:

```html
<input *ngFor="let game of person.favorites; let i = index" [(ngModel)]="game.name" name="game_{{i}}" required>
```

## Eliminar elemento creado de forma dinámica

Vamos a crear un div para agrupar los juegos favoritos con un botón que permita la eliminación de los mismos, por lo que tendremos la siguiente nueva estructura:

```html
<div class="input-group" *ngFor="let game of person.favorites; let i = index" >
    <input class="form-control" [(ngModel)]="game.name" name="game_{{i}}" required>
    <button class="btn btn-outline-danger" type="button" (click)="delete(i)>Eliminar</button>
</div>
```

Vamos a añadirle funcionalidad a eliminar. Necesitamos eliminar el elemento que se encuentra en el indice que se ingresa por parámetro:

```ts
export class DynamicComponent implements OnInit {
    ...
    delete = (index: number) => {
        this.person.favorites.splice(index, 1)
    }
    ...
}
```

## Agregar juegos favoritos

Necesitamos emitir un string desde el formulario para el nombre del nuevo juego:

```html
<div class="input-group">
    <input class="form-control" placeholder="Agregar favorito" [(ngModel)]="newGame" name="new-game">
    <button class="btn btn-dark" type="button" (click)="addGame()">Agregar</button>
</div>
```

Dentro de `DynamicComponent` creamos la variable para almacenar el nombre de la variable y le damos funcionalidad al método de añadir. Este mérodo crear un nuevo objeto del juego favorito y luego hace un push al objeto persona con un objeto que usa el operado spread `...` para esparcir todas las propiedades del nuevo juego, por último se limpia el input:

```ts
export class DynamicComponent implements OnInit {
    ...
    public newGame: string = ''
    ...
    addGame = () => {
        const newFavorite: Favorites = {
            id: this.person.favorites.length + 1,
            name: this.newGame
        }

        this.person.favorites.push({...newFavorite})
        this.newGame = ''
    }
    ...
}
```

Si queremos que también se pueda añadir un nuevo objeto mediante el enter, usamos la siguiente línea:

```html
<input ... [(ngModel)]="newGame" name="new-game" (keyup.enter)="addGame()">
```

## Template: RadioCheck y Switches

Vamos a hacer la estructura para la página de los radios, checks y switches, copiando ejemplos de la documentación de Bootstrap. La idea es que no dejemos nada marcado por defecto, ya que esto lo haremos mediante la lógica del componente.

## Template: Validando Radios, Checks y Switches

Vamos a crear un objeto para almacenar las selecciones:

```ts
export class SwitchesComponent {

    public person = {
        genre: '',
        notifications: true
    }

    public termsAndConditions: boolean = false
}
```

Dentro de los radios vamos a definirles un valor y a emitir la elección:

```html
<input ... type="radio" value="M" [(ngModel)]="person.genre">
```

Si queremos que si o si se seleccione uno de los radios, entonces debemos poner la propiedad required en ambos radios:

```html
<input ... type="radio" required>
```

Para el tema de los switches necesitamos emitir su valor y darles un nombre

```html
<input ... type="checkbox" role="switch" [(ngModel)]="person.notifications" name="notifications">
```

En el caso del checkbox, en este caso queremos que si no está seleccionado entonces no se pueda enviar el formulario. Por lo tanto necesitamos que emita su valor y solo sea parte del formulario y no del objeto persona.

```html
<input ... type="checkbox" name="termsAndConditions" [(ngModel)]="termsAndConditions" required>
```
