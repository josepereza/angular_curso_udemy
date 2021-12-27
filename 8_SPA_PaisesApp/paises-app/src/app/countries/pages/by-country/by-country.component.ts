import { Component, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { CountryService } from '../../services/country.service';


@Component({
    selector: 'app-by-country',
    templateUrl: './by-country.component.html',
    styles: [
    ]
})
export class ByCountryComponent {
    public term: string = ''
    public isError: boolean = false
    public countries: Country[] = []


    constructor(private countryService: CountryService) { }
    
    search = (term: string): void => {
        this.isError = false
        this.term = term
        this.countryService.searchCountry(this.term)
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

    suggestions = (term: string) => {
        this.isError = false
    }
}