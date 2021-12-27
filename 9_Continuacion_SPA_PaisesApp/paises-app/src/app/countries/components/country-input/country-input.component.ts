import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

@Component({
    selector: 'app-country-input',
    templateUrl: './country-input.component.html',
    styles: [
    ]
})
export class CountryInputComponent implements OnInit {

    @Input() placeholder: string = ''
    @Output() onEnter: EventEmitter<string> = new EventEmitter<string>()
    @Output() onDebounce: EventEmitter<string> = new EventEmitter()

    public term: string = ''
    public debouncer: Subject<string> = new Subject()

    ngOnInit(): void {
        this.debouncer
            .pipe(debounceTime(300))
            .subscribe(() => this.onDebounce.emit(this.term))
    }

    search = () => this.onEnter.emit(this.term)

    keyPressed = () => {
        this.debouncer.next(this.term)
    }
}
