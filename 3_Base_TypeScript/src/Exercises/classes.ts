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