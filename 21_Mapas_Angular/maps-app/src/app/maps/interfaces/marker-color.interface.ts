import * as mapboxgl from 'mapbox-gl';

export interface MarkerColor {
    color: string;
    marker?: mapboxgl.Marker
    center?: [number, number]
}