import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { BUTTON_VARIANT } from '../../enums';
import { ICON_SVGS } from '../../constants';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ButtonComponent {
    @Input() variant: BUTTON_VARIANT | string = BUTTON_VARIANT.default;
    @Input() disabled: boolean = false;
    @Input() isLoading: boolean = false;

    @Output() onClick = new EventEmitter<MouseEvent>;

    ICON_SVGS = ICON_SVGS;

    constructor() {
    }
}
