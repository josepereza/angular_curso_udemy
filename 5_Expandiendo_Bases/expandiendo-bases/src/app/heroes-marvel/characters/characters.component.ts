import { Component } from '@angular/core';
import { Character } from '../interfaces/heroes-marvel.interface';
import { HeroesMarvelService } from '../services/heroes-marvel.service';

@Component({
    selector: 'app-characters',
    templateUrl: './characters.component.html'
})
export class CharactersComponent {
    constructor(private heroesMarvelService: HeroesMarvelService){}

    get characters(): Character[] {
        return this.heroesMarvelService.characters
    }
}
