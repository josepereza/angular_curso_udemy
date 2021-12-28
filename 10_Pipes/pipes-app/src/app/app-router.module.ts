import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BasicComponent } from './sales/pages/basic/basic.component';
import { NotCommonsComponent } from './sales/pages/not-commons/not-commons.component';
import { NumbersComponent } from './sales/pages/numbers/numbers.component';
import { SortComponent } from './sales/pages/sort/sort.component';


const routes: Routes = [
    { path: '', component: BasicComponent, pathMatch: 'full' },
    { path: 'not-commons', component: NotCommonsComponent },
    { path: 'numbers', component: NumbersComponent },
    { path: 'sort', component: SortComponent },
    { path: '**', redirectTo: '' }
]


@NgModule({
    declarations: [],
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRouterModule { }
