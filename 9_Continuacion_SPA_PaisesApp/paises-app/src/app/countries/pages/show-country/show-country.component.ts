import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Country } from '../../interfaces/country.interface';
import { CountryService } from '../../services/country.service';

@Component({
    selector: 'app-show-country',
    templateUrl: './show-country.component.html',
    styles: [
    ]
})
export class ShowCountryComponent implements OnInit {
    public country!: Country

    constructor(private activatedRoute: ActivatedRoute, private countryService: CountryService) { }

    ngOnInit(): void {
        this.activatedRoute.params
            .pipe(switchMap(({ id }) => this.countryService.getCountryByCode(id)), tap(console.log))
            .subscribe(country => this.country = country[0])
    }
}
