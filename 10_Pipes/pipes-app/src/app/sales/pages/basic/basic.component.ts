import { Component } from '@angular/core';

@Component({
    selector: 'app-basic',
    templateUrl: './basic.component.html',
    styles: [
    ]
})
export class BasicComponent {
    public nameLowerCase: string = 'carlos'
    public nameUpperCase: string = 'DAVID'
    public nameTitleCase: string = 'paEz FeRRer'
}
