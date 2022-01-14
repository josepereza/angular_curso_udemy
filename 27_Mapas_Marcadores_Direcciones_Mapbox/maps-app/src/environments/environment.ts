// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    tokenMapbox: "pk.eyJ1IjoiY2FybG9zLXBhZXpmIiwiYSI6ImNreTNvNnVtcjAzemUyd21ubmk3c3NpN3AifQ.zVXhWf-evufYvB8_roxkWQ",
    urlGeocoding: `https://api.mapbox.com/geocoding/v5/mapbox.places`,
    urlDirections: `https://api.mapbox.com/directions/v5/mapbox/driving`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
