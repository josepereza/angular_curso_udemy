import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class GraphsService {

    public endpoint: string = 'http://localhost:3000/graph'

    constructor(private _http: HttpClient) { }

    getUsers = () => this._http.get(this.endpoint)

    getUsersForChart = () => {
        return this.getUsers()
            .pipe(
                delay(2000),
                map(data => {
                    return { labels: Object.keys(data), datasets: [{ data: Object.values(data) }] }
                })
            )
    }
}
