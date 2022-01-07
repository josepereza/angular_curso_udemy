# Sección 20: LifeCycle Hooks

Esta sección está enfocada en hablar y explicar todos los pasos del ciclo de vida de un componente (también se aplican a las directivas que veremos después). No es una sección muy larga, pero mi objetivo es guiarlos en la documentación oficial y hacer un par de ejemplos con ellos. Luego de esta sección hay más aplicaciones que hacen uso de ciertos pasos del ciclo de vida de los componentes que comprenderemos gracias a esta sección. También estos pasos, son conocidos como Hooks, que posiblemente haz escuchado en React, pero funcionan diferente, pero comparten la similitud de que son Métodos (o funciones) que se ejecutan cuando algo sucede en un componente.

## Inicio del proyecto - LifeCycle

Vamos a crear un nuevo proyecto con el comando `ng new lifecycle`, lo aplicamos en modo estricto, no vamos a usar routing y empleamos CSS. Para levantar el proyecto usamos el comando `ng serve -o`. Podemos acceder a la documentación de [Lifecyle hooks](https://angular.io/guide/lifecycle-hooks) que nos brinda Angular.

Vamos a crear dos componentes con los comandos:

- `ng g c pages/page1 --skip-tests -is`
- `ng g c pages/show-name --skip-tests -is`

## Implementar todos los hooks del ciclo de vida

Un hook es una función o método que nos permite reaccionar a los cambios en el ciclo de vida de un componente en Angular. Dentro de un componente tenemos el constructor, el cual empleamos para hacer la inyección de las dependencias que necesitamos, o para darle una inicialización antes de que el HTML se construya.

```ts
export class Page1Component {
    constructor() {
        console.log('hola const')
    }
}
```

El hook `ngOnInit()` nos permite darle la información al componente una vez el HTML termine de construirse, comúnmente lo empleamos para peticiones HTTP, traer información de los servicios y demás, todo con el fin de llenar de manera segura la información del componente.

```ts
export class Page1Component implements OnInit {
    ...
    ngOnInit(): void {
        console.log('desde el init')
    }
}
```

Los hook de los ciclos de vida los implementamos de las siguientes interfaces:

```ts
import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

export class Page1Component implements 
        OnInit, 
        OnChanges, 
        DoCheck, 
        AfterContentInit, 
        AfterContentChecked, 
        AfterViewInit, 
        AfterViewChecked, 
        OnDestroy 
{
    ...
    ngOnInit(): void {
        console.log('ngOnInit')
    }
    ngOnChanges(changes: SimpleChanges): void {
        console.log('ngOnChanges')
    }
    ngDoCheck(): void {
        console.log('ngDoCheck')
    }
    ngAfterContentInit(): void {
        console.log('ngAfterContentInit')
    }
    ngAfterContentChecked(): void {
        console.log('ngAfterContentChecked')
    }
    ngAfterViewInit(): void {
        console.log('ngAfterViewInit')
    }
    ngAfterViewChecked(): void {
        console.log('ngAfterViewChecked')
    }
    ngOnDestroy(): void {
        console.log('ngOnDestroy')
    }
}
```

## Explicación sobre los ciclos de vida

- El hook `ngOnChanges()` se llama cuando el componente tiene o provee inputs (`@Input()`) y estos presentan cambios.
- El hook `ngOnDestroy()` es llamado inmediatamente después cuando Angular destruye directivas o un componente, es bastante útil para hacer limpieza de observables, desconectar controladores de eventos para evitar pérdidas de memoria, o purgar información. Podemos observar cuando se destruye un componente, por ejemplo, en la clase `AppComponent` creamos una bandera:

    ```ts
    export class AppComponent {
        show: boolean = true
    }
    ```

    Dentro de `app.component.html` creamos un botón que va a cambiar el estado de la variable, y ponemos la aparición de `page1` de manera condicional:

    ```html
    <button (click)="show = !show">{{ !show ? 'Mostrar' : 'Ocultar'}}</button>
    <app-page1 *ngIf="show"></app-page1>
    ```

    Si observamos en el inspector del navegador, nos daremos cuenta de que cada que "ocultamos" el componente, en realidad lo estamos haciendo desaparecer de manera textual. A eso se le llama "destroy".

- Los hooks `ngDoCheck`, `ngAfterContentChecked` y `ngAfterViewChecked` se ejecutan justo después de que debemos hacer la renderización del componente luego de la interacción con alguno elemento como una caja texto o un botón. `ngDoCheck` actuá luego de detectar los cambios que Angular no puede detectar por si solo. `ngAfterContentChecked` responde después de que Angular verifica el contenido proyectado en la directiva o componente. `ngAfterViewChecked` responde después de que Angular verifica las vistas del componente y las vistas secundarias o la vista que contiene la directiva.

## `ngOnChanges()`

Podemos observar el comportamiento de este hook, por ejemplo, usando un `@Input()`:

```ts
export class ShowNameComponent implements OnInit, OnChanges {
    @Input() name!: string

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
    }

    ngOnInit(): void {
        console.log('init')
    }
}
```

Vamos a llamar el selector dentro de `page1.component.html`:

```html
<app-show-name name="carlos"></app-show-name>
```

Cuando observamos la consola, nos damos cuenta de que lo primero que se imprime es un objeto con una key del nombre del input y un valor de tipo `SingleChange`. Luego se ejecuta de segundo el `ngOnInit()`. Ahora, si enlazamos la variable con un nombre que se pasa por medio de un formulario desde el componente padre, vamos a observar que por cada cambio se ejecuta el hook `ngOnChanges`.

```ts
export class Page1Component {
    public name!: string
    save = () => {}
}
```

```html
<h2>Page 1</h2>
<input type="text" [(ngModel)]="name">
<button (click)="save()">Click</button>


<h2>Show Name</h2>
<app-show-name [name]="name"></app-show-name>
```

El objeto `SimpleChange` tiene 3 propiedades fundamentales: `currentValue`, `firstChange` y `previousValue`. Cada que se ejecuta el hook `ngOnChanges` observamos que el valor actual es el que se está ingresando el en momento, si es la primera vez que aparece el cambio el segundo elemento se torna en true, en caso contrario se muestra en false y además en el tercer elemento se muestra cual era su valor anterior.

## `ngOnDestroy()`

Dentro de la clase `Page1Component` vamos a crear una variable para un secundero, su valor lo vamos a incrementar mediante un operador de RxJs llamado `interval`. Este incremento lo vamos a hacer dentro del hook `ngOnInit()`:

```ts
import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { interval } from 'rxjs';

@Component({
    selector: 'app-page1',
    templateUrl: './page1.component.html',
    styles: [
    ]
})
export class Page1Component implements OnInit {
    public seconds: number = 0

    ngOnInit(): void {
        interval(1000).subscribe( i => this.seconds = i)
    }
}
```

Si nosotros ocultamos y volvemos a mostrar la sección donde se está renderizando, vamos a observar que el observable sigue emitiendo valores dejando que tengamos una fuga de memoria, y esto lo podemos observar cuando implementamos los hooks `ngDoCheck`, `ngAfterContentChecked` y `ngAfterViewChecked` e imprimimos un mensaje simple en cada uno.

Nosotros podemos no necesitar terminar las suscripciones si los observables emiten un único valor. Pero en el caso de ester intervalo necesitamos cancelar la suscripción cada que oculta o destruye el componente. Para ello necesitamos crear una variable que nos permite guardar la suscripción para posteriormente cancelarla:

```ts
export class Page1Component implements OnInit, OnDestroy {

    public seconds: number = 0
    public timerSubscription!: Subscription

    ngOnInit(): void {
        this.timerSubscription = interval(1000).subscribe( i => this.seconds = i)
    }
    ngOnDestroy(): void {
        this.timerSubscription.unsubscribe()
    }
}
```
