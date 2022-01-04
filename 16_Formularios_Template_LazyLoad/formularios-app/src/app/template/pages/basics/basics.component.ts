import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-basics',
    templateUrl: './basics.component.html',
    styles: [
    ]
})
export class BasicsComponent implements OnInit {

    @ViewChild('myForm', {static: true}) public form!: NgForm

    constructor() { }

    ngOnInit(): void {
    }

    validProduct = (): boolean => this.form?.controls['product']?.invalid && this.form?.controls['product']?.touched
    
    validPrice = (): boolean => {
        return (this.form?.controls['price']?.value < 0 || this.form?.value.price === '') && this.form?.controls['price']?.touched
    }

    save = () => {
        this.form.resetForm({
            price: 0,
            stocks: 0
        })
    }
}
