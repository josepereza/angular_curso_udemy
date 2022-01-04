import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-dynamic',
    templateUrl: './dynamic.component.html',
    styles: [
    ]
})
export class DynamicComponent implements OnInit {

    public myForm: FormGroup = this._formBuilder.group({
        name: [, [Validators.required, Validators.minLength(3)]],
        favorites: this._formBuilder.array([
            ['Metal Gear', Validators.required],
            ['Death Stranding', Validators.required]
        ], [Validators.required])
    })

    public newFavorite: FormControl = this._formBuilder.control('', Validators.required)

    get favoritesArr() {
        return this.myForm.get('favorites') as FormArray
    }

    constructor(private _formBuilder: FormBuilder) { }

    ngOnInit(): void {
    }

    isInvalidField = (field: string) => {
        return this.myForm.controls[field].errors && this.myForm.controls[field].touched
    }

    addFav = () => {
        if (this.newFavorite.invalid) return
        this.favoritesArr.push(new FormControl(this.newFavorite.value, Validators.required))
        this.newFavorite.reset()
    }

    deleteFav = (index: number) => this.favoritesArr.removeAt(index)

    save = () => {
        if (this.myForm.invalid) {
            this.myForm.markAllAsTouched()
            return
        }
        console.log(this.myForm.value)
    }
}
