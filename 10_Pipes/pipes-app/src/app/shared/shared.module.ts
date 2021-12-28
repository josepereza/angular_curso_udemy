import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimeNgModule } from '../prime-ng/prime-ng.module';

import { MenuComponent } from './menu/menu.component';


@NgModule({
    declarations: [
        MenuComponent
    ],
    imports: [
        CommonModule,
        PrimeNgModule
    ],
    exports: [
        MenuComponent
    ]
})
export class SharedModule { }
