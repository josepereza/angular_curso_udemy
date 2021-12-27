import { Component } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { CountryService } from '../../services/country.service';

@Component({
    selector: 'app-by-capital',
    templateUrl: './by-capital.component.html',
    styles: [
    ]
})
export class ByCapitalComponent {

    public term: string = ''
    public isError: boolean = false
    public countries: Country[] = []
    public placeholder: string = 'Buscar por capital'

    constructor(private countryService: CountryService) { }

    search = (term: string) => {
        this.isError = false
        this.term = term
        this.countryService.searchByCapital(this.term)
            .subscribe({
                next: countries => {
                    this.countries = countries
                },
                error: error => {
                    this.isError = true
                    this.countries = []
                }
            })
    }
}
