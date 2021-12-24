import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Character } from '../interfaces/heroes-marvel.interface';
import { HeroesMarvelService } from '../services/heroes-marvel.service';

@Component({
	selector: 'app-form-add',
	templateUrl: './form-add.component.html'
})
export class FormAddComponent {
	@Input() newHero: Character = {
		name: '', power: 0
	}

	constructor(private heroesMarvelService: HeroesMarvelService) {}

	add = () => {
		if (this.newHero.name.trim().length === 0) return
		if (this.newHero.power === 0) return
		
		this.heroesMarvelService.addCharacter(this.newHero)

		this.newHero = {
			name: '',
			power: 0
		}
	}
}
