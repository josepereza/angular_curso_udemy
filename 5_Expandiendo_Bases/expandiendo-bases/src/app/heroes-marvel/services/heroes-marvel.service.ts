import { Injectable } from "@angular/core";
import { Character } from "../interfaces/heroes-marvel.interface";


@Injectable()
export class HeroesMarvelService {

    private _characters: Character[] = [
        {
            name: 'Spider-Man',
            power: 90000
        },
        {
            name: 'Iron-Man',
            power: 55000
        }
    ]

    get characters(): Character[] {
        return [...this._characters]
    }
    
    constructor() {
        console.log('Servicio inicializado')
    }

    addCharacter = (character: Character) => {
        this._characters.push(character)
    }
}