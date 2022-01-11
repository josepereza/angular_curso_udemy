# Sección 23: Directivas Personalizadas en Angular

Este es un breve listado de los temas fundamentales:

- Directivas personalizadas
- Directivas estructurales personalizadas
- Manipulación del elemento del DOM que es host de la directiva
- Cambio del HTML y estilos del objeto DOM host.
- Y más

El objetivo de esta sección es crear una directiva que nos ayude a pulir la parte de mensajes de validación de los formularios reactivos, es un ejemplo real y aplicado de una directiva personalizada funcionando.

## Inicio del proyecto - DirectivasApp

Vamos a crear un nuevo proyecto con el comando `ng new directives-app`, en modo estricto, con rutas y con CSS. Para levantar el proyecto usamos el comando `ng serve -o`. Vamos a usar Bootstrap para los estilos de nuestra aplicación. Podemos encontrar la documentación en [Angular - Attribute directives](https://angular.io/guide/attribute-directives)

## Estructura de la aplicación

Vamos a usar los siguientes comandos para crear la estructura del proyecto:

- `ng g m products --routing`
- `ng g c products/pages/add-product --skip-tests -is`
- `ng g m shared`

Creamos las rutas hijas de los productos para luego poder hacer LazyLoad:

```ts
const routes: Routes = [
    {
        path: '',
        children: [
            { path: 'add-product', component: AddProductComponent },
            { path: '**', redirectTo: 'add-product' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductsRoutingModule { }
```

Luego en `AppRoutingModule` hacemos la carga perezosa:

```ts
const routes: Routes = [
    { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },
    { path: '**', redirectTo: 'products' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
```

Por último renderizamos el contenido dentro de `app.component.html`:

```html
<router-outlet></router-outlet>
```

Dentro de `add-product.component.html` creamos un pequeño formulario que nos servirá de base para el resto de la sección.

## Formulario reactivo tradicional

Necesitamos importar el módulo que nos permite tener el manejo de los formularios reactivos:

```ts
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    ...,
    imports: [
        ...,
        ReactiveFormsModule
    ]
})
export class ProductsModule { }
```

Dentro de la clase `AddProductComponent` hacemos la inyección de `FormBuilder` para luego poderlo emplear en la creación del formulario reactivo:

```ts
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class AddProductComponent {

    public form: FormGroup = this._fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]]
    })

    constructor(private _fb: FormBuilder) { }
}
```

Dentro del template asociamos el formulario con la variable de nuestra clase, y el input con la propiedad del mismo:

```html
<form [formGroup]="form">
    ...
    <input class="form-control" formControlName="name">
    ...
</form>
```

También vamos a crear un método para poder validar el campo según las validación síncronas:

```ts
export class AddProductComponent {
    ...
    isInvalidField = (field: string) => {
        return this.form.get(field)?.invalid && this.form.get(field)?.errors
    }
}
```

Usamos un `ngIf` para validar el error y mostrar y ocultar el mensaje de error:

```html
<span class="form-text text-danger" *ngIf="isInvalidField('name')">Este campo es requerido</span>
```

## Directiva Personalizada - ErrorMsg

Vamos a crear una directiva con el comando `ng g d shared/directives/error-msg --skip-tests`. Una vex creada la exportamos dentro de `SharedModule`:

```ts
import { ErrorMsgDirective } from './directives/error-msg.directive';

@NgModule({
    ...,
    exports: [
        ErrorMsgDirective
    ]
})
export class SharedModule { }
```

Dentro de `ProductsModule` hacemos la importación de `SharedModule` para poder usar sus exportaciones solo dentro del módulo de productos:

```ts
import { SharedModule } from '../shared/shared.module';

@NgModule({
    ...,
    imports: [
        ...,
        SharedModule
    ]
})
export class ProductsModule { }
```

Para usar una directiva, usamos su selector dentro del elemento HTML sobre el que se desea tener efecto:

```html
<span error-msg>Este campo es requerido</span>
```

## Directive Input - Cambiar el color del host

Dentro del constructor de la directiva hacemos la inyección de dependencias de `ElementRef` con el que podemos acceder a un elemento nativo y modificar sus propiedades. Por ejemplo cambiarle el color:

```ts
export class ErrorMsgDirective {
    constructor(private _el: ElementRef<HTMLElement>) { 
        _el.nativeElement.style.color = 'blue'
    }
}
```

Otra manera es crear una variable global que nos permita modificar las propiedades dentro de métodos especializados, los cuales se ejecutan una vez se crea el componente:

```ts
export class ErrorMsgDirective implements OnInit{

    private _htmlElement: ElementRef<HTMLElement>

    constructor(private _el: ElementRef<HTMLElement>) { 
        this._htmlElement = _el
    }

    ngOnInit() {
        this.setColor()
    }

    setColor = (): void => {
        this._htmlElement.nativeElement.style.color = 'white'
    }
}
```

También podemos recibir información mediante el decorador `@Input()`:

```ts
export class ErrorMsgDirective implements OnInit {
    @Input() public color: string = 'red'
    ...
    setColor = (): void => {
        this._htmlElement.nativeElement.style.color = this.color
    }
}
```

Dentro del template usamos la propiedad de la directiva para mostrar el nuevo color

```html
<span error-msg color="blue">Este campo es requerido</span>
```

También podemos hacer que desde el componente dueño del template creamos una propiedad dentro de la clase para luego enviarla mediante `[color]`:

```ts
export class AddProductComponent {
    public colorError: string = 'red'
    ...
}
```

```html
<span error-msg [color]="colorError">Este campo es requerido</span>
```

## Cambiar el mensaje de la etiqueta

Podemos cambiar el mensaje del span mediante una propiedad que se ingresa a la directiva:

```ts
export class ErrorMsgDirective implements OnInit {
    ...
    @Input() msg: string = 'Campo Invalido'
    ...
    ngOnInit(): void {
        ...
        this.setTextContent()
    }
    ...
    setTextContent = (): string => this._htmlElement.nativeElement.textContent = this.msg
}
```

```html
<span error-msg [color]="colorError" msg="El campo nombre es obligatorio"></span>
```

También podemos añadir de manera automática una clase CSS desde la directiva:

```ts
export class ErrorMsgDirective implements OnInit {
    ...
    ngOnInit(): void {
        ...
        this.setClassStyle()
    }
    ...
    setClassStyle = (): void => this._htmlElement.nativeElement.classList.add('form-text')
}
```

## Reaccionar a los cambios en tiempo real

Queremos que dependiendo el error, se muestre un mensaje personalizado:

```ts
export class AddProductComponent {
    public msgError!: string
    ...
    isInvalidField = (field: string): boolean => {        
        if (this.form.get(field)?.invalid && this.form.get(field)?.getError('required')) {
            this.msgError = `El campo ${field} es requerido`
            return true
        }
        if (this.form.get(field)?.invalid && this.form.get(field)?.getError('minlength')) {
            this.msgError = `El campo ${field} debe tener mínimo 3 caracteres`
            return true
        }
        return false
    }
}
```

El elemento de nuestro template, luciría de la siguiente manera:

```html
<span *ngIf="isInvalidField('name')" error-msg [color]="colorError" [msg]="msgError"></span>
```

Una manera de poder detectar los cambios en tiempo real, es mediante la implementación de la interfaz `OnChanges` dentro de la clase de la directiva:

```ts
export class ErrorMsgDirective implements OnInit, OnChanges {
    ...
    ngOnChanges(changes: SimpleChanges): void {
        const msg = changes['msg'].currentValue
        this._htmlElement.nativeElement.textContent = msg
    }
    ...
}
```

Puede ser que tengamos varios inputs dentro de nuestra directiva y diversas funciones que modifiquen los valores a ingresar, en tal caso, necesitamos ir poniendo validaciones dentro del método `ngOnChanges` para evitar que nuestra aplicación se rompa si no se notifican todo los cambios. Existe una manera mucho más optimizada y que nos evita una gran extensión del código y lo vamos a ver en el siguiente título.

## Input Setters

Una manera optima de evitar usar la implementación de la interfaz `OnChanges` dentro de la directiva, es creando método setter para cambiar el valor de una propiedad de acuerdo a lo que le envía el componente padre

```ts
export class ErrorMsgDirective implements OnInit {
    private _msg: string = 'Campo Invalido'
    ...
    @Input() set setMsg(msg: string) {
        this._htmlElement.nativeElement.textContent = msg
        this._msg = msg
    }
    ...
}
```

Pero va a ocurrir un error. Aunque tenemos una variable con un valor por defecto, si no enviamos el valor de la propiedad dentro del template, no se lee el mensaje de la variable. La solución la vamos a ver a continuación.

## Solución del problema

Los setters de los inputs se ejecutan solo si cambian su valor. Una manera de solucionar el error es usando las funciones que habíamos creado antes para modificar las variables y que se están usando en el hook `ngOnInit()`. Esto nos permite establecer por defecto un valor a las propiedades, en caso de que no nos envíen nada dentro del template:

```ts
export class ErrorMsgDirective implements OnInit {
    ...
    private _color: string = 'red'
    private _msg: string = 'Campo Invalido'

    @Input() set color(color: string) {
        this._color = color
        this.setColor()
    }
    @Input() set message(msg: string) {
        this._msg = msg
        this.setTextContent()
    }
    ...

    ngOnInit(): void {
        ...
        this.setColor()
        this.setTextContent()
    }
    ...
    setColor = (): string => this._htmlElement.nativeElement.style.color = this._color

    setTextContent = (): string => this._htmlElement.nativeElement.textContent = this._msg
}
```

## Mostrar y Ocultar si tiene error el campo

Una manera de ocultar o mostrar el elemento mediante la directiva es añadiendo o removiendo una clase de acuerdo al valor que retorna la función para validar el campo desde el componente:

```html
<span error-msg [color]="colorError" [message]="msgError" [invalid]="isInvalidField('name')"></span>
```

Dentro de la directiva tendríamos la siguiente lógica:

```ts
export class ErrorMsgDirective implements OnInit {
    ...
    private _invalid: boolean = true
    ...
    @Input() set invalid(valid: boolean) {
        this._invalid = valid
        this.setValid()
    }
    ...
    ngOnInit(): void {
        ...
        this.setValid()
    }
    ...
    setValid = () => {
        if (this._invalid) {
            this._htmlElement.nativeElement.classList.remove('hidden')
        } else {
            this._htmlElement.nativeElement.classList.add('hidden')
        }
    }
}
```

```css
.hidden {
    display: none;
}
```

Otra forma de la función sería:

```ts
export class ErrorMsgDirective implements OnInit {
    ...
    setValid = (): boolean => this._htmlElement.nativeElement.hidden = !this._invalid
}
```

## Directivas estructurales personalizadas

Vamos a crear una directiva estructural similar a `ngIf`. Lo primero será usar el comando de Angular CLI `ng g d shared/directives/custom-if --skip-tests`. Luego necesitamos exportar la directiva dentro de `SharedModule`:

```ts
import { CustomIfDirective } from './directives/custom-if.directive';

@NgModule({
    ...,
    exports: [
        ...,
        CustomIfDirective
    ]
})
export class SharedModule { }
```

Vamos a inyectar las dependencias de `TemplateRef` y `ViewContainerRef` para poder evaluar la entrada de la directiva y partir de que si la condición es verdadera o falsa, se muestre o no el contenido.

```ts
@Directive({
    selector: '[customIf]'
})
export class CustomIfDirective {

    @Input() set customIf(condition: boolean) {
        if (condition) {
            this._viewContainer.createEmbeddedView(this._templateRef)
        } else {
            this._viewContainer.clear()
        }
    }

    constructor(private _templateRef: TemplateRef<HTMLElement>, private _viewContainer: ViewContainerRef) { }
}
```

Teniendo en cuenta que nosotros dejamos el input con el mismo nombre del selector, nosotros podemos pasarle la referencia del elemento a la directiva mediante el signo `*` antes de llamar el selector:

```html
<div *customIf="!isInvalidField('name')">...</div>
```

Está sería otra manera de ocultar el mensaje de error de un campo, aunque es menos usada por su complejidad
