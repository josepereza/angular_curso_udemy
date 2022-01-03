import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Hero } from '../interfaces/hero.interface';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class HeroesService {

    private baseUrl: string = environment.baseUrl
    public baseEndpoint: string = `${this.baseUrl}/heroes`

    constructor(private http: HttpClient) { }

    getHeroes = (): Observable<Hero[]> => {
        return this.http.get<Hero[]>(this.baseEndpoint)
    }

    getHeroeById = (id: string): Observable<Hero> => {
        return this.http.get<Hero>(`${this.baseEndpoint}/${id}`)
    }

    getSuggestions = (term: string): Observable<Hero[]> => {
        const params = new HttpParams()
            .set('q', `${term}`)
            .set('_limit', '5')
        return this.http.get<Hero[]>(this.baseEndpoint, { params })
    }

    addHero = (hero: Hero): Observable<Hero> => {
        return this.http.post<Hero>(this.baseEndpoint, hero)
    }

    updateHero = (hero: Hero): Observable<Hero> => {
        return this.http.put<Hero>(`${this.baseEndpoint}/${hero.id}`, hero)
    }

    deleteHero = (id: string): Observable<any> => {
        return this.http.delete<any>(`${this.baseEndpoint}/${id}`)
    }
}
