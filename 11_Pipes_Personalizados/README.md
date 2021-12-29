# Sección 11: Pipes Personalizados

Este es un breve listado de los temas fundamentales:

- Pipes personalizados
- Argumentos hacia los Pipes
- SortableTable manual y usando PrimeNg

Es una sección pequeña, pero sumamente ilustrativa y necesaria para poder expandir todos los pipes que no existen

## Continuación del proyecto PipeApp

Seguimos con el proyecto de la sección anterior, instalamos node_modules con `npm install`. Levantamos el servidor con `ng serve -o`

## Pipe personalizado - mayúsculasPipe (`capitalLetterPipe`)

Lo primero sea añadir el routerLink dentro del componente del menú:

```ts
export class MenuComponent implements OnInit {
    items: MenuItem[] = [];
    ngOnInit() {
        this.items = [
            ...,
            {
                label: 'Pipes Personalizados',
                icon: 'pi pi-cog',
                routerLink: 'sort'
            }
        ];
    }
}
```

Angular CLI nos proporciona un comando para crear de manera automática el archivo de nuestros pipes, por ejemplo en este caso usamos: `ng g p sales/pipes/capital-letter --skip-tests`. Vamos a explicar cuales fueron los cambios que se aplicaron:

Primero se creo una carpeta llamada `pipes`, dentro de la cual se añadió el archivo `capital-letter.pipe.ts`. Dentro de se este archivo usa un decorador llamado `@Pipe` dentro del que se configura el nombre del pipe. Como en todas nuestro proyecto, es una clase de TypeScript. Todos los pipes necesitan implementar la interfaz `PipeTransform` que trae la función `transform`.

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'capitalLetter'
})
export class CapitalLetterPipe implements PipeTransform {
    transform(value: unknown, ...args: unknown[]): unknown {
        return null;
    }
}
```

Los pipes se proveen dentro del módulo que lo relaciona, en este caso es el módulo `SalesModule`:

```ts
import { CapitalLetterPipe } from './pipes/capital-letter.pipe';

@NgModule({
    declarations: [
        ...,
        CapitalLetterPipe
    ],
    ...
})
export class SalesModule { }
```

Para usar nuestro pipe, lo llamamos como a los demás:

```html
<p>Pipes creados de manera manual por {{ 'nosotros' | capitalLetter }}</p>
```

## Valor y argumentos a los pipes personalizados

Nuestro pipe va a transformar el valor que se le acaba de pasar en mayúsculas, así que hace de la siguiente manera:

```ts
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'capitalLetter'
})
export class CapitalLetterPipe implements PipeTransform {
    transform(value: string): string {
        return value.toUpperCase();
    }
}
```

Dentro de otros pipes observamos que se reciben argumentos como la cantidad de decimales, el idioma, etc., en nuestro pipe también podemos recibir lo mismo:

```ts
export class CapitalLetterPipe implements PipeTransform {
    transform(value: string, inUpperCase: boolean = true): string {
        transform(value: string, inUpperCase: boolean = true): string {
        return (inUpperCase) ? value.toUpperCase() : value.toLowerCase()
    }
    }
}
```

En nuestro template podemos usar el argumento o simplemente no utilizarlo ya que lo dejamos opcional:

```html
{{ 'nosotros' | capitalLetter }}
{{ 'nosotros' | capitalLetter : false }}
```

Podemos hacer que el cambio sea dinámico mediante el cambio de una variable con un botón:

```ts
export class SortComponent {
    public isUpperCase: boolean = false
    
    toggleUpperCase = () => {
        this.isUpperCase = !this.isUpperCase
    }
}
```

```html
<p>Pipes creados de manera manual por {{ 'nosotros' | capitalLetter : isUpperCase }}</p>

<button pButton label="Toogle UpperCase" (click)="toggleUpperCase()" class="p-button-raised p-button-rounded"></button>
```

## PrimeTable y PrimeToolbar

Vamos a usar un componente de PrimeNg llamado Toolbar, por lo que necesitamos exportarlo en el módulo `PrimeNgModule`:

```ts
import { ToolbarModule } from 'primeng/toolbar';

@NgModule({
    exports: [
        ...,
        ToolbarModule
    ]
})
export class PrimeNgModule { }
```

También necesitamos otro módulo llamado Table y en este necesitamos 2 pasos, primero exportar el módulo:

```ts
import { TableModule } from 'primeng/table';

@NgModule({
    exports: [
        ...,
        TableModule,
    ]
})
export class PrimeNgModule { }
```

Y segundo, instalar una dependencia necesaria para que funciones el Scrolling: `npm install @angular/cdk --save`.

Dentro de nuestro template copiamos los ejemplos de estructuras que se nos muestra en la documentación de PrimeNg,

## Llenar una PrimeTable con data

Vamos a crear una interfaz para poder tipar un arreglo de objetos que vamos crear para heroes:

```ts
export interface Hero {
    name: string
    fly: boolean;
    color: Color
}

export enum Color {
    red, black, blue, green
}
```

En nuestro `SortComponent` vamos a crear el arreglo:

```ts
import { Hero, Color } from '../../interfaces/sales.interface';

export class SortComponent {
    public isUpperCase: boolean = false

    public heroes: Hero[] = [
        {
            name: 'Flash',
            fly: false,
            color: Color.red
        },
        {
            name: 'Superman',
            fly: true,
            color: Color.blue
        },
        {
            name: 'Green Lantern',
            fly: true,
            color: Color.green
        },
        {
            name: 'Batman',
            fly: false,
            color: Color.black
        },
    ]
    ...
}
```

Vamos a llenar la tabla dentro del template:

```html
<div class="grid mt-2">
    <div class="col-12">
        <p-table [value]="heroes" responsiveLayout="scroll">
            <ng-template pTemplate="header">
                <tr>
                    <th>Nombre</th>
                    <th>Vuela</th>
                    <th>Color</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-hero>
                <tr>
                    <td>{{ hero.name }}</td>
                    <td>{{ hero.fly }}</td>
                    <td>{{ hero.color }}</td>
                </tr>
            </ng-template>
        </p-table>
    </div>
</div>
```

## Tarea pipe personalizado FlyPipe

Vamos a crear un nuevo pipe con el comando `ng g p sales/pipes/fly --skip-tests`. Este pipe nos ayudara a transformar de manera visual la información a partir del boleano de la propiedad de puede o no volar:

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fly'
})
export class FlyPipe implements PipeTransform {
    transform(value: boolean): string {
        return value ? 'Puede volar' : 'No vuela'
    }
}
```

Dentro de nuestro template ya podemos usar nuestro pipe e incluso concatenar otro pipe:

```html
<td>{{ hero.fly | fly | titlecase }}</td>
```

## Ordenar héroes por nombre - SortPipe

Vamos a usar el comando `ng g p sales/pipe/sort --skip-test`. Este pipe por el momento tendrá como objetivo ordenar los nombres de los objetos dentro del arreglo:

```ts
@Pipe({
    name: 'sort'
})
export class SortPipe implements PipeTransform {

    transform(value: Hero[]): Hero[] {
        value = value.sort((a, b) => (a.name > b.name) ? 1 : -1)
        return value;
    }
}
```

Este pipe lo vamos a llamar dentro del template de la siguiente manera:

```html
<p-table [value]="heroes | sort" responsiveLayout="scroll">
</p-table>
```

## Parametrizar nuestro pipe personalizado

Lo primero será definir el parámetro y función en nuestro pipe:

```ts
export class SortPipe implements PipeTransform {

    transform(heroes: Hero[], orderBy: string = ''): Hero[] {
        if (orderBy === '') return heroes

        switch (orderBy.toLowerCase()) {
            case 'name': return heroes.sort((a, b) => (a.name > b.name) ? 1 : -1)
            case 'fly': return heroes.sort((a, b) => (a.fly > b.fly) ? -1 : 1)
            case 'color': return heroes.sort((a, b) => (a.color > b.color) ? 1 : -1)
            default: return heroes
        }
        return heroes;
    }
}
```

Dentro de nuestro component `SortComponent` vamos a crear una propiedad que nos guarde el valor a ordenar, y una función que se va a aplicar a los botones para que muten el valor de la variable anterior:

```ts
export class SortComponent {
    ...
    public orderBy: string = ''
    ...
    changeOrder = (value: string) => {
        this.orderBy = value
    }
}
```

En nuestro template tenemos la asignación de la función a los botones y también el uso del pipe con el argumento:

```html
<div class="p-toolbar-group-right">
    <button pButton icon="pi pi-sort" label="Por nombre" class="mr-3 p-button-primary" (click)="changeOrder('name')"></button>
    <button pButton icon="pi pi-sort" label="Por volar" class="mr-3 p-button-success" (click)="changeOrder('fly')"></button>
    <button pButton icon="pi pi-sort" label="Por color" class="mr-3 p-button-help" (click)="changeOrder('color')"></button>
</div>
```

```html
<p-table [value]="heroes | sort : orderBy " responsiveLayout="scroll">
</p-table>
```

## PrimeNg - Sortable Table

PrimeNg ya tiene un componente de una tabla con la posibilidad de ordenar sin crear un pipe. Simplemente necesitamos copiar las columnas que tienen la propiedad `pSortableColumn`.

Es importante decir que para mayor seguridad, le pasamos una copia del arreglo mediante el pipe `slice : 0`:

```html
<p-table [value]="heroes | slice : 0" responsiveLayout="scroll">
    <ng-template pTemplate="header">
        <tr>
            <th pSortableColumn="name">Nombre <p-sortIcon field="name"></p-sortIcon></th>
            <th pSortableColumn="fly">Vuela <p-sortIcon field="fly"></p-sortIcon></th>
            <th pSortableColumn="color">Color <p-sortIcon field="color"></p-sortIcon></th>
        </tr>
    </ng-template>
    ...
</p-table>
```
