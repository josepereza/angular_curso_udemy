import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../interfaces/menu-item.interface';

@Component({
    selector: 'app-sidemenu',
    templateUrl: './sidemenu.component.html',
    styles: [`li { cursor: pointer; }`]
})
export class SidemenuComponent {
    
    public templateMenu: MenuItem[] = [
        { text: 'Básicos', path: './template/basics' },
        { text: 'Dinámicos', path: './template/dynamic' },
        { text: 'Switches', path: './template/switches' }
    ]

    public reactiveMenu: MenuItem[] = [
        { text: 'Básicos', path: './reactive/basics' },
        { text: 'Dinámicos', path: './reactive/dynamic' },
        { text: 'Switches', path: './reactive/switches' }
    ]
}
