import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../services/gifs.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html'
})
export class SearchComponent {

    @ViewChild('txtSearch') txtSearch!: ElementRef<HTMLInputElement>

    constructor(private gifsService: GifsService) { }

    search = (): void => {
        const value = this.txtSearch.nativeElement.value
        if (value.trim().length === 0) return
        this.gifsService.searchGifs(value)
        this.txtSearch.nativeElement.value = ''
    }
}
