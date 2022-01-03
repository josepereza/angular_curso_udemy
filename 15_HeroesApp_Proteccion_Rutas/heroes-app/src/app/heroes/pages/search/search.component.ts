import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styles: [
    ]
})
export class SearchComponent implements OnInit {
    public term: string = ''
    public heroes: Hero[] = []
    public heroSelected: Hero | undefined

    constructor(private heroesService: HeroesService) { }

    ngOnInit(): void {
    }

    searching = () => {
        this.heroesService.getSuggestions(this.term)
            .subscribe(heroes => this.heroes = heroes)
    }

    optionSelected = (event: MatAutocompleteSelectedEvent) => {
        if (!event.option.value) return
        const hero: Hero = event.option.value
        // if (!hero) return
        this.term = hero.superhero
        this.heroesService.getHeroeById(hero.id!)
            .subscribe(hero => this.heroSelected = hero)
    }
}
