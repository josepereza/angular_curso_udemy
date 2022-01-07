import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
    selector: 'app-page1',
    templateUrl: './page1.component.html',
    styles: [
    ]
})
export class Page1Component implements
    OnInit,
    OnChanges,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy {
    
    public name!: string
    public seconds: number = 0
    public timerSubscription!: Subscription

    ngOnInit(): void {
        this.timerSubscription = interval(1000).subscribe( i => this.seconds = i)
    }
    ngOnDestroy(): void {
        this.timerSubscription.unsubscribe()
    }


    constructor() {
        console.log('constructor')
    }
    ngOnChanges(changes: SimpleChanges): void {
        console.log('ngOnChanges')
    }
    ngDoCheck(): void {
        console.log('ngDoCheck')
    }
    ngAfterContentInit(): void {
        console.log('ngAfterContentInit')
    }
    ngAfterContentChecked(): void {
        console.log('ngAfterContentChecked')
    }
    ngAfterViewInit(): void {
        console.log('ngAfterViewInit')
    }
    ngAfterViewChecked(): void {
        console.log('ngAfterViewChecked')
    }

    save = () => {}

}
