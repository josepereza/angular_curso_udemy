import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Hero } from '../../interfaces/hero.interface';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styles: [
    ]
})
export class ConfirmComponent {

    constructor(
        private _dialogRef: MatDialogRef<ConfirmComponent>,
        @Inject(MAT_DIALOG_DATA) public hero: Hero
    ) { }

    cancel = () => {
        this._dialogRef.close()
    }

    delete = () => {
        this._dialogRef.close(true)
    }
}
