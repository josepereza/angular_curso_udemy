import { Component } from '@angular/core';

@Component({
    selector: 'app-numbers',
    templateUrl: './numbers.component.html',
    styles: [
    ]
})
export class NumbersComponent {
    public netSales: number = 12_345_678.909876
    public percent: number = 0.48
}
