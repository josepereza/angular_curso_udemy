import { Component } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

    private debounceTimer?: NodeJS.Timeout

    constructor(private _placesService: PlacesService) { }

    ngOnInit(): void {
    }

    onQueryChanged = (query: string = '') => {
        if (this.debounceTimer) clearTimeout(this.debounceTimer)
        this.debounceTimer = setTimeout(() => {
            this._placesService.getPlacesByQuery(query)
                ?.subscribe()
        }, 500)
    }
}
