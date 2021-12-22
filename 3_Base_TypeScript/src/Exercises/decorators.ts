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


console.log(SuperClass)
