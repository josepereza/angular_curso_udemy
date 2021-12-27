import { Component } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { CountryService } from '../../services/country.service';


@Component({
    selector: 'app-by-region',
    templateUrl: './by-region.component.html',
    styles: [
    ]
})
export class ByRegionComponent {
    public regions: string[] = ['africa', 'america', 'asia', 'europe', 'oceania']
    public activeRegion: string = ''
    public countries: Country[] = []

    constructor(private countryService: CountryService) { }

    activateRegion = (region: string): void => {
        if (this.activeRegion === region) return
        this.countries = []
        this.activeRegion = region
        this.countryService.searchByRegion(this.activeRegion)
            .subscribe(countries => this.countries = countries)
    }

    getClassCSS = (region: string): string => {
        return (region === this.activeRegion) ? 'btn-primary' : 'btn-outline-primary'
    }
}
