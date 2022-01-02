import { Component, Input } from '@angular/core';
import { Hero, Publisher } from '../../interfaces/hero.interface';

@Component({
    selector: 'app-hero-card',
    templateUrl: './hero-card.component.html',
    styles: [`mat-card { margin-top: 25px }`]
})
export class HeroCardComponent {
    @Input() public hero!: Hero
}
