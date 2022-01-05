import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-switches',
    templateUrl: './switches.component.html',
    styles: [
    ]
})
export class SwitchesComponent implements OnInit {

    public myForm: FormGroup = this._fb.group({
        genre: ['', Validators.required],
        notifications: [false, Validators.required],
        terms: [false, Validators.requiredTrue]
    })

    public person = {
        genre: 'M',
        notifications: true
    }

    constructor(private _fb: FormBuilder) { }

    ngOnInit(): void {
        this.myForm.reset({
            ...this.person,
            terms: false
        })

        this.myForm.valueChanges.subscribe(({ terms, ...form }) => {
            this.person = form
        })
    }

    isInvalidField = (field: string) => {
        return this.myForm.controls['terms'].errors && this.myForm.controls['terms'].touched
    }

    save = () => {
        if (this.myForm.invalid) {
            this.myForm.markAllAsTouched()
            return
        }
        const formValue = { ...this.myForm.value }
        delete formValue.terms

        this.person = formValue
    }
}
