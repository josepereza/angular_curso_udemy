import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'app-bar',
    templateUrl: './bar.component.html',
    styles: [
    ]
})
export class BarComponent implements OnInit {
    
    @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

    @Input() line: boolean = false

    public barChartOptions: ChartConfiguration['options'] = {
        responsive: true,
    };

    public barChartType: ChartType = 'bar';

    @Input('data') barChartData: ChartData = {
        labels: [],
        datasets: []
    }

    ngOnInit(): void {
        this.line && (this.barChartType = 'line')
    }
}
