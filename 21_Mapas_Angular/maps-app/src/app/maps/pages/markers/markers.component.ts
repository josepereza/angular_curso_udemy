import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MarkerColor } from '../../interfaces/marker-color.interface';

@Component({
    selector: 'app-markers',
    templateUrl: './markers.component.html',
    styles: [`
        .list-group {
            position: fixed;
            right: 20px;
            top: 20px;
            z-index: 101;
        }

        li {
            cursor: pointer;
        }
    `]
})
export class MarkersComponent implements AfterViewInit {

    @ViewChild('map') divMap!: ElementRef
    public map!: mapboxgl.Map
    public zoomLevel: number = 5
    public center: [number, number] = [-73.25, 3.70]

    public markers: MarkerColor[] = []


    ngAfterViewInit(): void {
        this.map = new mapboxgl.Map({
            container: this.divMap.nativeElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: this.center,
            zoom: this.zoomLevel
        });

        this.readLocalStorage()
    }


    addMarker = () => {
        const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16))

        const marker = new mapboxgl.Marker({
            draggable: true,
            color
        })
            .setLngLat(this.center)
            .addTo(this.map)

        this.markers.push({ color, marker })

        this.saveMarkersLocalStorage()

        marker.on('dragend', () => {
            this.saveMarkersLocalStorage()
        })
    }


    goToMarker = (marker: mapboxgl.Marker) => {
        this.map.flyTo({
            center: marker.getLngLat()
        })
    }


    saveMarkersLocalStorage = () => {
        const lngLatArr: MarkerColor[] = []
        this.markers.forEach(m => {
            const color = m.color
            const { lng, lat } = m.marker!.getLngLat()
            lngLatArr.push({
                color: color,
                center: [lng, lat]
            })
        })
        localStorage.setItem('markers', JSON.stringify(lngLatArr))
    }


    readLocalStorage = () => {
        if (!localStorage.getItem('markers')) return
        const lngLatArr: MarkerColor[] = JSON.parse(localStorage.getItem('markers')!)
        lngLatArr.forEach(m => {
            const newMarker = new mapboxgl.Marker({
                color: m.color,
                draggable: true,
            })
                .setLngLat(m.center!)
                .addTo(this.map)

            this.markers.push({
                marker: newMarker,
                color: m.color
            })
            
            newMarker.on('dragend', () => {
                this.saveMarkersLocalStorage()
            })
        })
    }


    deleteMarker = (index: number) => {
        this.markers[index].marker?.remove()
        this.markers.splice(index, 1)
        this.saveMarkersLocalStorage()
    }
}
