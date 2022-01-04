import { Component } from '@angular/core';

@Component({
    selector: 'app-switches',
    templateUrl: './switches.component.html',
    styles: [
    ]
})
export class SwitchesComponent {

    public person = {
        genre: '',
        notifications: true
    }

    public termsAndConditions: boolean = false
}
