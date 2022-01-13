import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styles: [` * {margin: 15px;}`]
})
export class DashboardComponent {

    get user() {
        return this._authService.user
    }

    constructor(private _router: Router, private _authService: AuthService) { }

    logout = () => {
        this._authService.logout()
        this._router.navigateByUrl('/auth/')
    }
}
