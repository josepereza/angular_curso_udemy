import { Component } from '@angular/core';
import { GifsService } from '../../gifs/services/gifs.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

    get record(): string[] {
        return this.gifsService.record
    }

    constructor(private gifsService: GifsService) { }

    search(item: string) {
        this.gifsService.searchGifs(item)
    }
}
