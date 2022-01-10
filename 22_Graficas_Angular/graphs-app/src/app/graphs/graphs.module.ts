import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgChartsModule } from "ng2-charts";

import { GraphsRoutingModule } from './graphs-routing.module';
import { BarChartComponent } from './pages/bar-chart/bar-chart.component';
import { DoubleChartComponent } from './pages/double-chart/double-chart.component';
import { DoughnutChartComponent } from './pages/doughnut-chart/doughnut-chart.component';
import { DoughnutChartHttpComponent } from './pages/doughnut-chart-http/doughnut-chart-http.component';
import { BarComponent } from './components/bar/bar.component';


@NgModule({
    declarations: [
        BarChartComponent,
        DoubleChartComponent,
        DoughnutChartComponent,
        DoughnutChartHttpComponent,
        BarComponent
    ],
    imports: [
        CommonModule,
        GraphsRoutingModule,
        NgChartsModule
    ]
})
export class GraphsModule { }
