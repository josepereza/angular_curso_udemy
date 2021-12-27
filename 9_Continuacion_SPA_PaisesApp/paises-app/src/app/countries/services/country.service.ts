import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Country } from '../interfaces/country.interface';


@Injectable({
    providedIn: 'root'
})
export class CountryService {

    get httpParams() {
        return new HttpParams().set('fields', 'name,capital,cca2,flags,population')
    }

    private apiURL: string = "https://restcountries.com/v3.1/"

    constructor(private http: HttpClient) { }

    getURL = (genre: string, term: string): string => {
        return `${this.apiURL}/${genre}/${term}`
    }

    searchCountry = (term: string = ''): Observable<Country[]> => {
        return this.http.get<Country[]>(this.getURL('name', term), { params: this.httpParams })
            .pipe(tap(console.log))
    }

    searchByCapital = (term: string = ''): Observable<Country[]> => {
        return this.http.get<Country[]>(this.getURL('capital', term), { params: this.httpParams })
    }

    searchByRegion = (term: string = ''): Observable<Country[]> => {
        return this.http.get<Country[]>(this.getURL('region', term), { params: this.httpParams })
    }

    getCountryByCode = (code: string = ''): Observable<Country[]> => {
        return this.http.get<Country[]>(this.getURL('alpha', code))
    }
}
