import { Injectable } from "@angular/core";
import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class DirectionsApiClient extends HttpClient {

    private _accessToken = environment.tokenMapbox
    public baseUrl: string = environment.urlDirections

    constructor(handler: HttpHandler) {
        super(handler)
    }

    public override get<T>(url: string) {
        url = this.baseUrl + url

        return super.get<T>(url, { params: { 
            alternatives: false,
            continue_straight: false,
            geometries: 'geojson',
            overview: 'simplified',
            steps: false,
            access_token: this._accessToken
        } })
    }
}