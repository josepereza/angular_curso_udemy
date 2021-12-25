import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
    providedIn: 'root'
})
export class GifsService {

    private API_KEY: string = 'UMxyzmG7A4NAsIH4vzodoaeu88tZRouC'
    private _record: string[] = []
    private urlBase: string = `https://api.giphy.com/v1/gifs`

    public results: Gif[] = []

    get record() {
        return [...this._record]
    }
    
    constructor(private http: HttpClient) {
        this._record = JSON.parse(localStorage.getItem('record')!) || []
        this.results = JSON.parse(localStorage.getItem('results')!) || []
    }

    searchGifs = (query: string = '') => {
        query = query.trim().toLowerCase()
        if (!this._record.includes(query)) {
            this._record.unshift(query)
            this._record = this._record.splice(0, 10)
            localStorage.setItem('record', JSON.stringify(this._record))
        }

        const params = new HttpParams()
            .set('api_key', this.API_KEY)
            .set('q', query)
            .set('limit', '10')

        this.http.get<SearchGifsResponse>(`${this.urlBase}/search`, { params })
            .subscribe((res) => {
                this.results = res.data
                localStorage.setItem('results', JSON.stringify(this.results))
            })
    }
}
