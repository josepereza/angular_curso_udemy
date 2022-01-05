import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ValidatorsService {

    public patternNameSurname: string = '([a-zA-Z]+) ([a-zA-Z]+)'
    public patternEmail: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'

    constructor() { }

    canNotBe = (control: FormControl): ValidationErrors | null => {
        const value = control.value?.trim().toLowerCase()
        if (value === 'ferrer') return { itsUsed: true }
        return null
    }

    equalsFields = (field1: string, field2: string) => {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const p1 = formGroup.get(field1)?.value
            const p2 = formGroup.get(field2)?.value

            if (p1 !== p2) {
                formGroup.get(field2)?.setErrors({ equals: false })
                return { equals: false }
            }
            formGroup.get(field2)?.setErrors(null)
            return null
        }
    }
}
