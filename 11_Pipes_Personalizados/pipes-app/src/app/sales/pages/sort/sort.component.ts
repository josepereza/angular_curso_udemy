import { Component } from '@angular/core';
import { Hero, Color } from '../../interfaces/sales.interface';

@Component({
    selector: 'app-sort',
    templateUrl: './sort.component.html',
    styles: [
    ]
})
export class SortComponent {
    public isUpperCase: boolean = false
    public orderBy: string = ''

    public heroes: Hero[] = [
        {
            name: 'Flash',
            fly: false,
            color: Color.red
        },
        {
            name: 'Superman',
            fly: true,
            color: Color.blue
        },
        {
            name: 'Escarabajo Azul',
            fly: true,
            color: Color.blue
        },
        {
            name: 'Green Lantern',
            fly: true,
            color: Color.green
        },
        {
            name: 'Batman',
            fly: false,
            color: Color.black
        },
    ]

    toggleUpperCase = () => {
        this.isUpperCase = !this.isUpperCase
    }

    changeOrder = (value: string) => {
        this.orderBy = value
    }
}
