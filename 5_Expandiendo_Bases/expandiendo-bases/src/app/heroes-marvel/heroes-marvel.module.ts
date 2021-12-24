import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MainPageComponent } from './main-page/main-page.component';
import { CharactersComponent } from './characters/characters.component';
import { FormAddComponent } from './form-add/form-add.component';
import { HeroesMarvelService } from './services/heroes-marvel.service';


@NgModule({
	declarations: [
		MainPageComponent,
		CharactersComponent,
		FormAddComponent
	],
	imports: [
		CommonModule,
		FormsModule
	],
	exports: [
		MainPageComponent
	],
	providers: [HeroesMarvelService]
})
export class HeroesMarvelModule { }
