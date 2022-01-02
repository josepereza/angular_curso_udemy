# Sección 14: HéroesApp - CRUD (Continuación con Angular Material)

Este es un breve listado de los temas fundamentales:

1. CRUD
   - Create
   - Read
   - Update
   - Delete
2. Pipes puros e impuros
3. Snacks
4. Dialogs
5. Inyección de servicios manualmente

Esta sección les dará las bases para poder realizar CRUD completos hacia cualquier backend basado en servicios web, mediante comunicación JSON

## Continuación del proyecto - HéroesApp

Para instalar los node_modules usamos el comando `npm install`, y para levantar el server usamos `ng serve -o` el cual nos abre una pestaña nueva con la aplicación. Para levantar el backend usamos dentro del directorio del mismo, el comando `json-server --watch db.json`

## Diseño de la pantalla para agregar héroes

Empezamos con el diseño de la pantalla para crear un héroe. Recordar que el componente `AddComponent` también se emplea para editar la información de los héroes. En uno de los campos del formulario vamos a usar un select, por lo que necesitamos exportarlo desde `MaterialDesignModule`:

```ts
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    exports: [
        ...,
        MatSelectModule
    ]
})
export class MaterialDesignModule { }
```

Para las opciones del select creamos un arreglo de objetos:

```ts
export class AddComponent {
    public publisher = [
        {
            id: 'DC Comics',
            desc: 'DC - Comics'
        },
        {
            id: 'Marvel Comics',
            desc: 'Marvel - Comics'
        }
    ]
    ...
}
```

La opción del select quedaría de la siguiente manera:

```html
<mat-form-field fxFlex="100">
    <mat-label>Casa creadora</mat-label>
    <mat-select>
        <mat-option *ngFor="let p of publisher" [value]="p.id">{{ p.desc }}</mat-option>
    </mat-select>
</mat-form-field>
```

También necesitamos crear un objeto con información vacía para el nuevo héroe:

```ts
export class AddComponent {
    ...
    public hero: Hero = {
        superhero: '',
        alter_ego: '',
        characters: '',
        first_appearance: '',
        publisher: Publisher.MarvelComics,
        alt_img: ''
    }
    ...
}
```

## Insertar en la base de datos

Mediante `[(ngModel)]` de cada input y del select, asociamos los campos con las propiedades del nuevo héroe. Por ejemplo para el select:

```html
<mat-select required [(ngModel)]="hero.publisher">...</mat-select>
```

Necesitamos hacer el envió de la data a nuestra DB, por lo que usamos el método POST. Dentro de nuestro servicio vamos a crear un método para poder hacer dicha petición:

```ts
export class HeroesService {
    ...
    addHero = (hero: Hero): Observable<Hero> => {
        return this.http.post<Hero>(this.baseEndpoint, hero)
    }
}
```

Luego en `AddComponent` necesitamos hacer la inyección de dependencias de nuestro servicio para poder usar el método de guardar, al cual nos suscribimos y obtenemos lo que hemos guardado..

```ts
export class AddComponent {
    ...
    constructor(private heroesService: HeroesService) { }
    ...
    save = () => {
        if (this.hero.superhero.trim().length === 0) return
        this.heroesService.addHero(this.hero)
            .subscribe(res => console.log('Respuest', res))
    }
}
```

## Editar Héroes

Dentro de nuestro servicio creamos un método para actualizar un héroe a partir de su id:

```ts
export class HeroesService {
    ...
    updateHero = (hero: Hero): Observable<Hero> => {
        return this.http.put<Hero>(`${this.baseEndpoint}/${hero.id}`, hero)
    }
}
```

Como el componente `AddComponent` se usa para añadir un héroe o modificarlo, debemos reconocer cual es el caso en el que se está empleando. Para ello necesitamos identificar la url que se está activa en la aplicación mediante `ActivatedRouter`.Cuando el componente se inicia, se captura los parámetros de la URL, con los cuales podemos tomar el id del héroe en caso de que se quiera editar, para luego usar nuestro servicio y buscar a un héroe por dicho ID, y la información resultante asignarla al objeto del héroe que tenemos dentro del componente.

Cuando usamos el método de guardar, debemos tener en cuenta si el objeto del héroe cuenta con un id. En caso de que no se encuentre un id entonces significa que estamos creando un nuevo elemento por lo que usamos el método del servicio para crear al héroe, y una vez finalice la creación del personaje redirigimos al usuario a la página de edición. Si se encuentra un id, entonces procedemos a usar el método creado para actualizar el usuario desde nuestro servicio.

```ts
export class AddComponent implements OnInit {
    ...
    constructor(private heroesService: HeroesService, private activatedRoute: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.activatedRoute.params
            .pipe(switchMap(({id}) => this.heroesService.getHeroeById(id)), tap(console.log))
            .subscribe( hero => this.hero = hero)
    }

    save = () => {
        const { id, superhero, alter_ego, characters, first_appearance, alt_img } = this.hero
        if (superhero.trim().length === 0) return

        if (!id) {
            this.heroesService.addHero(this.hero)
                .subscribe(hero => {
                    this.router.navigate(['/heroes/edit', hero.id])
                })
        } else {
            this.heroesService.updateHero(this.hero)
                .subscribe(res => console.log('Actualizando', res))
        }
    }
}
```

## Excepciones en nuestro ImagenPipe

Dentro de nuestro pipe, vamos a determinar los casos en que se deben mostrar backgrounds en caso de no tener imagen, o el lugar a donde debería apuntar el path de las imágenes:

```ts
export class ImageHeroPipe implements PipeTransform {

    transform(hero: Hero,): string {
        if (!hero.id && !hero.alt_img) return `assets/no-image.png`
        else if (hero.alt_img) return hero.alt_img
        return `assets/heroes/${hero.id}.jpg`;
    }

}
```

Cuando usamos el método `ngOnInit()` dentro del componente `AddComponent`, siempre se va a ejecutar lo que este dentro del mismo cada que se inicie el componente. Nosotros queremos que traiga la data de héroe solo si se está editando, por lo tanto limitamos la función de la siguiente manera:

```ts
export class AddComponent implements OnInit {
    ...
    ngOnInit(): void {
        if (!this.router.url.includes('edit')) return
        this.activatedRoute.params
            .pipe(switchMap(({id}) => this.heroesService.getHeroeById(id)), tap(console.log))
            .subscribe( hero => this.hero = hero)
    }
    ...
}
```

## Eliminar Registros

Vamos a crear un método dentro de nuestro servicio para usar un endpoint con el método DELETE para borrar un elemento por su id:

```ts
export class HeroesService {
    ...
    deleteHero = (id: string): Observable<any> => {
        return this.http.delete<any>(`${this.baseEndpoint}/${id}`)
    }
}
```

Dentro de nuestro template `add.componente.html` vamos a ubicar los botones para eliminar y guardar, con sus respectivos métodos:

```html
<div fxLayout="row">
    <button *ngIf="hero.id" mat-stroked-button color="warn" (click)="delete_hero()">Eliminar <mat-icon>delete_outline</mat-icon></button>
    <span class="spacer"></span>
    <button mat-raised-button color="primary" (click)="save()">Guardar <mat-icon>save</mat-icon></button>
</div>
```

En la clase `AddComponent` creamos el método para la eliminación:

```ts
export class AddComponent implements OnInit {
    ...
    delete_hero = () => {
        this.heroesService.deleteHero(this.hero.id!)
            .subscribe(res => this.router.navigate(['/heroes']))
    }
}
```

## Pipes Puros y impuros

Cuando actualizamos el url de la imagen de un personaje, no se actualiza en tiempo real, solo después de que se recarga la aplicación o se cambia ruta. Esto se debe a que los pipes puros no disparan la función `transform` cada que el argumento cambia. Si nosotros declaramos el atributo `pure` dentro del decorador `@Pipe()` con su valor en false, podremos actualizar la respuesta cada que se detecta un cambio en el argumento que se recibe, en este caso el argumento que se recibe es el objeto Héroe. Se puede decir que necesitamos que nuestro pipe sea impuro. Los pipes por defecto son pipes puros.

```ts
@Pipe({
    name: 'imageHero',
    pure: false
})
export class ImageHeroPipe implements PipeTransform {
    ...
}
```

Es importante aclarar que los pipes impuros consumen más recursos por su actualización en tiempo real.

## Material Snackbar

Vamos a usar un elemento para hacerle una retroalimentación a usuario cada que crea o elimina información. Exportamos el módulo Snackbar de material, dentro de `MaterialDesignModule`:

```ts
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
    exports: [
        ...,
        MatSnackBarModule
    ]
})
export class MaterialDesignModule { }
```

Para usar el snackbar debemos hacer una inyección de dependencias del mismo, dentro del componente a emplear:

```ts
export class AddComponent implements OnInit {
    ...
    constructor(..., private snackbar: MatSnackBar) { }
    ...
}
```

Podemos crear una función para abrir el snackbar dependiendo la acción, por ejemplo al eliminar:

```ts
export class AddComponent implements OnInit {
    ...
    delete_hero = () => {
        this.heroesService.deleteHero(this.hero.id!)
            .subscribe(_ =>{ 
                this.router.navigate(['/heroes'])
                this.showSnackbar('Registro eliminado')
        })
    }

    showSnackbar = (msg: string) => {
        this.snackbar.open(msg, 'Ok!', {
            
            duration: 2500
        })
    }
}
```

## Material Dialog

Necesitamos exportar Dialog dentro de `MaterialDesignModule`:

```ts
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
    exports: [
        ...,
        MatDialogModule
    ]
})
export class MaterialDesignModule { }
```

Dentro de nuestro componente `AddComponente` debemos hacer la inyección de dependencias de `MatDialog` para poder usar el Dialog de confirmación:

```ts
export class AddComponent implements OnInit {
    ...
    constructor(
        ...
        private _dialog: MatDialog
    ) { }
    ...
}
```

Para abrir el dialog necesitamos de un componente que muestre el contenido, por tal razón usamos el comando `ng g c heroes/components/confirm --skip-tests -is`. Dentro de dicho componente debemos hacer la inyección de dependencias de `MatDialogRef`, dandole como tipado el propio componente:

```ts
export class ConfirmComponent {
    constructor(private _dialogRef: MatDialogRef<ConfirmComponent>) { }
    ...
}
```

En el template del componente tenemos una estructura simple, con 2 botones que tienen funcionalidades en el evento click:

```html
<h1>¿Estás seguro de proseguir?</h1>
<hr>

<p>
    Está a punto de eliminar a ASasAS
    <br>
    ¿Desea continuar?
</p>

<div>
    <button mat-stroked-button color="warn" (click)="cancel()">Cancelar</button>
    <button mat-button color="warn" (click)="delete()">Si, borrar</button>
</div>
```

Los métodos de cancelar y borrar son muy parecidos, los único diferente, es que al aceptar la eliminación enviamos un argumento en true:

```ts
export class ConfirmComponent {

    constructor(private _dialogRef: MatDialogRef<ConfirmComponent>) { }

    cancel = () => {
        this._dialogRef.close()
    }

    delete = () => {
        this._dialogRef.close(true)
    }
}
```

## Informar desde y hacia el dialogo

Para poder recibir información desde el lado de la confirmación, necesitamos hacer la inyección de un servicio de manera manual, con el cual podemos recibir la data que le vamos a enviar desde el componente padre:

```ts
export class ConfirmComponent {
    constructor(
        private _dialogRef: MatDialogRef<ConfirmComponent>,
        @Inject(MAT_DIALOG_DATA) public hero: Hero
    ) { }
    ...
}
```

Desde el componente padre le enviamos la información de la siguiente manera:

```ts
export class AddComponent implements OnInit {
    ...
    delete_hero = () => {
        this._dialog.open(ConfirmComponent, {
            ...,
            data: {...this.hero}
        })
        ...
    }
    ...
}
```

Desde el mismo componente padre recibimos la respuesta al cerrar el dialogo a manera de un Observable, por lo que nos suscribimos al mismo, y actuamos conforme a la respuesta.

```ts
export class AddComponent implements OnInit {
    ...
    delete_hero = () => {
        const dialog = this._dialog.open(ConfirmComponent, {
            width: '300px',
            data: { ...this.hero }
        })

        dialog.afterClosed()
            .subscribe(result => {
                if (result) {
                    this._heroesService.deleteHero(this.hero.id!)
                        .subscribe(_ => {
                            this._router.navigate(['/heroes'])
                            this.showSnackbar('Registro eliminado')
                        })
                }
            })
    }
    ...
}
```

## Adecuar los textos de la pantalla de agregar

Vamos a usar operadores ternarios dentro de la interpolación para poder mostrar textos o iconos de acuerdo a la acción que se esta llevando a cabo.

```html
<h1>
    {{ (hero.id) ? 'Editar' : 'Nuevo'}}
    Héroe:
    <small>{{ hero.superhero }}</small>
</h1>

...

<button mat-raised-button color="primary" (click)="save()">
    {{ (hero.id) ? 'Actualizar' : 'Crear'}}
    <mat-icon>{{ (hero.id) ? 'edit' : 'save'}}</mat-icon>
</button>
```
