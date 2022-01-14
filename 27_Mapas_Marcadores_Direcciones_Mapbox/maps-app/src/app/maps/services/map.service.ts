import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places-response.interface';
import { DirectionsApiClient } from '../api';
import { DirectionsResponse, Route } from '../interfaces/directions-response.interface';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MapService {

    private _map?: Map
    private _markers: Marker[] = []

    get isMapReady(): boolean {
        return !!this._map
    }

    constructor(private _directionsAPI: DirectionsApiClient) { }

    setMap(map: Map) {
        this._map = map
    }

    flyTo = (coords: LngLatLike) => {
        if (!this.isMapReady) throw new Error('El mapa no esta inicializado');
        this._map?.flyTo({
            zoom: 14,
            center: coords
        })
    }

    createMarkersFromPlaces = (places: Feature[], userLocation: [number, number]) => {
        if (!this._map) throw new Error('Mapa no inicializado')
        if (places.length === 0) return

        this._markers.forEach(marker => marker.remove())
        const newMarkers = []

        for (const place of places) {
            const [lng, lat] = place.center as [number, number]
            const popup = new Popup()
                .setHTML(`
                    <h6>${place.text_es}</h6>
                    <span>${place.place_name}</span>
                `)
            const newMarker = new Marker()
                .setLngLat([lng, lat])
                .setPopup(popup)
                .addTo(this._map)

            newMarkers.push(newMarker)
        }
        this._markers = newMarkers

        const bounds = new LngLatBounds()
        newMarkers.forEach(marker => bounds.extend(marker.getLngLat()))
        bounds.extend(userLocation)
        this._map.fitBounds(bounds, {
            padding: 100
        })
    }

    getRouteBetweenPoints = (start: [number, number], end: [number, number]) => {
        const url = `/${start.join(',')};${end.join(',')}`

        this._directionsAPI.get<DirectionsResponse>(url)
            .subscribe(res => this._drawPolyline(res.routes[0]))
    }

    private _drawPolyline = (route: Route) => {
        console.log({ distance: route.distance / 1000 })
        console.log({ duration: route.duration / 60 })

        if (!this._map) throw new Error('No hay un mapa instanciado')

        const coords = route.geometry.coordinates

        const bounds = new LngLatBounds()
        coords.forEach(([lng, lat]) => bounds.extend([lng, lat]))
        this._map.fitBounds(bounds, {
            padding: 100
        })

        const sourceData: AnySourceData = {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: coords
                        }
                    }
                ]
            }
        }

        if (this._map.getLayer('RouteString')) {
            this._map.removeLayer('RouteString')
            this._map.removeSource('RouteString')
        }

        this._map.addSource('RouteString', sourceData)
        this._map.addLayer({
            id: 'RouteString',
            type: 'line',
            source: 'RouteString',
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': 'black',
                'line-width': 3
            }
        })
    }
}
