import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styles: [
    ]
})
export class RegisterComponent implements OnInit {

    public form: FormGroup = this._fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    })

    constructor(private _fb: FormBuilder, private _router: Router, private _authService: AuthService) { }

    ngOnInit(): void {}

    register = () => {
        const { name, email, password } = this.form.value
        this._authService.register(name, email, password)
            .subscribe(ok => {
                if (ok === true) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Bienvenido',
                        timer: 1500,
                        timerProgressBar: true,
                        position: 'top-end',
                        width: 300,
                        showConfirmButton: false
                    })
                    this._router.navigateByUrl('/dashboard')
                } else {                    
                    if (ok.msg) {
                        Swal.fire('Error', ok.msg.toString(), 'error')
                    } else {
                        const { errors: { errors } } = ok
                        Swal.fire('Error', errors[0].msg.toString(), 'error')
                    }
                }
            })
    }
}
