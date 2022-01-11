import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styles: [
    ]
})
export class AddProductComponent {

    public colorError: string = 'pink'
    public msgError!: string

    public form: FormGroup = this._fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]]
    })

    constructor(private _fb: FormBuilder) { }

    isInvalidField = (field: string): boolean => {
        if (this.form.get(field)?.invalid && this.form.get(field)?.getError('required')) {
            this.msgError = `El campo ${field} es requerido`
            return true
        }
        if (this.form.get(field)?.invalid && this.form.get(field)?.getError('minlength')) {
            this.msgError = `El campo ${field} debe tener mínimo 3 caracteres`
            return true
        }
        return false
    }
}
