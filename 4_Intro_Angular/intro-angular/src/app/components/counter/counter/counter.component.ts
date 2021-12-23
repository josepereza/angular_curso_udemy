import { Component } from '@angular/core'


@Component({
    selector: 'app-counter',
    template: `
        <h1>{{ title }}</h1>

        <h3>La base es <strong>{{ base }}</strong> para el modificar el contador</h3>

        <button (click)="accumulate(base)">+{{ base }}</button>
        <span> {{ n }} </span>
        <button (click)="accumulate(-base)">-{{ base }}</button>
    `
})
export class CounterComponent {
    public title: string = 'Contador App'
    public n: number = 10
    public base: number = 5

    accumulate = (value: number) => this.n += value
}