import { Component } from '@angular/core';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
})
export class ListComponent {
    heroes: string[] = [
        'Spider-Man',
        'Iron Man',
        'Hulk',
        'Thor',
        'Hawkeye'
    ]

    heroesDelete: string[] = []

    lenHeroes: number = this.heroes.length
    n: number = 0

    deleteFirstHero = (): void => {
        if (this.n < this.lenHeroes) {
            const heroDelete = this.heroes.shift() ?? ''
            this.heroesDelete.push(heroDelete)
            this.n += 1
        }
    }

    restoreHeroes = (): void => {
        while (this.n > 0) {
            const heroRestore = this.heroesDelete.shift() ?? ''
            this.heroes.push(heroRestore)
            this.n -= 1
        }
    }
}
