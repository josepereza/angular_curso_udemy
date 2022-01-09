import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstateComponent } from './pages/estate/estate.component';
import { FullScreenComponent } from './pages/full-screen/full-screen.component';
import { MarkersComponent } from './pages/markers/markers.component';
import { ZoomRangeComponent } from './pages/zoom-range/zoom-range.component';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: 'full-screen', component: FullScreenComponent },
            { path: 'markers', component: MarkersComponent },
            { path: 'zoom-range', component: ZoomRangeComponent },
            { path: 'estate', component: EstateComponent },
            { path: '**', redirectTo: 'full-screen' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MapsRoutingModule { }
