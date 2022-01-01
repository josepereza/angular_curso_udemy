import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
    selector: 'app-hero',
    templateUrl: './hero.component.html',
    styles: [`
        img {
            width: 100%;
            border-radius: 5px;
        }
    `]
})
export class HeroComponent implements OnInit {
    public hero!: Hero

    constructor(private activatedRoute: ActivatedRoute, private heroesService: HeroesService, private router: Router) { }

    ngOnInit(): void {
        this.activatedRoute.params
            .pipe(switchMap(({ id }) => this.heroesService.getHeroeById(id)), tap(console.log))
            .subscribe(hero => this.hero = hero)
    }

    goBack = () => this.router.navigate(['/heroes/list'])
}
