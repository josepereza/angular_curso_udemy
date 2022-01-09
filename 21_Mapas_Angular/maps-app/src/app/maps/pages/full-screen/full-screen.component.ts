import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
    selector: 'app-full-screen',
    templateUrl: './full-screen.component.html',
    styles: [` 
        #map {
            height: 100%;
            width: 100%;
        }
    `]
})
export class FullScreenComponent implements AfterViewInit {

    @ViewChild('map') divMap!: ElementRef

    public map!: mapboxgl.Map

    constructor() { }

    ngAfterViewInit(): void {
        const map = new mapboxgl.Map({
            container: this.divMap.nativeElement, // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [-73.47055905008489, 6.888389210280588], // starting position [lng, lat]
            zoom: 7 // starting zoom
        });
    }

}
