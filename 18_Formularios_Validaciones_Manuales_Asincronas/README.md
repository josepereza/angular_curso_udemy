# Sección 18: Formularios: Validaciones manuales y Asíncronas

Este es un breve listado de los temas fundamentales:

- Validaciones manuales.
- Validaciones asíncronas.
- Validar contra expresiones regulares.
- Separar la lógica de validaciones.
- Estado del formulario.
- Mensajes de error personalizados.

Más adelante tendremos una sección de directivas, la cual es un excelente complemento para el manejo de errores de formularios reactivos, pero luego se llegará a ella.

Recuerden que todo lo que se haga en formularios Reactivos se puede hacer con los formularios por template, pero prefiero enfocar tiempo y esfuerzo en este tipo de formularios reactivos por la facilidad y control.

## Continuación del proyecto

Vamos a seguir con el proyecto de la sección pasada. Para instalar los node_modules usamos el comando `npm install` o `npm i`. Para levantar el servidor usamos el comando `ng serve -o`. También vamos a crear un nuevo módulo con rutas hijas con el comando `ng g m auth --routing`. Dentro de este nuevo módulo creamos 2 componentes: `ng g c auth/pages/register --skip-tests -is` y `ng g c auth/pages/login --skip-tests -is`. También vamos a crear un servicio para el módulo con el comando `ng g s auth/services/auth --skip-tests`.

Vamos a configurar las rutas hijas de la siguiente manera:

```ts
const routes: Routes = [
    {
        path: '', children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: '**', redirectTo: 'login' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
```

Seguimos practicando el LazyLoad y por lo tanto vamos a llamar la ruta del módulo auth dentro de `AppRoutingModule` de la siguiente forma:

```ts
const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
    ...
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
```

Dentro de `SidemenuComponent` configuramos los enlaces del menú lateral que luego se interpolan en el template:

```ts
export class SidemenuComponent {
    ...
    public authMenu: MenuItem[] = [
        { text: 'Login', path: './auth/login' },
        { text: 'Register', path: './auth/register' }
    ]
}
```

## Diseño de la página de registro

Dentro del template `register.component.html` creamos un formulario que contenga varios inputs para el nombre, email, username, password y confirm password. Por el momento el único que tiene alerta de error es el input del nombre.

## Validar contra una expresión regular

Como vamos a usar formularios reactivos, vamos a importar el módulo `ReactiveFormsModule` dentro de `AuthModule`:

```ts
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    ...,
    imports: [
        ...,
        ReactiveFormsModule
    ]
})
export class AuthModule { }
```

Dentro de `AuthComponent` creamos la definición del formulario luego de hacer la inyección de dependencias de `FormBuilder`:

```ts
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

...
export class RegisterComponent implements OnInit {

    public form: FormGroup = this._fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required]],
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]],
    })

    constructor(private _fb: FormBuilder) { }

    ngOnInit(): void { }
}
```

Dentro del template asociamos el formulario y los campos:

```html
<form [formGroup]="form">
    ...
    <input ... formControlName="name">
    ...
</form>
```

Por el momento vamos a trabajar las validaciones del nombre, por lo que necesitamos ignorar o comentar los demás controles. La idea es que comparemos el valor que se ingresa por el input contra una expresión regular (no es complicada, solo es educativa). Para ello creamos un string que contenga el patrón y dentro de las validaciones síncronas del control incluimos un nuevo validador:

```ts
export class RegisterComponent implements OnInit {
    private _patternNameSurname: string = '([a-zA-Z]+) ([a-zA-Z]+)'

    public form: FormGroup = this._fb.group({
        name: ['', [Validators.required, Validators.pattern(this._patternNameSurname)]],
        ...
    })
    ...
}
```

También vamos a crear una función para mostrar de manera condicional el mensaje de error, junto a una función para enviar el formulario:

```ts
export class RegisterComponent implements OnInit {
    ...
    isInvalidField = (field: string) => {
        return this.form.controls[field].errors && this.form.controls[field].touched && this.form.get(field)?.invalid
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

Dentro del template asociamos ambos métodos de la siguiente manera:

```html
<form ... (ngSubmit)="save()">
    ...
    <span ... *ngIf="isInvalidField('name')">Debe ser en formato de nombre y apellido</span>
    ...
    <button ... type="submit">Crear</button>
    ...
</form>
```

## Evaluar un email

Vamos a hacer la validación de la entrada del input del email. Para ello creamos un string con el patrón necesario y también agregamos los validadores síncronos necesarios dentro del control:

```ts
export class RegisterComponent implements OnInit {
    ...
    private _patternEmail: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'

    public form: FormGroup = this._fb.group({
        ...,
        email: ['', [Validators.required, Validators.pattern(this._patternEmail)]],
        ...
    })
    ...
}
```

## Validaciones personalizadas

Vamos a hacer una validación personalizada para el username. Creamos una función que reciba el control y compare su valor con algún nombre de usuario, por el momento se hace la comparación con un string quemado, pero la idea es lograr hacer la comparación con alguna base de datos. En caso de que el username ya se esté usando por otro usuario, entonces se retorna un objeto con el error. En caso contrario se retorna un null para los errores.

```ts
export class RegisterComponent implements OnInit {
    ...
    canNotBe = (control: FormControl) => {
        const value = control.value?.trim().toLowerCase()
        if (value === 'ferrer') return { itsUsed: true }
        return null
    }
    ...
}
```

Esta validación personalizada la vamos a usar de la siguiente manera:

```ts
export class RegisterComponent implements OnInit {
    ...
    public form: FormGroup = this._fb.group({
        ...,
        username: ['', [Validators.required, this.canNotBe]]
    })
    ...
}
```

Con esto logramos que si en nuestro input ingresamos la palabra `ferrer`, se muestre el error y no se pueda continuar el método de `save()`.

## Separar la lógica de validaciones del componente

Vamos a manejar nuestras validaciones desde un servicio que ubicaremos en el módulo de Shared. Dicho servicio lo creamos con el comando `ng g s shared/services/validators --skip-tests`. En dicho archivo moveremos la información y quedaremos con la siguiente estructura:

```ts
import { Injectable } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';


@Injectable({
    providedIn: 'root'
})
export class ValidatorsService {

    public patternNameSurname: string = '([a-zA-Z]+) ([a-zA-Z]+)'
    public patternEmail: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'

    constructor() { }

    canNotBe = (control: FormControl): ValidationErrors | null => {
        const value = control.value?.trim().toLowerCase()
        if (value === 'ferrer') return { itsUsed: true }
        return null
    }
}
```

Luego, dentro del componente `RegisterComponent` hacemos la inyección del anterior servicio para poder usar los elementos que acabamos de mover:

```ts
export class RegisterComponent implements OnInit {

    public form: FormGroup = this._fb.group({
        name: ['', [Validators.required, Validators.pattern(this._vs.patternNameSurname)]],
        email: ['', [Validators.required, Validators.pattern(this._vs.patternEmail)]],
        username: ['', [Validators.required, this._vs.canNotBe]],
        ...
    })

    constructor(private _fb: FormBuilder, private _vs: ValidatorsService) { }
    ...
}
```

## Validar contraseñas iguales

Para validar que las contraseñas hagan match creamos una función dentro de nuestro servicio que reciba 2 campos y luego los compare. Dicha función retorna un mensaje de error en caso de las contraseñas no coincidan, o un null cuando no hay problema.

```ts
export class ValidatorsService {
    ...
    equalsFields = (field1: string, field2: string) => {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const p1 = formGroup.get(field1)?.value
            const p2 = formGroup.get(field2)?.value

            if (p1 !== p2) {
                return { equals: false }
            }
            return null
        }
    }
}
```

La validación que acabamos de crear no la podemos usar en los controles del formulario ya que los 2 campos están en constante cambio y solo se emite un parámetro para la evaluación. Lo mejor es hacer la comparación dentro de los validadores globales del formulario:

```ts
export class RegisterComponent implements OnInit {
    public form: FormGroup = this._fb.group({
        ...,
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirm_password: ['', [Validators.required]]
    }, {
        validators: [this._vs.equalsFields('password', 'confirm_password')]
    })
    ...
}
```

Dentro de nuestro template mostramos el span con la alerta del error. Pero en este caso, como las validaciones son globales, entonces los errores del control de confirmar contraseña no se mostraran. Para añadir un error individual al control usamos el método `setErrors` cuando creamos la función de validación:

```ts
export class ValidatorsService {
    ...
    equalsFields = (field1: string, field2: string) => {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const p1 = formGroup.get(field1)?.value
            const p2 = formGroup.get(field2)?.value

            if (p1 !== p2) {
                formGroup.get(field2)?.setErrors({ equals: false })
                return { equals: false }
            }
            formGroup.get(field2)?.setErrors(null)
            return null
        }
    }
}
```

Es importante aclarar que al declarar como null el valor dentro de `setErrors`, nos exponemos a eliminar los otros errores que pueden estar presentes dentro del control.

## Preparaciones para Validaciones Asíncronas

Vamos a crear un nuevo directorio al mismo nivel de la carpeta contenedora del proyecto para simular nuestro backend. En dicho directorio creamos un archivo llamado `db.json` en el que creamos un arreglo de usuarios que se componen de un id, email y un username. Mediante el paquete Json Server, del cual se hablo en la [Sección 13](https://github.com/carlos-paezf/Curso_Angular/tree/main/13_HeroesApp_Angular-Material_Angular-FlexLayout#h%C3%A9roes-backend---json-server), levantamos nuestro server con el comando `json-server --watch db.json` en una consola dentro del directorio del backend. Vamos a tener un endpoint para el manejo de los usuarios con el que vamos a hacer peticiones HTTP y hacer las validaciones asíncronas.

## Validaciones Asíncronas

La validación asíncrona que vamos a realizar es mediante una petición HTTP. Debemos tener cuidado en lo siguiente: Cuando definimos un control, el primer argumento es el valor por defecto, el segundo son las peticiones síncronas y el último son las peticiones asíncronas, en donde si realizamos validaciones que no dependen de peticiones http podemos ubicarlas allí, siempre y cuando regresen una promesa o un observable, pero cuando depende de una petición HTTP debemos seguir lo siguientes pasos:

Dentro de `AppModule` hacemos la importación de `HttpClientModule`:

```ts
import { HttpClientModule } from '@angular/common/http'

@NgModule({
    ...,
    imports: [
        ...
        HttpClientModule
    ],
    ...
})
export class AppModule { }
```

Vamos a crear un nuevo servicio con el comando `ng g s shared/services/email-validator --skip-tests`, en el que haremos la inyección de dependencias de `HttpClient`, y además necesitamos hacer la implementación de la interfaz `AsyncValidator` en cuyo método hacemos la petición:

```ts
@Injectable({
    providedIn: 'root'
})
export class EmailValidatorService implements AsyncValidator {

    private _endpointUsers = `${environment.baseUrl}/users`

    constructor(private _http: HttpClient) { }

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        const email = control.value
        return this._http.get<any[]>(`${this._endpointUsers}?q=${email}`)
    }
}
```

Ahora dentro de nuestro `RegisterComponent` necesitamos hacer una inyección del último servicio para poder usar la validación asíncrona en el control del email.

```ts
export class RegisterComponent implements OnInit {
    public form: FormGroup = this._fb.group({
        ...,
        email: ['', [...], [this._evs]],
        ...
    }, {
        validators: [...]
    })

    constructor(..., private _evs: EmailValidatorService) { }
}
```

Cuando usamos un correo que está siendo usado dentro del formulario, obtenemos un error cuyo cuerpo es un objeto que coincide con el email. Para retornar un error más personalizado usamos el operador `map` de RxJs, dentro del cual hacemos la comparación con un operador ternario para retornar un error más personal:

```ts
export class EmailValidatorService implements AsyncValidator {
    ...
    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        const email = control.value
        return this._http.get<any[]>(`${this._endpointUsers}?q=${email}`)
            .pipe(map(res => {
                return (res.length === 0) ? null : { emailIsUsed: true }
            }))
    }
}
```

Es importante aclarar que estamos usando un endpoint que haces búsquedas muy generales sin filtro, por lo que puede hacer match con correos que tienen similitudes parciales y totales.

## Estado del formulario

Hay 3 estados en los formularios: Valido, Invalido y en espera de Validación. Nosotros podemos observar dicho estado del formulario de la siguiente manera:

```html
<pre>{{ form.status | json }}</pre>
```

Si queremos simular la espera de la respuesta de nuestro formulario, usamos el operador `delay` de RxJs dentro de nuestro servicio:

```ts
export class EmailValidatorService implements AsyncValidator {
    ...
    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        ...
        return this._http.get<any[]>(`${this._endpointUsers}?q=${email}`)
            .pipe(
                ...,
                delay(3000)
            )
    }
}
```

Podemos usar una propiedad del formulario llamada `pending` para deshabilitar el botón de envío mientras se resuelve el estado del formulario:

```html
<button ... [disabled]="form.pending">Crear Usuario</button>
```

## Errores Personalizados

En el control del correo tenemos 3 posibles errores, que sea requerido, que no cumpla con el formato o que el correo ya esta en uso. Debemos ser capaces de mostrar cual es el error que está ocurriendo en el momento. Una manera menos practica es mediante funciones y el uso de `*ngIf`:

```ts
export class RegisterComponent implements OnInit {
    ...
    emailIsRequired = () => {
        return this.form.get('email')?.getError('required') && this.form.controls['email'].touched
    }

    emailPattern = () => {
        return this.form.get('email')?.getError('pattern') && this.form.controls['email'].touched
    }

    emailIsUsed = () => {
        return this.form.get('email')?.getError('emailIsUsed') && this.form.controls['email'].touched
    }
    ...
}
```

```html
<div class="col-sm-9">
    <input type="email" class="form-control" placeholder="Email del Usuario" formControlName="email">
    <span class="form-text text-danger" *ngIf="emailIsRequired()">El correo es obligatorio</span>
    <span class="form-text text-danger" *ngIf="emailPattern()">El correo debe tener un formato de email
        valido</span>
    <span class="form-text text-danger" *ngIf="emailIsUsed()">El correo ya está en uso</span>
</div>
```

El problema es que la idea de los formularios reactivos es manejar la mayoría de la lógica desde el componente.

## Mensaje de error personalizado

Dentro de la clase del componente podemos crear un método getter para poder establecer el mensaje del error dependiendo el código del mismo:

```ts
export class RegisterComponent implements OnInit {
    ...
    get emailError(): string {
        const email = this.form.get('email')
        if ( email!.getError('required') ) return 'El email es obligatorio'
        else if ( email!.getError('pattern') ) return 'El email debe tener un formato de correo'
        else if ( email!.getError('emailIsUsed') ) return 'El email ya está siendo usado por otro usuario'
        return ''
    }
    ...
}
```

Dentro del template solo usaríamos el método genérico de validar los errores e interpolamos la respuesta del getter:

```html
<span class="form-text text-danger" *ngIf="isInvalidField('email')">{{ emailError }}</span>
```
