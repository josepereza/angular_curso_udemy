import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Country } from '../interfaces/country';


@Injectable({
    providedIn: 'root'
})
export class CountryService {

    private _regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

    private _endpointRegion: string = `${environment.urlBase}/region`
    private _endpointCountry: string = `${environment.urlBase}/alpha`

    get regions(): string[] {
        return [...this._regions]
    }
    
    get httpParams() {
        return new HttpParams().set('fields', 'name,cca2,borders')
    }

    constructor(private _http: HttpClient) { }

    getCountriesByRegion = (region: string): Observable<Country[]> => {
        const url = `${this._endpointRegion}/${region}`
        return this._http.get<Country[]>(url, { params: this.httpParams })
    }

    getCountryByCAA2 = (cca2: string): Observable<Country | null> => {
        if (!cca2) return of(null)
        const url = `${this._endpointCountry}/${cca2}`
        return this._http.get<Country>(url, { params: this.httpParams })
    }

    getCountryByCAA2Small = (cca2: string): Observable<Country> => {
        const url = `${this._endpointCountry}/${cca2}`
        return this._http.get<Country>(url, { params: this.httpParams })
    }

    getCountriesByCodes = (borders: string[]): Observable<Country[]> => {
        if (!borders) return of([])
        const request: Observable<Country>[]  = []
        borders.forEach(cod => {
            const req = this.getCountryByCAA2Small(cod)
            request.push(req)
        })
        return combineLatest(request)
    }
}
