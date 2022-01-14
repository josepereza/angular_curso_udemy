import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
    selector: 'app-maps-screen',
    templateUrl: './maps-screen.component.html',
    styles: [
    ]
})
export class MapsScreenComponent {

    get isUserLocationReady() {
        return this._placesServices.isUserLocationReady
    }

    constructor(private _placesServices: PlacesService) { }
}
