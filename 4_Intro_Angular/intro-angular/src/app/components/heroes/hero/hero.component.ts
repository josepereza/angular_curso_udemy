import { Component } from '@angular/core'


@Component({
    selector: 'app-hero',
    templateUrl: './hero.component.html'
})
export class HeroComponent {
    public name: string = 'IronMan'
    public age: number = 30

    get nameCapitalize(): string {
        return this.name.toUpperCase()
    } 

    getName = (): string => `${this.name} - ${this.age}`

    changeName = (): void => {this.name = 'Spider-Man'}
    changeAge = (): void => {this.age = 22}
}