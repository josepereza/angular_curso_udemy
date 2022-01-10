import { Component } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styles: [` li { cursor: pointer; }`]
})
export class MenuComponent {

    public menu: MenuItem[] = [
        { path: '/graphs/bar-chart', text: 'Diagrama de Barras' },
        { path: '/graphs/double-chart', text: 'Doble Gráfica' },
        { path: '/graphs/doughnut-chart', text: 'Diagrama de Dona' },
        { path: '/graphs/doughnut-chart-http', text: 'Diagrama de Dona - HTTP' },
    ]
}
