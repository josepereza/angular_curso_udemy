# Sección 17: Formularios Reactivos

Este es un breve listado de los temas fundamentales:

- Formularios Reactivos
- Lazyload y tareas relacionadas
- Validaciones propias de Angular
- Arreglos y objetos anidados
- FormBuilder
- FormGroup
- FormArray

Esta sección continua en la siguiente con más temas relacionados a formularios reactivos, ya que como se podrán imaginar es bastante información que digerir, pero lo importante aquí es que comprendamos que Angular cuenta con varias maneras de manejar formularios.

## Continuación del proyecto - Formularios

Vamos a seguir con la sección anterior, para instalar los módulos de node_modules usamos el comando `npm install` o `npm i`. Para levantar el proyecto usamos el comando `ng serve -o`. Dentro de los templates de los componentes reactivos vamos a copiar los templates de los componentes del módulo de `Template`. Lo único que haremos será eliminar referencias y elementos que no vamos a usar.

## Primeros pasos en formularios reactivos

La idea de los formularios reactivos, es que el template tenga muy poco HTML y la mayor parte de la lógica se pueda ubicar en el componente de TypeScript. Para usar los formularios reactivos necesitamos importar `ReactiveFormsModule` dentro del módulo a implementar, en este caso `ReactiveModule`.

```ts
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    ...,
    imports: [
        ...,
        ReactiveFormsModule
    ]
})
export class ReactiveModule { }
```

Comenzamos a crear una instancia de `FormGroup`, el cual agrega los valores de cada hijo de tipo `FormControl` dentro de un objeto, en el que cada nombre del control es una key.

```ts
export class BasicsComponent {
    public myForm: FormGroup = new FormGroup({
        'name': new FormControl('')
    })
}
```

Dentro del template del componente debemos hacer referencia al formGroup:

```html
<form [formGroup]="myForm">...</form>
```

Para hacer referencia al FormControl usamos la propiedad `formControlName` dentro del input:

```html
<input ... formControlName="name"> 
```

Es importante hacer la aclaración que dentro delos inputs de un formulario reactivo no usamos el `ngModel` a no ser que queramos hacer una referencia vacía.

## Form Builder

FormBuilder permite que se pueda tener un código limpio al usar la notación de un objeto literal de JS. Para usarlo debemos inyectarlo en nuestro componente:

```ts
export class BasicsComponent {
    ...
    constructor(private _formBuilder: FormBuilder) { }
}
```

Ahora podemos reemplazar el contenido del formulario de la siguiente manera:

```ts
export class BasicsComponent {
    public myForm: FormGroup = this._formBuilder.group({
        name: [''],
        price: [0],
        stocks: [0]
    })
    ...
}
```

La primera posición del arreglo es el contenido del control, un segundo argumento se refiere a validaciones síncronas, y un último argumento refiera las validaciones asíncronas.

## Validaciones básicas - Forms Validators

Vamos a aplicar algunos validadores síncronos en los inputs. Lo diferente a como lo hacíamos con los formularios de aproximación por template, es que ya no requerimos poner los limitantes en el HTML:

```ts
export class BasicsComponent {
    public myForm: FormGroup = this._formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        price: [0, [Validators.required, Validators.min(0)]],
        stocks: [10, [Validators.required, Validators.min(10)]]
    })
    ...
}
```

De nuevo podemos hacer que botón de envío se mantenga desactivado mientras el formulario es invalido:

```html
<button ... [disabled]="myForm.invalid">Guardar</button>
```

## Mostrar mensajes de error

Para validar los campos y mostrar un mensaje de alerta podemos crear una función que valide un campo y retorne un boleano:

```ts
export class BasicsComponent {
    ...
    isInvalidField = (field: string) => {
        return this.myForm.controls[field].errors && this.myForm.controls[field].touched
    }
}
```

Dentro del template podemos hacer lo siguiente:

```html
<span ... *ngIf="isInvalidField('name')">El nombre debe de ser de 3 letras</span>
```

## Submit del formulario

Si queremos que cuando pulsamos el botón de enviar se muestren los errores en el formulario, debemos usar un método en nuestro formulario llamado `markAllAsToched()`. Primero creamos una función para asociar la función de envío:

```html
<form (ngSubmit)="save()" autocomplete="off" [formGroup]="myForm">
    ...
    <button type="submit" class="btn btn-primary float-end">Guardar</button>
</form>
```

Dentro de nuestro componente creamos la función para enviar, en la que se valida si el formulario es valido y se reseta el formulario una vez enviado:

```ts
export class BasicsComponent {
    ...
    save = () => {
        if (this.myForm.invalid) {
            this.myForm.markAllAsTouched()
            return
        }
        this.myForm.reset()
    }
}
```

Si queremos que formulario tenga valores por defecto al iniciar, entonces usamos la interfaz `OnInit` y dentro del método implementado usado el método `setValue()` del formulario. El problema será que para usar dicha función, todos los campos si o sí deben tener un valor, de lo contrario genera un error:

```ts
export class BasicsComponent implements OnInit {
    ...
    ngOnInit(): void {
        this.myForm.setValue({
            name: 'Predeterminado',
            price: 0,
            stocks: 0
        })
    }
    ...
}
```

Una estrategia diferente y más practica es usar `reset()` para poder definir solo uns campos, y además nos mantiene el Pristine:

```ts
export class BasicsComponent implements OnInit {
    ...
    ngOnInit(): void {
        this.myForm.setValue({
            name: 'Predeterminado'
        })
    }
    ...
}
```

## Tarea: Validar un campo nuevo

La idea es aplicar lo mismo que hemos hecho en el componente de `BasicComponent`, pero con el campo de `name` dentro del componente `DynamicComponent`:

```ts
export class DynamicComponent implements OnInit {
    public myForm: FormGroup = this._formBuilder.group({
        name: [, [Validators.required, Validators.minLength(3)]]
    })

    constructor(private _formBuilder: FormBuilder) { }

    ngOnInit(): void {
    }

    isInvalidField = (field: string) => {
        return this.myForm.controls[field].errors && this.myForm.controls[field].touched
    }

    save = () => {
        if (this.myForm.invalid) {
            this.myForm.markAllAsTouched()
            return
        }
        console.log(this.myForm.value)
    }
}
```

Dentro de nuestro template enlazamos el formulario y el nombre dl control:

```html
<form autocomplete="off" [formGroup]="myForm" (ngSubmit)="save()">
    <div class="mb-3 row">
        <div class="col-sm-3 col-form-label">Nombre</div>
        <div class="col-sm-9">
            <input type="text" class="form-control" placeholder="Nombre de la persona" formControlName="name">
            <span class="form-text text-danger" *ngIf="isInvalidField('name')">El nombre debe tener más de 3 letras</span>
        </div>
    </div>
    ...
    <div class="row">
        <div class="col-sm-12">
            <button tupe="submit" class="btn btn-primary float-end">Guardar</button>
        </div>
    </div>
</form>
```

## Form Array

En el caso de que queremos añadir inputs de manera dinámica cada que se ingresa un nuevo valor, vamos a usar `FormArray`:

```ts
export class DynamicComponent implements OnInit {
    public myForm: FormGroup = this._formBuilder.group({
        ...,
        favorites: this._formBuilder.array([], [Validators.required])
    })
    ...
}
```

Dentro de ese nuevo arreglo, añadimos los controles que queremos, a los cuales también podemos pasarles validaciones:

```ts
export class DynamicComponent implements OnInit {
    public myForm: FormGroup = this._formBuilder.group({
        ...,
        favorites: this._formBuilder.array([
            ['Metal Gear', Validators.required],
            ['Death Stranding', Validators.required]
        ], Validators.required)
    })
    ...
}
```

Para poder enlazar la información de nuestro arreglo con los inputs dinámicos podemos hacer lo siguiente en el template: Usamos un `*ngFor` para poder recorrer los controles dentro del arreglo de controles y luego asociamos el indice al input (es importante usar `[formControlName]` ya que es un elemento de lógica y no un simple string).

```html
<div formArrayName="favorites" >
    <div *ngFor="let fav of myForm.controls['favorites']?.controls; let i = index">
        <input [formControlName]= 'i'>
        <button>X</button>
    </div>
</div>
```

Lo anterior es teoricamente correcto, pero genera un error en el `*ngFor`, por lo tanto mejor creamos un getter para poder obtener los controles que están dentro del arreglo. Dicho getter le da el tipado al arreglo para poderlo mostrar como un `FormArray`:

```ts
export class DynamicComponent implements OnInit {
    ...
    get favoritesArr() {
        return this.myForm.get('favorites') as FormArray
    }
    ...
}
```

Ahora si podemos solucionar el error en el template:

```html
<div *ngFor="let fav of favoritesArr.controls; let i = index">
```

## Agregar Controles al FormArray

Vamos a crear un control independiente que vamos a usar para el input de agregar:

```ts
export class DynamicComponent implements OnInit {
    ...
    public newFavorite: FormControl = this._formBuilder.control('', Validators.required)
    ...
}
```

Como es un control independiente, la manera de referenciarlo en el template es un poco diferente:

```html
<div> 
    <div>Agregar</div>
    <div>
        <div>
            <input class="form-control" placeholder="Agregar favorito" [formControl]="newFavorite">
            <button type="button">Agregar</button>
        </div>
    </div>
</div>
```

Para darle funcionalidad a agregar, creamos un método que le valide si el control independiente es invalido. Si el control pasa la validación, entonces añade un nuevo elemento al array que traemos mediante el getter. Dicho elemento es un control con el valor del control indendiente y que siempre es requerido. Por último limpiamos el input.

```ts
export class DynamicComponent implements OnInit {
    ...
    addFav = () => {
        if (this.newFavorite.invalid) return
        this.favoritesArr.push(new FormControl(this.newFavorite.value, Validators.required))
        this.newFavorite.reset()
    }
    ...
}
```

En el template asociamos la función en 2 lugares:

```html
<div>
    <div>Agregar</div>
    <div>
        <div>
            <input ... [formControl]="newFavorite" (keyup.enter)="addFav()">
            <button ... (click)="addFav()">Agregar</button>
        </div>
    </div>
</div>
```

## Eliminar elementos de un FormArray

Para eliminar un elementos del array de tipo `FormArray` escribimos la siguiente lógica:

```ts
export class DynamicComponent implements OnInit {
    ...
    deleteFav = (index: number) => this.favoritesArr.removeAt(index)
    ...
}
```

Dentro del template llamamos la función de la siguiente manera:

```html
<div *ngFor="let fav of favoritesArr.controls; let i = index">
    <input [formControlName]= 'i'>
    <button (click)="deleteFav(i)">X</button>
</div>
```

Si se borran todos los favoritos y se trata de enviar vacio el formulario, se muestra un error, puesto que pusimos un validador al crear el `FormArray`

## Formularios Reactivos: Switches

Dentro de `SwitchesComponent` hacemos la inyección de dependencias de `FormBuilder` y luego lo empleamos para crear un formulario:

```ts
export class SwitchesComponent {

    public myForm: FormGroup = this._fb.group({
        genre: ['', Validators.required],
        notifications: [false, Validators.required]
    })
    
    constructor(private _fb: FormBuilder) { }
}
```

Si queremos valores por defecto, podemos simular la respuesta de una petición y pasar los valores dentro de un objeto que se inscribe en el `ngOnInit` como los campos iniciales del formulario:

```ts
export class SwitchesComponent implements OnInit {
    ...
    public person = {
        genre: 'M',
        notifications: true
    }
    ...
    ngOnInit(): void {
        this.myForm.reset({...this.person})
    }
}
```

También vamos a crear el control dentro del formulario para el input de los términos y condiciones.

```ts
export class SwitchesComponent implements OnInit {
    public myForm: FormGroup = this._fb.group({
        ...,
        terms: [false, Validators.required]
    })
    ...
}
```

Luego de asociarlo al HTML, observamos que se genera un comportamiento particular, aparece en null y el formulario es invalido, lo seleccionamos y tanto el campo como el formulario cambian su estado, pero si quitamos el check, entonces el formulario aún en valido. Para arreglar este error vamos a ponerle un valor por defecto al iniciar el formulario y un requerimiento para que el formulario sea valido solo si el check está marcado:

```ts
export class SwitchesComponent implements OnInit {

    public myForm: FormGroup = this._fb.group({
        ...,
        terms: [false, Validators.requiredTrue]
    })
    ...
    ngOnInit(): void {
        this.myForm.reset({
            ...this.person,
            terms: false
        })
    }
}
```

## Actualizar el valor de la persona

Podemos actualizar la información de la persona cuando presionamos el botón de envío:

```ts
export class SwitchesComponent implements OnInit {
    ...
    save = () => {
        if (this.myForm.invalid){
            this.myForm.markAllAsTouched()
            return
        }
        const formValue = {...this.myForm.value}
        delete formValue.terms

        this.person = formValue
    }
}
```

O también podemos suscribirnos en tiempo real a los cambios del formulario y de ser necesario ignorar los campos que no deberían estar en el objeto persona:

```ts
export class SwitchesComponent implements OnInit {
    ...
    ngOnInit(): void {
        this.myForm.reset({
            ...this.person,
            terms: false
        })

        this.myForm.valueChanges.subscribe(form => {
            delete form.terms
            this.person = form
        } )
    }
    ...
}
```

También se puede hacer mediante desestructuración:

```ts
export class SwitchesComponent implements OnInit {
    ...
    ngOnInit(): void {
        this.myForm.reset({
            ...this.person,
            terms: false
        })

        this.myForm.valueChanges.subscribe(({ terms, ...form }) => {
            this.person = form
        } )
    }
    ...
}
```
