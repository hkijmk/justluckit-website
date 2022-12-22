import { Component, ElementRef, ViewChild } from '@angular/core';

import { ICON_SVGS } from '../../../../constants';

@Component({
    selector: 'accordion',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent {
    @ViewChild('sizeCaptureEl') set _sizeCaptureEl(el: ElementRef<HTMLDivElement>) {
        this._contentMaxHeight = el.nativeElement.clientHeight;
    }

    private _isExpanded: boolean = false;
    private _contentMaxHeight: number = 0;

    ICON_SVGS = ICON_SVGS;

    get isExpanded(): boolean {
        return this._isExpanded;
    }

    get contentMaxHeight(): number {
        return this._contentMaxHeight;
    }

    constructor() {
    }

    toggleIsExpanded(): void {
        this._isExpanded = !this._isExpanded;
    }
}
