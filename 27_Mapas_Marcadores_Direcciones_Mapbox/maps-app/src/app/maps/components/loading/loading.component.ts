import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styles: [`.loading-map {
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        height: 100vh;
        position: fixed;
        right: 0;
        top: 0;
        width: 100vw;
    }`]
})
export class LoadingComponent { }
