import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicsComponent } from './pages/basics/basics.component';
import { DynamicComponent } from './pages/dynamic/dynamic.component';
import { SwitchesComponent } from './pages/switches/switches.component';

const routes: Routes = [
    {
        path: '', children: [
            { path: 'basics', component: BasicsComponent },
            { path: 'dynamic', component: DynamicComponent },
            { path: 'switches', component: SwitchesComponent },
            { path: '**', redirectTo: 'basics' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TemplateRoutingModule { }
