import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, Observable, of, tap } from 'rxjs';
import { Auth } from '../interfaces/auth.interfaces';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _baseURL: string = environment.baseUrl
    private _baseEndpoint: string = `${this._baseURL}/usuarios`
    private _auth: Auth | undefined

    get auth() {
        return { ...this._auth }
    }

    constructor(private _http: HttpClient) { }

    login = (): Observable<Auth> => {
        return this._http.get<Auth>(`${this._baseEndpoint}/1`)
            .pipe(
                tap(auth => this._auth = auth),
                tap(auth => localStorage.setItem('id', auth.id))
            )
    }

    logout = () => {
        this._auth = undefined
        localStorage.removeItem('id')
    }

    verifyAuth = (): Observable<boolean> => {
        if (!localStorage.getItem('id')) return of(false)
        return this._http.get<Auth>(`${this._baseEndpoint}/1`)
            .pipe(map(auth => {
                this._auth = auth
                return true
            }))
    }
}
