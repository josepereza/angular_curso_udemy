function whatTypeAmI<T> (args: T) {
    return args
}


let iAmString = whatTypeAmI('Soy una cadena de texto')
let iAmNumber = whatTypeAmI(100)

let iAmExplicit = whatTypeAmI<string>('Soy una variable explícita')