import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapService, PlacesService } from '../../services';

import { Map, Popup, Marker } from 'mapbox-gl';


@Component({
    selector: 'app-map-view',
    templateUrl: './map-view.component.html',
    styles: [`
        .map-container {
            position: fixed;
            top: 0;
            right: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.8);
        }
    `]
})
export class MapViewComponent implements AfterViewInit {

    @ViewChild('mapDiv') public mapDivElement!: ElementRef<HTMLElement>

    constructor(private _placesService: PlacesService, private _mapService: MapService) { }

    ngAfterViewInit(): void {
        if (!this._placesService.userLocation) throw new Error('No hay coordenadas en el servicio')

        const map = new Map({
            container: this.mapDivElement.nativeElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: this._placesService.userLocation,
            zoom: 12
        });

        const popup = new Popup()
            .setHTML(`
                <h6>Aquí estoy</h6>
                <span>Estoy en este lugar</span>
            `)

        new Marker({
            color: 'red'
        })
            .setLngLat(this._placesService.userLocation)
            .setPopup(popup)
            .addTo(map)

        this._mapService.setMap(map)
    }
}
