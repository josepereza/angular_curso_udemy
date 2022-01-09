import { Component } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styles: [` li { cursor: pointer; } `]
})
export class MenuComponent {

    public menuItems: MenuItem[] = [
        { path: '/maps/full-screen', name: 'Full Screen' },
        { path: '/maps/zoom-range', name: 'Zoom Range' },
        { path: '/maps/markers', name: 'Marcadores' },
        { path: '/maps/estate', name: 'Inmuebles' }
    ]

}
