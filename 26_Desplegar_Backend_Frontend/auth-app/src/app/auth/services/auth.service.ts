import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse, User } from '../interfaces/auth.interface';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _baseURL: string = `${environment.baseURL}/auth`
    private _user!: User

    get user() {
        return { ...this._user }
    }

    constructor(private _http: HttpClient) { }

    private _general = (url: string, body: {}) => {
        return this._http.post<AuthResponse>(url, body)
            .pipe(
                tap(res => {
                    if (res.ok) {
                        localStorage.setItem('token', res.token!)
                        this._user = {
                            uid: res.uid!,
                            name: res.name!,
                            email: res.email!
                        }
                    }
                }),
                map(res => res.ok),
                catchError(error => of(error.error))
            )
    }

    register = (...args: string[]) => {
        const url = `${this._baseURL}/register`
        const [name, email, password] = args
        const body = {
            name,
            email,
            password
        }
        return this._general(url, body)
    }

    login = (email: string, password: string) => {
        const url = `${this._baseURL}/login`
        const body = {
            email, password
        }
        return this._general(url, body)
    }

    validateToken = (): Observable<boolean> => {
        const url = `${this._baseURL}/validate-jwt`
        const headers = new HttpHeaders()
            .set('x-token', localStorage.getItem('token') ?? '')
        return this._http.get<AuthResponse>(url, { headers })
            .pipe(
                map(res => {
                    localStorage.setItem('token', res.newToken!)
                    this._user = {
                        name: res.name!,
                        uid: res.uid!,
                        email: res.email!
                    }
                    return res.ok
                }),
                catchError(error => of(false))
            )
    }

    logout = (): void => localStorage.clear()
}
