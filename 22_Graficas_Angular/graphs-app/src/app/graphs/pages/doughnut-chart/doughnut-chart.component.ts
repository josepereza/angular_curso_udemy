import { Component } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';

@Component({
    selector: 'app-doughnut-chart',
    templateUrl: './doughnut-chart.component.html',
    styles: [
    ]
})
export class DoughnutChartComponent {

    public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];

    public doughnutChartData: ChartData<'doughnut'> = {
        labels: this.doughnutChartLabels,
        datasets: [
            { data: [350, 200, 100], backgroundColor: ['#a2333d', '#22ca34', '#3b748c'] },
        ]
    };

    public doughnutChartType: ChartType = 'doughnut';
}
