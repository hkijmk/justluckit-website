import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BUTTON_VARIANT } from '../../enums';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
    @Input() variant: BUTTON_VARIANT | string = BUTTON_VARIANT.default;
    @Input() disabled: boolean = false;

    @Output() onClick = new EventEmitter<MouseEvent>;

    constructor() {
    }
}
