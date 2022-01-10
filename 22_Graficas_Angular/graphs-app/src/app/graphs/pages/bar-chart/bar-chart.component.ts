import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styles: [
    ]
})
export class BarChartComponent {

    @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

    public barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
        // We use these empty structures as placeholders for dynamic theming.
        scales: {
            x: {},
            y: {
                min: 10
            }
        },
        plugins: {
            legend: {
                display: true,
            }
        }
    };
    public barChartType: ChartType = 'bar';

    public barChartData: ChartData<'bar'> = {
        labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
        datasets: [
            { data: [82, 24, 30, 94, 65, 73, 30], label: 'Series 0', backgroundColor: '#EEF739', hoverBackgroundColor: 'white' },
            { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A', backgroundColor: '#E08528', hoverBackgroundColor: 'white' },
            { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B', backgroundColor: '#2D43F8', hoverBackgroundColor: 'white' }
        ]
    };

    // events
    public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
        console.log(event, active);
    }

    public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
        console.log(event, active);
    }

    public randomize(): void {
        for (let i = 0; i <= 3; i++) {
            this.barChartData.datasets[i].data = [
                Math.round(Math.random() * 100),
                Math.round(Math.random() * 100),
                Math.round(Math.random() * 100),
                Math.round(Math.random() * 100),
                Math.round(Math.random() * 100),
                Math.round(Math.random() * 100),
                Math.round(Math.random() * 100)
            ];
            this.chart?.update();
        }
    }
}
