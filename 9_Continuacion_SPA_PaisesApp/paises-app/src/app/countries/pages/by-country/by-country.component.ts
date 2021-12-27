import { Component, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { CountryService } from '../../services/country.service';


@Component({
    selector: 'app-by-country',
    templateUrl: './by-country.component.html',
    styles: [`li { cursor: pointer; }`]
})
export class ByCountryComponent {
    public term: string = ''
    public isError: boolean = false
    public countries: Country[] = []
    public countriesSuggested: Country[] = []
    public showSuggest: boolean = false


    constructor(private countryService: CountryService) { }

    search = (term: string): void => {
        this.showSuggest = false
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
        this.showSuggest = true
        this.isError = false
        this.term = term
        this.countryService.searchCountry(term)
            .subscribe({
                next: countries => this.countriesSuggested = countries.splice(0, 3),
                error: error => this.countriesSuggested = []
            })
    }
}