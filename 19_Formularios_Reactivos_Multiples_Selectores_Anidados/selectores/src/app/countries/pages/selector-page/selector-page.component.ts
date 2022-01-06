import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country';
import { switchMap, tap } from 'rxjs';


@Component({
    selector: 'app-selector-page',
    templateUrl: './selector-page.component.html',
    styles: [
    ]
})
export class SelectorPageComponent implements OnInit {

    public form: FormGroup = this._fb.group({
        region: ['', [Validators.required]],
        country: ['', Validators.required],
        border: ['', Validators.required]
    })
    
    public regions: string[] = []
    public countries: Country[] = []
    public borders: Country[] = []
    
    public loading: boolean = false 

    constructor(private _fb: FormBuilder, private _cs: CountryService) { }

    ngOnInit(): void {
        this.regions = this._cs.regions

        this.form.get('region')?.valueChanges
            .pipe(
                tap(_ => {
                    this.countries = []
                    this.form.get('country')?.reset('')
                    this.loading = true
                }),
                switchMap(region => this._cs.getCountriesByRegion(region))
            )
            .subscribe(countries => {
                this.countries = countries
                this.loading = false
            })

        this.form.get('country')?.valueChanges
            .pipe(
                tap(_ => {
                    this.borders = []
                    this.form.get('border')?.reset('')
                    this.loading = true
                }),
                switchMap(cca2 => this._cs.getCountryByCAA2(cca2)),
                switchMap(country => this._cs.getCountriesByCodes(country?.borders!))
            )
            .subscribe(countries => {
                this.borders = countries
                this.loading = false
            }) 
    }

    isInvalidField = (field: string) => {
        const f = this.form.get(field)
        return f?.errors && f?.touched && f?.invalid
    }

    save = () => {
        if (this.form.invalid) {
            this.form.markAllAsTouched()
            return
        }
        console.log(this.form.value)
    }
}
