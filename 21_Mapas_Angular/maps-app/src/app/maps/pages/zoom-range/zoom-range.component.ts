import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


@Component({
    selector: 'app-zoom-range',
    templateUrl: './zoom-range.component.html',
    styles: [`
        .row {
            background-color: white;
            z-index: 101;
            position: fixed;
            bottom: 50px;
            left: 50px;
            border-radius: 5px;
            width: 400px;
        }
    `]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

    @ViewChild('map') divMap!: ElementRef
    public map!: mapboxgl.Map
    public zoomLevel: number = 5
    public center: [number, number] = [-73.25, 3.70]


    ngAfterViewInit(): void {
        this.map = new mapboxgl.Map({
            container: this.divMap.nativeElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: this.center,
            zoom: this.zoomLevel
        });

        this.map.on('zoom', () => this.zoomLevel = this.map.getZoom())

        this.map.on('zoomend', () => (this.map.getZoom() > 18) && this.map.zoomTo(18))

        this.map.on('move', (e) => {
            const { lng, lat } = e.target.getCenter()
            this.center = [lng, lat]
        })
    }

    ngOnDestroy(): void {
        this.map.off('zoom', () => {})
        this.map.off('zoomend', () => {})
        this.map.off('move', () => {})
    }

    zoomOut = (): mapboxgl.Map => this.map.zoomOut()

    zoomIn = (): mapboxgl.Map => this.map.zoomIn()

    zoomChange = (value: string): mapboxgl.Map => this.map.zoomTo(Number(value))

}
