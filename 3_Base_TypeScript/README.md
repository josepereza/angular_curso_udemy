# Sección 3: Base de TypeScript - Sección recomendada

Este es un breve listado de los temas fundamentales:

- Introducción a TypeScript
- Tipos básicos
- Objetos, arreglos e interfaces
- Funciones y sus argumentos
- Desestructuración de arreglos y objetos
- Importaciones y exportaciones
- Clases, constructores
- Tipos genéricos
- Decoradores
- Encadenamiento opcional

La idea de esta sección no es hacerlos expertos en TypeScript, pero sí irnos acostumbrando a la sintaxis y el tipado estricto de datos.

Después de la sección, podrán ver con otros ojos TypeScript y enfocarnos en todo lo que nos puede brindar, en lugar de las barreras que nos puede poner.

## Inicio del proyecto - Introducción a TypeScript

Dentro del curso se compartió un pequeño esqueleto de un proyecto con TypeScript. Simplemente se instalaron los modulos a usar con el comando `npm install` y para levantar el proyecto se uso el comando `npm start`.

## Tipos básicos y conceptos generales

La [Documentación oficial de TypeScript](https://www.typescriptlang.org/docs/) nos muestra los conceptos que usa dicho lenguaje. Si nos dirigimos a la sección de Everyday Types, podemos encontrar los tipos básicos que se manejan dentro de TypeScript.

Podemos declarar el tipo de una variable y que no solo lo infiera, además que si luego le asignamos un valor diferente al tipo que solicita, nos mostrara un error sobre el tipo:

```ts
let x: string = 'Carlos'

x = 10      // El tipo 'number' no se puede asignar al tipo 'string'.
```

En caso de que necesitemos que una variable tenga la posibilidad de ser varios tipos, usamos el operador OR = `|`:

```ts
let hp: number | string = 95

hp = 'FULL'
```

## Objetos, arreglos e interfaces

Cuando tenemos un arreglo declaramos el tipo de datos permitidos dentro del mismo. Comunmente son de un solo tipo, pero pude haber algún caso en el que necesitemos más de un tipo. En ese caso podemos hacer lo siguiente:

```ts
let abilities: (string | boolean | number)[] = ['Bash', 'Counter', 'Healing', true, 1234]
```

Para crear un objeto tenemos 2 posibilidades para el tipado de las propiedades. La primera es añadir un tipo `any`, con la cual podemos hacer que nuestro objeto puedo incluso tener nuevas propiedades diferentes a las que se le definen inicialmente:

```ts
const character: any = {
    name: 'Ferrer',
    hp: 100,
    abilities: ['Healing']
}

characters.isAlive = true
```

Lo anterior no es muy recomendado. Lo mejor es la segunda opción, crear una interfaz en la que definimos el tipo de los datos que necesitamos, e incluso podemos tener datos opcionales al usar `?` al final del nombre de la variable:

```ts
interface Character {
    name: string
    hp: number
    abilities: string[]
    isAlive?: boolean
}

const character: Character = {
    name: 'Ferrer',
    hp: 100,
    abilities: ['Healing']
}

character.isAlive = true
```

Es importante aclarar que todo lo que nosotros ponemos de tipado e interfaces, solo es útil en desarrollo. Cuando llega nuestro código a producción, al transpilarlo a JS, el tipado e interfaces desaparecen.

## Funciones básicas

Cuando tenemos funciones es importante declara el tipo de sus argumentos y el tipo de la función. Por ejemplo podemos hacer esto:

```ts
const add = (a, b) => {
    return a + b
}

const result = add("Hola mundo", 5)
```

Si nosotros imprimimos el resultado tendremos una concatenación, pero no era lo que queriamos, nosotros queriamos sumar. La solución es dar tipado, tanto a los parámetros como a la función:

```ts
const add = (a: number, b: number) : number => {
    return a + b
}

const result: number = add(2, 5)
```

Cuando obligamos el tipo de retorno en la función, podemos llegar a evitar errores como este:

```ts
const add = (a: number, b: number) : number => {
    return (a + b).toString()                       // El tipo 'string' no se puede asignar al tipo 'number'.
}
```

Es muy probable que encontremos las funciones en estilo tradicional, lo que se vería de la siguiente manera la función anterior:

```ts
function add(a: number, b: number) : number {
    return a + b
}
```

En algunas ocasiones podemos llegar a tener errores como este:

```ts
const multiply = (x: number, y: number, base: number): number => {
    return x * base * y
}

const result: number = multiply(2, 5)  // Se esperaban 3 argumentos, pero se obtuvieron 2. No se proporcionó ningún argumento para "base"
```

Podemos dejar argumentos opcionales o también con valores por defecto. Es muy importante el orden de como ingresamos los argumentos, y es preferible dejar primero los obligatorios, luego los de valores por defecto y por último los opcionales:

```ts
const multiply = (x: number, base: number = 2, y?: number): number => {
    return x * base * y
}

const result1: number = multiply(2)        // 4 : x * 2
const result2: number = multiply(2, 3)     // 6 : x * base
const result1: number = multiply(2, 3, 4)  // 24: x * base * y
```

## Funciones con objetos por argumentos

Creamos una función que recibe un personaje y la cantidad de puntos de vida a curar. Necesitamos que el objeto personaje siga una estructura especifica, por lo que establecemos una interfaz.

```ts
const healCharacter = (character: Character, pointsHeal: number) : void => {
    character.hp += pointsHeal
}
```

En esta interfaz, podemos añadir propiedades como cadenas de textos, boleanos, numeros, etc... Pero también podemos definir propiedades como funciones que sean de X tipo. Dichas funciones se les puede dar cuerpo dentro de la construcción del objeto.

```ts
interface Character {
    name: string
    hp: number
    showHp: () => void
}

const character: Character = {
    name: 'Ferrer',
    hp: 100,
    showHp() {
        console.log(this.hp)
    }
}

healCharacter(character, 20)
character.showHp()
```

## Objetos anidados

Por ejemplo tenemos un objeto que posee un objeto anidado y queremos darle tipado al objeto padre:

```ts
const superHero = {
    name: 'Spiderman',
    age: 30,
    address: {
        street: 'Main St',
        country: 'USA',
        city: 'NY'
    },
    showAddress() {
        return `${this.name}, ${this.address.city}, ${this.address.country}`
    }
}
```

Una manera sería dentro de la interfaz para tipar el objeto padre definir de una vez las propiedades del objeto hijo, pero esto en alguno se podra convertir en un infierno de objetos.

```ts
interface SuperHero {
    name: string
    age: number
    address: {
        street: string
        country: string
        city: string
    }
    showAddress: () => string 
}


const superHero: SuperHero = {...}
```

La manera más organizada es crear interfaces por Objeto, puede incurrir en un poco más de código, pero esto hara una lógica más limpia, además de que no afectara los archivo que se suban al bundle de producción.

```ts
interface SuperHero {
    name: string
    age: number
    address: Address
    showAddress: () => string 
}

interface Address {
    street: string
    country: string
    city: string
}

const superHero: SuperHero = {...}
```

## Desestructuración de Objetos

Tenemos un objeto con sus interfaces para tiparlo, además de que tenemos un objeto anidado:

```ts
interface MusicPlayer {
    volume: number
    second: number
    song: string
    details: Details
}

interface Details {
    author: string
    year: number
}

const musicPlayer: MusicPlayer = {
    volume: 90,
    second: 32,
    song: 'Canción',
    details: {
        author: 'Ni idea',
        year: 2022
    }
}
```

Podemos traer más rápido las propiedades del objeto cuando aplicamos desestructuración, y tenemos 2 maneras de hacerlo. La primera es la que brinda un código más limpio:

```ts
const { volume, second, song, details } = musicPlayer
const { author, year } = details

console.log(`Volumen: ${volume}, Segundo: ${second}, Canción: ${song}, Autor: ${author}, Año: ${year}`)
```

La segunda opción también es valida, pero puede llegar a confundir con la manera en que hacemos tipado de una propiedad:

```ts
const { volume, second, song, details: { author, year } } = musicPlayer

console.log(`Volumen: ${volume}, Segundo: ${second}, Canción: ${song}, Autor: ${author}, Año: ${year}`)
```

Ahora bien, en el caso de haya otra variable dentro del contexto que se desestructura con el nombre de una de nuestras propiedades, podemos hacer un renombre a dicha propiedad. Por ejemplo:

```ts
const author: string = 'Fulano'

const { details: { author: authorDetail, year } } = musicPlayerW

console.log(`Autor: ${authorDetail}, Año: ${year}`)
```
