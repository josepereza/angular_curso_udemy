import { Component, OnInit } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { GraphsService } from '../../services/graphs.service';


@Component({
    selector: 'app-doughnut-chart-http',
    templateUrl: './doughnut-chart-http.component.html',
    styles: [
    ]
})
export class DoughnutChartHttpComponent implements OnInit {

    public doughnutChartType: ChartType = 'doughnut';

    public doughnutChartData: ChartData<'doughnut'> = {
        labels: [],
        datasets: []
    };

    constructor(private _gs: GraphsService) { }

    ngOnInit() {
        // this._gs.getUsers().subscribe(data => {
        //     this.doughnutChartData.labels = Object.keys(data)
        //     this.doughnutChartData.datasets.push({ data: Object.values(data) })
        // })
        this._gs.getUsersForChart().subscribe(data => this.doughnutChartData = data)
    }
}
