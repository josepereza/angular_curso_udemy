import { Component, OnInit } from '@angular/core';
import { MapService, PlacesService } from '../../services';

@Component({
    selector: 'app-btn-my-location',
    templateUrl: './btn-my-location.component.html',
    styles: [`
        button {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }
    `]
})
export class BtnMyLocationComponent {

    constructor(private _mapService: MapService, private _placesService: PlacesService) { }

    goToMyLocation = () => {
        if (!this._placesService.isUserLocationReady) throw new Error('No hay ubicación de usuario')        
        if (!this._mapService.isMapReady) throw new Error('No se ha inicializado el mapa')        

        this._mapService.flyTo(this._placesService.userLocation!)
    }
}
