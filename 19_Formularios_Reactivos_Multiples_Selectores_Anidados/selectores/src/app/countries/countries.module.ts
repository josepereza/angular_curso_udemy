import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CountriesRoutingModule } from './countries-routing.module';
import { SelectorPageComponent } from './pages/selector-page/selector-page.component';


@NgModule({
    declarations: [
        SelectorPageComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CountriesRoutingModule
    ]
})
export class CountriesModule { }
