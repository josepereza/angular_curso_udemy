import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MapService } from '.';
import { PlacesApiClient } from '../api';
import { Feature, PlacesResponse } from '../interfaces/places-response.interface';

@Injectable({
    providedIn: 'root'
})
export class PlacesService {

    private _baseURL = environment.urlGeocoding
    private _accessToken = environment.tokenMapbox

    public userLocation!: [number, number]
    public isLoadingPlaces: boolean = false
    public places: Feature[] = []

    get isUserLocationReady(): boolean {
        return !!this.userLocation
    }

    constructor(private _placesAPI: PlacesApiClient, private _mapService: MapService) {
        this.getUserLocation()
    }

    getUserLocation = async (): Promise<[number, number]> => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    this.userLocation = [coords.longitude, coords.latitude]
                    resolve(this.userLocation)
                },
                (error) => {
                    alert('No se pudo obtener la Geolocation')
                    console.log(error)
                    reject()
                }
            )
        })
    }

    getPlacesByQuery = (query: string = ''): Observable<Feature[]> | undefined => {
        if (query.trim().length === 0) {
            this.places = []
            this.isLoadingPlaces = false
            return
        }
        if (!this.userLocation) throw new Error('No hay coordenadas del usuario');
        
        this.isLoadingPlaces = true

        const url = `/${query}.json`

        const params = new HttpParams()
            .set('proximity', this.userLocation!.join(','))

        return this._placesAPI.get<PlacesResponse>(url, { params })
            .pipe(map(res => {
                this.isLoadingPlaces = false
                this.places = res.features
                this._mapService.createMarkersFromPlaces(this.places, this.userLocation)
                return this.places
            }))
    }

    deletePlaces = () => {
        this.places = []
    }
}
