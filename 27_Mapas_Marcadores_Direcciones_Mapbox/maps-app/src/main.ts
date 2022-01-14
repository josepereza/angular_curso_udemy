import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import mapboxgl from 'mapbox-gl' 


mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9zLXBhZXpmIiwiYSI6ImNreTNvNnVtcjAzemUyd21ubmk3c3NpN3AifQ.zVXhWf-evufYvB8_roxkWQ'


if (!navigator.geolocation) {
    alert('Navegador no soporta la geolocalización')
    throw new Error('Navegador no soporta la geolocalización')
}


if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
