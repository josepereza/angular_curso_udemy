import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
    selector: 'app-mini-map',
    templateUrl: './mini-map.component.html',
    styles: [` div { width: 100%; height: 200px; margin: 0; }`]
})
export class MiniMapComponent implements AfterViewInit {

    @Input() lngLat!: [number, number]
    @ViewChild('map') mapRef!: ElementRef
    public map!: mapboxgl.Map 

    ngAfterViewInit(): void {
        this.map = new mapboxgl.Map({
            container: this.mapRef.nativeElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: this.lngLat,
            zoom: 15,
            interactive: true
        });

        new mapboxgl.Marker()
            .setLngLat(this.lngLat)
            .addTo(this.map)
    }
}
