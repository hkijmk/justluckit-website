import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ICON_SVGS } from '../../../../constants';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss']
})
export class InputComponent {
    @Input() placeholder?: string;
    @Input() disabled?: boolean;
    @Input() type?: string = 'text';
    @Input() min?: number;
    @Input() max?: number;
    @Input() isClearable?: boolean = false;

    @Input() set value(val: string) {
        this.text = val;
    }

    @Output() onChange = new EventEmitter<string>();

    text: string = '';

    ICON_SVGS = ICON_SVGS;

    constructor() {
    }

    clearText(): void {
        this.text = '';
        this.onChange.emit(this.text);
    }

    onTextChange(event: Event): void {
        this.text = (event.target as HTMLInputElement).value;
        this.onChange.emit(this.text)
    }
}
