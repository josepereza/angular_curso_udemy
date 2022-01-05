import { Component, OnInit } from '@angular/core';
import { Favorites, Person } from '../../interfaces/dynamic.interface';

@Component({
    selector: 'app-dynamic',
    templateUrl: './dynamic.component.html',
    styles: [
    ]
})
export class DynamicComponent implements OnInit {

    public person: Person = {
        name: 'David Ferrer',
        favorites: [
            { id: 1, name: 'Batman' },
            { id: 2, name: 'Spider-Man' }
        ]
    }

    public newGame: string = ''

    constructor() { }

    ngOnInit(): void {
    }

    addGame = () => {
        const newFavorite: Favorites = {
            id: this.person.favorites.length + 1,
            name: this.newGame
        }

        this.person.favorites.push({...newFavorite})
        this.newGame = ''
    }

    delete = (index: number) => {
        this.person.favorites.splice(index, 1)
    }

    save = () => {
        console.log('enviado')
    }
}
