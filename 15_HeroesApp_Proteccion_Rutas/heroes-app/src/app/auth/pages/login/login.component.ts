import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
    ]
})
export class LoginComponent {

    constructor(private _router: Router, private _authService: AuthService) { }

    login = () => {
        this._authService.login()
            .subscribe({
                next: ({ id }) => {
                    id && this._router.navigate(['/heroes'])
                },
                error: ({ statusText }) => console.log(statusText)
            })
    }
}
