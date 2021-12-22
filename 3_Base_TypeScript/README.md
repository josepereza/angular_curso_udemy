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

## Desestructuración de Arreglos

En la desestructuración de Objetos, la posición en que se desestructuran los elementos no es importante. En la desestructuración de arreglos si lo es. Cada posición al no tener un nombre que lo identifique, va a tener que ser referenciada claramente en la posición que se desestructure. Por ejemplo tenemos un arreglo y queremos imprimirlo. Podemos hacerlo de esta manera:

```ts
const marvel: string[] = ['Iron Man', 'Spider-Man', 'Galactus']
console.log(`${marvel[0]}, ${marvel[1]}, ${marvel[2]}`)
```

Si aplicamos desestructuración, podemos darle un nombre especifico a cada posición.

```ts
const marvel: string[] = ['Iron Man', 'Spider-Man', 'Galactus']
const [ im, sm, g ] = marvel

console.log(`${im}, ${sm}, ${g}`)
```

Si queremos saltarnos posiciones del arreglo debemos enunciar los espacios que no necesitamos con una coma:

```ts
const marvel: string[] = ['Iron Man', 'Spider-Man', 'Galactus']
const [ , , g ] = marvel

console.log(`${g}`)
```

## Desestructuración de argumentos

Tenemos una función para calcular los impuestos sobre venta. Esa función recibe un arreglo de objetos, a los cuales mapea y agrega su valor a una variable con el total y luego lo multiplica por el impuesto:

```ts
const calculateSalesTax = (products: Product[], tax: number): number => {
    let total = 0
    products.map((p: Product) => total += p.price)
    return total * tax
}
```

Como nos damos cuenta, cuando recorremos la función tenemos un objeto llamado `p` que es de tipo `Product`. Nosotros podemos desestructurar los elementos de dicho argumento y simplificar un poco más la función:

```ts
const calculateSalesTax = (products: Product[], tax: number): number => {
    let total = 0
    products.map(({ price }) => total += price)
    return total * tax
}
```

Nuestra función puede retornar un arreglo en vez de un solo número, por ejemplo queremos retornar el total de los productos y el precio con impuesto añadido:

```ts
const calculateSalesTax = (products: Product[], tax: number): [number, number] => {
    let total = 0
    products.map(({ price }) => total += price)
    return [total, total * tax]
}
```

Cuando queremos crear una variable con el resultado de la función lo podemos hacer de 2 maneras:

```ts
const isv = calculateSalesTax(commodity, 0.19)
console.log('Total e ISV:', isv)
```

O:

```ts
const [total, isv] = calculateSalesTax(commodity, 0.19)
console.log('Total de los productos: ', total)
console.log('Impuesto sobre venta:', isv)
```

## Clases Básicas

La diferencia entre una clase y una interfaz, es que en la clase puedo definir un método o varios y proveer la implementación estandar de los mismos. Una clase simple puede lucir así:

```ts
class Heroe {
    alterEgo: string
    age: number
    nameReal: string
}


const ironMan = new Heroe()
console.log(ironMan)
```

También podemos deternminar el acceso a las propiedades de la clase mediante las palabras reservadas `public`, `private` y `static`.

## Constructor de una clase

Si queremos asignarle a una clases sus argumentos podemos escribir las propiedades y luego añadirlas al constructor. Por ejemplo si queremos que nos ingresen los datos para inicializar la clase, podemos hacer lo siguiente:

```ts
class Heroe {
    alterEgo: string
    age: number
    nameReal: string

    constructor(alterEgo: string, age: number, name: string) {
        this.alterEgo = alterEgo
        this.age = age
        this.nameReal = name
    }
}


const ironMan = new Heroe('Ironman', 30, 'Tony Stark')
console.log(ironMan)
```

Pero existe una manera más corta de pedir los valores para inicializar la clase, y es definir los argumentos directamente en el constructor:

```ts
class Heroe {
    constructor(
        public alterEgo: string, 
        public age: number, 
        public name: string
    ) {}
}


const ironMan = new Heroe('Ironman', 30, 'Tony Stark')
console.log(ironMan)
```

## Extender una clase

En el paradigma de la programación orientada a objetos (POO) existe la herencia. Podemos tener una clase que repite los argumentos de otra, entonces sacamos una clase padre con los argumentos que se repiten, y le extendemos clases hijas que hereden dichos argumentos. Por ejemplo:

```ts
class Person {
    constructor(public name: string, public address: string) { }
}


class Heroe extends Person {
    constructor(public alterEgo: string, public age: number, public name: string) {
        super(name, `New York`)
    }
}


const ironMan = new Heroe('Ironman', 30, 'Tony Stark')
console.log(ironMan)
```

## Genericos

Existen funciones que podemos dejar de tipo generico para que pueda detectar el retorno de la función, en base al tipo de los argumentos. Para declarar que una función es de tipo generico, usamos `<T>` y también definimos los tipos de los argumentos como `T`.

```ts
function whatTypeAmI<T> (args: T) {
    return args
}


let iAmString = whatTypeAmI('Soy una cadena de texto')
let iAmNumber = whatTypeAmI(100)
```

Si queremos especificar de que tipo debe ser nuestra función, debemos ingresar el tipo entre los signos `<>` luego de llamar el nombre de la función.

```ts
let iAmExplicit = whatTypeAmI<string>('Soy una variable explícita')
```

## Decoradores de clases

De la documentación de TS extraemos la siguiente función que va a determinar el comportamiento del decorador a usar en nuestra clase:

```ts
function classDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        newProperty = "new property"
        hello = "override"
    }
}


@classDecorator
class SuperClass {
    public prop: string = 'ABC123'

    print() {
        console.log('Hola mundo')
    }
}
```

Para poder usar los decoradores necesitamos ir al archivo `tsconfig.json` y hacer la siguiente configuración:

```json
{
    "compilerOptions": {
        ...,
        "experimentalDecorators": true,
        ...
    }
}
```

Si nosotros imprimimos la clase que creamos vamos a observar los siguiente:

```ts
console.log(SuperClass)
```

```ts
class extends constructor {
        constructor() {
            super(...arguments);
            this.newProperty = "new property";
            this.hello = "override";
        }
    }
```

Los decoradores sirven para extender la funcionalidad de una clase añadiendo lógica adicional.

## Encadenamiento Opcional

El optional chaining nos permite evitar errores cuando un objeto no tiene un propiedad que ha sido declara como opcional por una interfaz. Por ejemplo declaramos una interfaz que tiene un atributo opcional, en un objeto no lo usamos y en otro si. Luego creamos una función para imprimir la cantidad de elementos dentro de la propiedad declarada opcional. Si la propiedad no existe en el objeto, debemos retornar un 0, pero para evitar un error por pedir de manera obligatoria la propiedad usamos el signo `?` al final del nombre de la propiedad, ejemplo:

```js
interface Passenger {
    name: string
    children?: string[]
}

const passenger1: Passenger = {
    name: 'Ferrer'
}

const passenger2: Passenger = {
    name: 'Ferrer',
    children: ['Hijo 1', 'Hijo 2']
}


const printChildren = (passanger: Passenger): void => {
    const howChildren = passanger.children?.length || 0
    console.log(howChildren)
}


printChildren(passenger2)   // 2
printChildren(passenger1)   // 0
```
