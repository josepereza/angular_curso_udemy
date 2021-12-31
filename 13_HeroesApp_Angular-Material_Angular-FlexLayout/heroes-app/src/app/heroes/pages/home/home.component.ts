import { Component } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styles: [`
        mat-sidenav { width: 300px; }
        a mat-icon { margin-right: 25px; }
        .container { margin: 25px; }
    `]
})
export class HomeComponent { }
