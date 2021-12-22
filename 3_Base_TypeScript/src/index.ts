const variables = (): void => {
    let x: string = 'Carlos'
    let hp: number | string = 95
    let isAlive: boolean = true

    x = 'David'
    hp = 'FULL'

    console.log(x, hp, isAlive)
}


const arrayObjectInterface = (): void => {
    let abilities: (string | boolean | number)[] = ['Bash', 'Counter', 'Healing']


    interface Character {
        name: string
        hp: number
        abilities: string[]
        isAlive?: boolean
    }

    const character: Character = {
        name: 'Ferrer',
        hp: 100,
        abilities: ['Healing', 'Bash']
    }

    character.isAlive = true

    console.table(character)
}


const functions = (): void => {
    const add = (a: number, b: number): number => {
        return a + b
    }

    const multiply = (x: number, base: number = 2, y?: number): number => {
        return x * base * y
    }

    const result: number = multiply(2, 5)

    console.log(result)
}


const functionsWithObjects = (): void => {
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

    const healCharacter = (character: Character, pointsHeal: number): void => {
        character.hp += pointsHeal
    }

    healCharacter(character, 20)
    character.showHp()
}


const homework = (): void => {
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

    const superHero: SuperHero = {
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

    const address = superHero.showAddress()

    console.log(address)
}


const desestructuring = (): void => {
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

    const { volume, second, song, details: { author: authorDetail, year } } = musicPlayer
    // const { volume, second, song, details } = musicPlayer
    // const { author, year } = details

    console.log(`Volumen: ${volume}, Segundo: ${second}, Canción: ${song}, Autor: ${authorDetail}, Año: ${year}`)
}

desestructuring()
