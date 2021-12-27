import { Component, Input } from '@angular/core';
import { Country } from '../../interfaces/country.interface';

@Component({
    selector: 'app-country-table',
    templateUrl: './country-table.component.html',
    styles: [
    ]
})
export class CountryTableComponent {
    @Input('data') countries: Country[] = []
}
