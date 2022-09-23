import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ICON_SVGS, KEYBOARD_KEYS } from '../../../../constants';

@Component({
    selector: 'app-search-input',
    templateUrl: './search-input.component.html',
    styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent {
    @Input() placeholder?: string;

    @Output() onSearch = new EventEmitter<string>();

    searchText: string = '';

    ICON_SVGS = ICON_SVGS;

    constructor() {
    }

    onSearchTextChange(event: Event): void {
        this.searchText = (event.target as HTMLInputElement).value;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key !== KEYBOARD_KEYS.enter) {
            return;
        }

        this.onSearch.emit(this.searchText);
    }
}
