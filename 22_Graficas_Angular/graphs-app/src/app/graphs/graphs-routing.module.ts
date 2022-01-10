import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarChartComponent } from './pages/bar-chart/bar-chart.component';
import { DoubleChartComponent } from './pages/double-chart/double-chart.component';
import { DoughnutChartHttpComponent } from './pages/doughnut-chart-http/doughnut-chart-http.component';
import { DoughnutChartComponent } from './pages/doughnut-chart/doughnut-chart.component';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: 'bar-chart', component: BarChartComponent },
            { path: 'double-chart', component: DoubleChartComponent },
            { path: 'doughnut-chart', component: DoughnutChartComponent },
            { path: 'doughnut-chart-http', component: DoughnutChartHttpComponent },
            { path: '**', redirectTo: 'bar-chart' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GraphsRoutingModule { }
