import { Component, OnInit } from '@angular/core';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../components/confirm/confirm.component';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styles: [`img { width: 100%; border-radius: 5px;}`]
})
export class AddComponent implements OnInit {

    public publisher = [
        {
            id: 'DC Comics',
            desc: 'DC - Comics'
        },
        {
            id: 'Marvel Comics',
            desc: 'Marvel - Comics'
        }
    ]

    public hero: Hero = {
        superhero: '',
        alter_ego: '',
        characters: '',
        first_appearance: '',
        publisher: Publisher.MarvelComics,
        alt_img: ''
    }

    constructor(
        private _heroesService: HeroesService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _snackbar: MatSnackBar,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        if (!this._router.url.includes('edit')) return
        this._activatedRoute.params
            .pipe(switchMap(({ id }) => this._heroesService.getHeroeById(id)), tap(console.log))
            .subscribe(hero => this.hero = hero)
    }

    save = () => {
        const { id, superhero, alter_ego, characters, first_appearance, alt_img } = this.hero
        if (superhero.trim().length === 0) return

        if (!id) {
            this._heroesService.addHero(this.hero)
                .subscribe(hero => {
                    this._router.navigate(['/heroes/edit', hero.id])
                    this.showSnackbar('Registro creado')
                })
        } else {
            this._heroesService.updateHero(this.hero)
                .subscribe(_ => this.showSnackbar('Registro Actualizado'))
        }
    }

    delete_hero = () => {
        const dialog = this._dialog.open(ConfirmComponent, {
            width: '300px',
            data: { ...this.hero }
        })

        dialog.afterClosed()
            .subscribe(result => {
                if (result) {
                    this._heroesService.deleteHero(this.hero.id!)
                        .subscribe(_ => {
                            this._router.navigate(['/heroes'])
                            this.showSnackbar('Registro eliminado')
                        })
                }
            })
    }

    showSnackbar = (msg: string) => {
        this._snackbar.open(msg, 'Ok!', {

            duration: 2500
        })
    }
}
