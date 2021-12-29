import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimeNgModule } from '../prime-ng/prime-ng.module';

import { BasicComponent } from './pages/basic/basic.component';
import { NotCommonsComponent } from './pages/not-commons/not-commons.component';
import { NumbersComponent } from './pages/numbers/numbers.component';
import { SortComponent } from './pages/sort/sort.component';
import { CapitalLetterPipe } from './pipes/capital-letter.pipe';
import { FlyPipe } from './pipes/fly.pipe';
import { SortPipe } from './pipes/sort.pipe';

@NgModule({
    declarations: [
        NumbersComponent,
        NotCommonsComponent,
        BasicComponent,
        SortComponent,
        CapitalLetterPipe,
        FlyPipe,
        SortPipe
    ],
    imports: [
        CommonModule,
        PrimeNgModule
    ],
    exports: [
        NumbersComponent,
        NotCommonsComponent,
        BasicComponent,
        SortComponent
    ]
})
export class SalesModule { }
