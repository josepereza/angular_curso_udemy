import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[customIf]'
})
export class CustomIfDirective {

    @Input() set customIf(condition: boolean) {
        if (condition) {
            this._viewContainer.createEmbeddedView(this._templateRef)
        } else {
            this._viewContainer.clear()
        }
    }

    constructor(private _templateRef: TemplateRef<HTMLElement>, private _viewContainer: ViewContainerRef) { }
}
