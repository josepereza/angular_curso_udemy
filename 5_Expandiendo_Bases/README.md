# Sección 5: Expandiendo nuestras bases

Una vez sentadas las bases de Angular en la sección anterior, vamos a seguir expandiéndolas aquí, con los siguientes temas:

- Profundizar un poco más en los módulos
- FormsModule
- ngModel
- @Inputs
- @outputs
- Servicios
- Métodos en servicios
- Depuraciones

## Continuación del proyecto

Para esta sección nos basamos en proyecto realizado en la sección pasada. Para instalar los paquetes de `node_modules` usamos el comando `npm install`. Para levantar el proyecto usamos `ng serve -o`

## Módulo heroes-marvel

Para crear un componente de manera automática mediante el Angular CLI usamos el comando `ng generate module <directorio/nombre-modulo>` o más simple con el comando `ng g m <directorio/nombre-modulo>`. Una vez usado dicho comando, vamos a tener un archivo de tipo `.module.ts` en que se usa el decorador de NgModule e importa CommonModule. En nuestro caso vamos a escribir el comando `ng g m heroes-marvel`. Dentro de dicho modulo creamos un componente para la página principal, pero vamos a evitar los test, para ello escribimos el comando `ng g c heroes-marvel/main-page --skip-tests`. Si miramos el archivo `heroes-marvel.module.ts`, dentro de las declaraciones, automáticamente se ha añadido nuestro nuevo componente.

Para poder observar el contenido que pongamos en el template de nuestro nuevo componente vamos a exportarlo en el modulo de `heroes-marvel.module.ts`

```ts
...
import { MainPageComponent } from './main-page/main-page.component';


@NgModule({
    ...,
    exports: [
        MainPageComponent
    ]
})
export class HeroesMarvelModule { }
```

Luego en el archivo de `app.module.ts` importamos el modulo que acabamos de configurar:

```ts
...
import { HeroesMarvelModule } from './heroes-marvel/heroes-marvel.module';

@NgModule({
    ...,
    imports: [
        ...,
        HeroesMarvelModule
    ],
    ...
})
export class AppModule { }
```

Dentro del template del componente app ya podemos hacer uso del selector de componente `MainPageComponent`:

```html
<app-main-page></app-main-page>
```

En caso de que no reconozca los cambios inmediatamente, bajamos el servidor y usamos el comando `ng serve` para solo compilar el proyecto y que no abra una nueva pestaña en el navegador.

## Diseño de la pantalla a trabajar

Vamos a crear una pequeña estructura de como se verá nuestro proyecto. Primero vamos por el template de `main-page.component.html`:

```html
<h1>Héroes de Marvel</h1>
<hr>

<div class="row">
    <div class="col">
        <h3>Personajes - Poder</h3>
        <hr>
        <ul>
            <li>IronMan - 50,000</li>
            <li>Spider-Man - 90,000</li>
            <li>Hulk - Sin determinar</li>
            <li>Thor - 1,000,000</li>
        </ul>
    </div>
    
    <div class="col">
        <h3>Agregar</h3>
        <hr>
        <form>
            <input type="text" name="name" placeholder="Nombre">
            <input type="number" name="power" placeholder="Poder">
            <button>Agregar</button>
        </form>
    </div>
</div>
```

Y ahora determinamos las clases de CSS globales en el archivo `styles.css`:

```css
.row {
    display: flex;
}

.col {
    flex-grow: 1;
    margin: 10px;
}

input {
    display: block;
    margin: 5px;
}
```

## `FormsModule`

Cuando enviamos un formulario debemos evitar que se recargue toda la aplicación. Una estrategia es añadir un método que evite el Full Refresh, dicho método debe recibir un evento y dentro de Angular enviamos los eventos con la nomenclatura `$event`

```html
<form (submit)="add($event)">
    ...
    <button type="submit">Agregar</button>
</form>
```

Nuestro método se vería de la siguiente manera:

```ts
export class MainPageComponent {
  add = (event: any) => {
    event.preventDefault()
  }
}
```

Pero Angular dispone de modulos para manejo de formularios. Dentro del modulo `heroes-marvel.module.ts` importamos el modulo `FormsModule`:

```ts
...
import { FormsModule } from '@angular/forms';

@NgModule({
    ...,
    imports: [
        ...,
        FormsModule
    ],
    ...
})
export class HeroesMarvelModule { }
```

Para usarlo, dentro del formulario en la template usamos el evento personalizado `ngSubmit` y ya no requerimos recibir por parámetro el método:

```html
<form (ngSubmit)="add()">
    ...
    <button type="submit">Agregar</button>
</form>
```

```ts
export class MainPageComponent {
  add = () => {}
}
```

## `ngModel`

Dentro del archivo `main-page.component.ts` vamos a crear una interfaz que nos servira para tipar un objeto que vamos a usar en el template.

```ts
interface Character {
    name: string
    power: number
}

@Component({...})
export class MainPageComponent {
    public newHero: Character = {
        name: '',
        power: 0
    }
    ...
}
```

En nuestro template del componente anterior (`main-page.component.html`), vamos a usar el concepto de ***One way data binding*** y vamos a renderizar las propiedades del objeto que creamos en la lógica dentro de los inputs. Sin importar si ponemos un nuevo valor dentro de los templates, nuestro objeto no se verá afectado. Para interpolar los valores usamos la propiedad `[value]`:

```ts
<form (ngSubmit)="add()">
    <input type="text" [value]="newHero.name" placeholder="Nombre">
    <input type="number" [value]="newHero.power" placeholder="Poder">
    ...
</form>
```

Para capturar el valor podemos hacer una función que tome el valor del input cada que cambia, tomando como referencia el evento `(input)` dentro de las cajas del formulario:

```ts
...
export class MainPageComponent {
    ...
    updateName(event: any) {
        console.log(event.target.value)
    }
}
```

```html
<form (ngSubmit)="add()">
    <input type="text" [value]="newHero.name" (input)="updateName($event)" placeholder="Nombre">
    ...
</form>
```

Existe una manera que resume la lógica del valor y la entrada, que es por medio de `[(ngModel)]`, el cual cambia en tiempo real el valor de una propiedad asignada, por que ya no es necesario un método dentro de la clase para capturar el valor de ingreso.

```html
<form (ngSubmit)="add()">
    <input type="text" name="name" [(ngModel)]="newHero.name" placeholder="Nombre">
    <input type="number" name="power" [(ngModel)]="newHero.power" placeholder="Poder">
    ...
</form>
```

Si queremos ver el valor que captura el formulario, imprimimos el objeto cada que se envie el form.

```ts
...
export class MainPageComponent {
    ...
    add = () => console.log(this.newHero)
}
```

En estos momentos, al usar `[(ngModel)]` estamos empezando a tratar el concepto de ***Two way data binding***, renderizar información desde la lógica en la template, y capturar información desde el template para modificarlo en la lógica.

## Mostrar listado de personajes

Vamos a crear un arreglo de personajes, y cada que enviamos información desde el formulario la vamos a validar, agregar al arreglo y limpiar los inputs.

```ts
export class MainPageComponent {
    public characters: Character[] = [
        {
            name: 'Spider-Man',
            power: 90000
        },
        {
            name: 'Iron-Man',
            power: 55000
        }
    ]
    ...
    add = () => {
        if (this.newHero.name.trim().length === 0) return
        if (this.newHero.power === 0) return
        this.characters.push(this.newHero)
        this.newHero = {
            name: '',
            power: 0
        }
    }
}
```

Dentro del template vamos a mostrar de manera dinamica todos los personajes que esten en el arreglo:

```html
<ul *ngFor="let character of characters; let i = index">
    <li>{{i}}. {{ character.name }} - {{ character.power }}</li>
</ul>
```

Si queremos que el número que ponemos se muestre con comas o puntos para hacerlo más legible, usamos algo llamado `pipe`:

```html
<li>{{ character.power | number }}</li>
```

## Crear componentes hijos

Vamos a separar pos componente más pequeños lo que tenemos en el momento. Lo primero que vamos a separar serán los personajes. Vamos a la consola e ingresamos el siguiente comando `ng g c heroes-marvel/characters --skip-tests`. Esto nos va a hacer la declaración del componente dentro de `heroes-marvel.module.ts` y nos creara la clase, template y archivo css para nuestro componente.

Dentro de la template movemos lo relacionado con los personajes y esto marcara un error por que no reconoce el arreglo de personajes. La manera más sencilla de salir del error es creando un arreglo vacio dentro de la clase del componente.

## `@Input`

Para pasar la información de un componente padre a uno hijo, hacemos uso del decorador `@Input` dentro del componente que va a recibir la información:

```ts
export class CharactersComponent {
    @Input() personajes: any[] = []
}
```

Dentro del template padre usamos dentro del selector del componente hijo, un atributo personalizado con el nombre del atributo que espera el hijo y asignando como valor la propiedad que queremos entregar. En este caso queremos que desde el template `main-page.component.html` se le entregue al componente hijo el arreglo de personajes

```html
<app-characters [personajes]="characters"></app-characters>
```

En ese ejemplo he puesto los nombres en español e ingles para hacer la separación entre el componente padre y el componente hijo. Pero también tenemos la opción de ponerle un alías dentro del decorador `@Input()`. Por ejemplo queremos que cuando se le quiera pasar información del componente padre al hijo mediante el selector, lo haga usando la etiqueta `[data]`:

```ts
export class CharactersComponent {
    @Input('data') characters: any[] = []
}
```

```html
<app-characters [data]="characters"></app-characters>
```

Para mantener el tipado dentro del componente usamos un archivo para almacenar de manera externa las interfaces. Podemos crearla de manera manual o usando Angular CLI con el siguiente comando `ng generate interface <directorio/nombre-interfaz>` o más simple `ng g i <directorio/nombre-interfaz>`. En el caso de nuestro proyecto vamos a crear una interfaz para los personajes mediante el comando `ng g i heroes-marvel/interfaces/character` y dentro del archivo que se genera, declarar la interfaz:

```ts
export interface Character {
    name: string
    power: number
}
```

Dentro de los archivo donde tipamos mediante la interfaz, debemos hacer la importación de la misma, pero no es necesario importarla en ningun archivo de configuración de modulo ejemplo:

```ts
import { Component, Input } from '@angular/core';
import { Character } from '../interfaces/character.interface';

@Component({
    selector: 'app-characters',
    templateUrl: './characters.component.html'
})
export class CharactersComponent {
    @Input('data') characters: Character[] = []
}
```

Es opcional, pero se le puede poner al nombre del archivo de la interfaz el subfijo `.interface` como por ejemplo `character.interface.ts`. También es bueno recomendar que el nombre del archivo que almacene las interfaces sea un nombre más generico para poder inscribir varias interfaces dentro del mismo y exportarlas, para luego usarlas mediante desestructuración durante su importación.

## Tarea con inputs y modulos

Necesitamos crear un componente nuevo para mover todo el template de inscripción de un personaje y que se siga actualizando el arreglo de los personajes.

Lo primero que hacemos es crear el componente con el comando `ng g c heroes-marvel/form-add --skip-tests`, luego dentro del template de este componente copiamos lo referente al formulario, obteniendo esto:

```html
<h3>Agregar</h3>
<hr>
<form (ngSubmit)="add()">
    <input type="text" name="name" [(ngModel)]="newHero.name" placeholder="Nombre">
    <input type="number" name="power" [(ngModel)]="newHero.power" placeholder="Poder">
    <button type="submit">Agregar</button>
</form>
```

Dentro de la clase del componente movemos por completo el método de añadir, y el objeto para un nuevo personaje, y además agregamos 1 input, con lo que tendríamos dentro del componente `form-add.component.ts`:

```ts
import { Component, Input } from '@angular/core';
import { Character } from '../interfaces/character.interface';

@Component({
    selector: 'app-form-add',
    templateUrl: './form-add.component.html'
})
export class FormAddComponent {
    @Input() characters: Character[] = []

    newHero: Character = {
        name: '', power: 0
    }   

    add = () => {
        if (this.newHero.name.trim().length === 0) return
        if (this.newHero.power === 0) return
        this.characters.push(this.newHero)
        this.newHero = {
            name: '',
            power: 0
        }
        console.log(this.characters)
    }
}
```

Una vez tenemos listo el componente, pasamos a usar su selector dentro del template `main-page.component.html`:

```html
<app-form-add [characters]="characters"></app-form-add>
```

## `@Output` y `EventEmitter`

Nosotros debemos evitar que se haga una mutación de la información de un componente desde otro. El ideal sería que emita la nueva información y no se inserte de manera automática la información, solo lo pueda hacer el componente padre de la información.

Primero vamos a eliminar ei input de personajes dentro de la clase del archivo `form-add.component.ts`, y también las líneas en las que se haga referencia al mismo.

Vamos a usar el decorador `@Output` junto a una propiedad de tipo `EventEmitter`, esta última es de tipo generico, por lo que se adaptara a lo que le pasemos. En nuestro caso necesitamos emitir un nuevo personaje que usa el tipo Character:

```ts
export class FormAddComponent {
    @Output() onNewCharacter: EventEmitter<Character> = new EventEmitter<Character>()
    ...

    add = () => {
        ... 
        this.onNewCharacter.emit(this.newHero)
        ...
    }
}
```

Este evento debe ser escuchado en nuestro template `main-page.component.html` de la siguiente manera:

```html
<app-form-add (onNewCharacter)="addNewCharacter($event)"></app-form-add>
```

El nuevo método que estamos usando con el evento lo vamos a crear en la clase de `main-page.component.ts`, en donde recibe por parámetro la información mutada:

```ts
export class MainPageComponent {
    ...
    addNewCharacter = (character: Character) => {
        this.characters.push(character)
    }
}
```

## Depuración de la aplicación

Podemos escribir dentro de nuestro código la instrucción `debugger` y cuando se esté ejecutando el proyecto, vamos a observar en las herramientas de desarrollador en el navegador la instrucción se va a pausar justo en la línea de debugger. Allí podemos mirar lo que se esta recibiendo o entregando antes o despues del debugger.

```ts
export class MainPageComponent {
    ...
    addNewCharacter = (character: Character) => {
        debugger
        this.characters.push(character)
    }
}
```

En importante que está instrucción solo se use en caso de querer revisar el funcionamiento paso a paso, o para solucionar un error, y luego se elimine.

Otra manera de hacer debug en nuestra aplicación, es mediante VSCode, poniendo breakpoints al lado de las líneas de nuestro programa. Un breakpoint se identifica porque es un punto rojo que aparece justo al lado izquierdo del editor. Luego para iniciar el debug presionamos F5, seleccionamos Chrome (Preview) y esto nos genera un archivo llamado `.vscode/launch.json`. Dentro de dicho archivo configuramos el endpoint de nuestra aplicación y volvemos a presionar F5. Nos va a aparecer una pestaña de Google Chrome en una nueva ventana con nuestro proyecto.

## Servicios

Dentro de nuestro modulo `heroes-marvel`, vamos a crear un directorio llamado `services` en que vamos a crear un servicio para nuestro modulo. El archivo se va a llamar `heroes-marvel.service.ts` y va a contener una clase. Lo que da la diferencia en un servicio, es el decorador que emplea: `@Injectable()`.

Los servicios actuan como Singletons, es decir una unica instancia que va a servir a los largo de todo el modulo. Dentro del archivo `heroes-marvel.module.ts` vamos a añidir nuestro servicio como proveedor:

```ts
@NgModule({
    ...,
    providers: [HeroesMarvelService]
})
export class HeroesMarvelModule { }
```

Un servicio es como una clase abstracta que colocamos la información y/o métodos para interactuar con fuentes externas, o para manipular el estado de nuestra aplicación, un ejemplo bastante claro es cuando creamos servicios para manejar la información de que se obtiene por medio de un protocolo HTTP.

Dentro de la clase `MainPageComponent` vamos a hacer una ***Inyección de dependencias***, al llamar el servicio dentro del constructor de la clase:

```ts
export class MainPageComponent {
    ...
    constructor(private heroesMarvelService: HeroesMarvelService) { }
}
```

Si hacemos otra inyección de dependencias igual dentro dentro de un componente hijo, Angular va a reconocer que el servicio que se solicita es el mismo porque seguira con el patron Singleton para la instancia.

## Centralizar el acceso de los personajes en el servicio

Vamos a mover todo el arreglo de personajes desde el la clase `MainPageComponent` al servicios `HeroesMarvelService`.

```ts
@Injectable()
export class HeroesMarvelService {

    public characters: Character[] = [
        {
            name: 'Spider-Man',
            power: 90000
        },
        {
            name: 'Iron-Man',
            power: 55000
        }
    ]
    
    constructor() {
        console.log('Servicio inicializado')
    }
}
```

Una manera para recuperar la información del arreglo dentro de la clase `MainPageComponent`, es mediente la asignación del valor dentro del constructor usando el servicio:

```ts
...
export class MainPageComponent {
    public characters: Character[] = []

    constructor(private heroesMarvelService: HeroesMarvelService) {
        this.characters = this.heroesMarvelService.characters
    }
    ...
}
```

Otra manera es mediante un método `get`:

```ts
export class MainPageComponent {
    get characters(): Character[] {
        return this.heroesMarvelService.characters
    }

    constructor(private heroesMarvelService: HeroesMarvelService) { }
    ...
}
```

Vamos a refactorizar nuestro código. Primero vamos a descartar la inyección de dependencias y a eliminar la función de añadir un personaje dentro de la clase `MainPageComponent`, pero si vamos a pasar un valor por defecto para el nuevo heroe:

```ts
export class MainPageComponent {
    public newHero: Character = {
        name: 'Ferrer', power: 10
    }

    constructor() { }
}
```

Luego, en el template `main-page.component.html`, vamos a arreglar las referencias de los Input y los Output:

```html
<div class="row">
    <div class="col">
        <app-characters></app-characters>
    </div>
    
    <div class="col">
        <app-form-add [newHero]="newHero"></app-form-add>
    </div>
</div>
```

Dentro del componente `FormAddComponent` vamos a agregar la entrada del objeto por defecto:

```ts
export class FormAddComponent {
    ...
    @Input() newHero: Character = {
        name: '', power: 0
    }
    ...
}
```

Queremos que el acceso a los datos sea más segura en nuestro servicio, no queremos que manipulen nuestro arreglo en otro componente, solo vamos a permitir que se manipule dentro del servicio. Vamos a convertir el arreglo en una propiedad privada y luego mediante un método getter vamos a devolver un arreglo que contenga los elementos del array, pero rompiendo la referencia al mismo mediante un arreglo junto al operador spread de los personajes (`[...this._characters]`):

```ts
@Injectable()
export class HeroesMarvelService {

    private _characters: Character[] = [{...}]

    get characters(): Character[] {
        return [...this._characters]
    }
    
    constructor() {}
}
```

Dentro del componente `CharactersComponent` vamos a obtener los personajes mediante el método getter luego de hacer la inyección del dependencias con el servicio:

```ts
export class CharactersComponent {
    get characters(): Character[] {
        return this.heroesMarvelService.characters
    }

    constructor(private heroesMarvelService: HeroesMarvelService){}
}
```

## Métodos en el servicio

Vamos a crear una función dentro del Servicio para poder añadir un personaje a nuestra variable privada:

```ts
@Injectable()
export class HeroesMarvelService {
    ...
    addCharacter = (character: Character) => {
        this._characters.push(character)
    } 
}
```

Dentro del modulo `FormAddComponent` vamos a eliminar el Output, inyectamos dependencias del servicio y dentro del método de añadir, usamos el método del servicio:

```ts
@Component({
    selector: 'app-form-add',
    templateUrl: './form-add.component.html'
})
export class FormAddComponent {
    @Input() newHero: Character = {
        name: '', power: 0
    }

    constructor(private heroesMarvelService: HeroesMarvelService) {}

    add = () => {
        ...    
        this.heroesMarvelService.addCharacter(this  newHero)
        ...
    }
}
```
