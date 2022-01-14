import { Component, OnInit } from '@angular/core';
import { Feature } from '../../interfaces/places-response.interface';
import { MapService, PlacesService } from '../../services';

@Component({
    selector: 'app-search-results',
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {

    public selectedId: string = ''

    get isLoadingPlaces(): boolean {
        return this._placesService.isLoadingPlaces
    }

    get places(): Feature[] {
        return this._placesService.places
    }

    constructor(private _placesService: PlacesService, private _mapService: MapService) { }

    flyTo = (place: Feature) => {
        this.selectedId = place.id
        const [lng, lat] = place.center
        this._mapService.flyTo([lng, lat])
    }

    getDirections = (place: Feature) => {
        if (!this._placesService.userLocation) throw new Error('No hay coordenadas del usuario')

        this._placesService.deletePlaces()

        const start = this._placesService.userLocation
        const end = place.center as [number, number]
        this._mapService.getRouteBetweenPoints(start, end)
    }
}
