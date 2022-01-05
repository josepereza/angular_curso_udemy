import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { delay, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EmailValidatorService implements AsyncValidator {

    private _endpointUsers = `${environment.baseUrl}/users`

    constructor(private _http: HttpClient) { }

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        const email = control.value
        return this._http.get<any[]>(`${this._endpointUsers}?q=${email}`)
            .pipe(
                map(res => {
                    return (res.length === 0) ? null : { emailIsUsed: true }
                }),
                delay(2000)
            )
    }
}
