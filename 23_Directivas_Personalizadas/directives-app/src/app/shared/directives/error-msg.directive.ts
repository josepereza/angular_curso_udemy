import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';


@Directive({
    selector: '[error-msg]'
})
export class ErrorMsgDirective implements OnInit {

    private _htmlElement: ElementRef<HTMLElement>

    private _color: string = 'red'
    private _msg: string = 'Campo Invalido'
    private _invalid: boolean = true


    @Input() set color(color: string) {
        this._color = color
        this.setColor()
    }

    @Input() set message(msg: string) {
        this._msg = msg
        this.setTextContent()
    }

    @Input() set invalid(valid: boolean) {
        this._invalid = valid
        this.setValid()
    }


    constructor(private _el: ElementRef<HTMLElement>) { 
        this._htmlElement = _el
    }
    

    ngOnInit(): void {
        this.setClassStyle()
        this.setColor()
        this.setTextContent()
        this.setValid()
    }

    setClassStyle = (): void => this._htmlElement.nativeElement.classList.add('form-text')

    setColor = (): string => this._htmlElement.nativeElement.style.color = this._color

    setTextContent = (): string => this._htmlElement.nativeElement.textContent = this._msg

    setValid = (): boolean => this._htmlElement.nativeElement.hidden = !this._invalid
}
