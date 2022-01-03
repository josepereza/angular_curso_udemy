import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'src/app/auth/interfaces/auth.interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styles: [`
        mat-sidenav { width: 300px; }
        a mat-icon { margin-right: 25px; }
        .container { margin: 25px; }
    `]
})
export class HomeComponent { 

    get auth(){
        return this._authService.auth
    }

    constructor(private router: Router, private _authService: AuthService) {}

    logout = () => {
        this.router.navigate(['/auth']);
        this._authService.logout()
    }
}
