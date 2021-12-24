import { Component } from '@angular/core';
import { Character } from '../interfaces/heroes-marvel.interface';


@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html'
})
export class MainPageComponent {

    public newHero: Character = {
		name: 'Ferrer', power: 10
	}

    constructor() { }
}
