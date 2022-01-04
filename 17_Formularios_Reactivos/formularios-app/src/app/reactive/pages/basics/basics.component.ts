import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-basics',
    templateUrl: './basics.component.html',
    styles: [
    ]
})
export class BasicsComponent implements OnInit {

    public myForm: FormGroup = this._formBuilder.group({
        name: [, [Validators.required, Validators.minLength(3)]],
        price: [, [Validators.required, Validators.min(0)]],
        stocks: [, [Validators.required, Validators.min(10)]]
    })

    constructor(private _formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.myForm.reset({
            name: 'Predeterminado'
        })
    }

    isInvalidField = (field: string) => {
        return this.myForm.controls[field].errors && this.myForm.controls[field].touched
    }

    save = () => {
        if (this.myForm.invalid) {
            this.myForm.markAllAsTouched()
            return
        }
        this.myForm.reset()
    }
}
