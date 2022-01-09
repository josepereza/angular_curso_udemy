import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenuComponent } from './components/menu/menu.component';


@NgModule({
    declarations: [MenuComponent],
    imports: [
        CommonModule, 
        RouterModule
    ],
    exports: [MenuComponent]
})
export class SharedModule { }
