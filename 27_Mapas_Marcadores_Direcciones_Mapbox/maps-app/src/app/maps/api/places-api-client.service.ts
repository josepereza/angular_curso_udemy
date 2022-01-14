import { Injectable } from "@angular/core";
import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class PlacesApiClient extends HttpClient {

    private _accessToken = environment.tokenMapbox
    public baseUrl: string = environment.urlGeocoding

    constructor(handler: HttpHandler) {
        super(handler)
    }

    public override get<T>(url: string, options: {
        params?: HttpParams | {
            [params: string]: string | number | boolean | ReadonlyArray<string | number | boolean>
        }
    }) {
        url = this.baseUrl + url

        return super.get<T>(url, { params: { 
            types: 'place,postcode,address',
            language: 'es',
            access_token: this._accessToken,
            ...options.params 
        } })
    }
}