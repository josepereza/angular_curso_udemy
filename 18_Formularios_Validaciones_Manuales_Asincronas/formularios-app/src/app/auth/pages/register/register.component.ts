import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidatorService } from 'src/app/shared/services/email-validator.service';
import { ValidatorsService } from 'src/app/shared/services/validators.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styles: [
    ]
})
export class RegisterComponent implements OnInit {

    public form: FormGroup = this._fb.group({
        name: ['', [Validators.required, Validators.pattern(this._vs.patternNameSurname)]],
        email: ['', [Validators.required, Validators.pattern(this._vs.patternEmail)], [this._evs]],
        username: ['', [Validators.required, this._vs.canNotBe]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirm_password: ['', [Validators.required]]
    }, {
        validators: [this._vs.equalsFields('password', 'confirm_password')]
    })

    get emailError(): string {
        const email = this.form.get('email')
        if ( email!.getError('required') ) return 'El email es obligatorio'
        else if ( email!.getError('pattern') ) return 'El email debe tener un formato de correo'
        else if ( email!.getError('emailIsUsed') ) return 'El email ya está siendo usado por otro usuario'
        return ''
    }

    constructor(private _fb: FormBuilder, private _vs: ValidatorsService, private _evs: EmailValidatorService) { }

    ngOnInit(): void { 
        this.form.reset({
            name: 'David Ferrer',
            email: 'test1@test.com',
            username: 'ferrer15'
        })
    }

    isInvalidField = (field: string) => {
        return this.form.controls[field].errors && this.form.controls[field].touched && this.form.get(field)?.invalid
    }

    

    save = () => {
        if (this.form.invalid) {
            this.form.markAllAsTouched()
            return
        }

        console.log(this.form.value)
    }
}
