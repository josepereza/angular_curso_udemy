import { Component, Input } from '@angular/core';
import { Hero, Publisher } from '../../interfaces/hero.interface';

@Component({
    selector: 'app-hero-card',
    templateUrl: './hero-card.component.html',
    styles: [
    ]
})
export class HeroCardComponent {
    @Input() public hero!: Hero
}
