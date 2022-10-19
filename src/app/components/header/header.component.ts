import { Component, ElementRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    private _isDropdownVisibleOnMobile: boolean = false;
    private _outsideClick$?: Subscription;

    get isDropdownVisibleOnMobile(): boolean {
        return this._isDropdownVisibleOnMobile;
    }

    constructor(private _elementRef: ElementRef) {
    }

    toggleDropdownVisiblity(): void {
        if (this._isDropdownVisibleOnMobile) {
            this.hideDropdown();
        } else {
            this._showDropdown();
        }
    }

    hideDropdown(): void {
        if (this._outsideClick$ !== undefined) {
            this._outsideClick$.unsubscribe();
        }

        this._isDropdownVisibleOnMobile = false;
    }

    private _showDropdown(): void {
        this._outsideClick$ = fromEvent(document.body, 'click').subscribe((event) => {
            if (this._elementRef.nativeElement.contains(event.target)) {
                return;
            }

            this.hideDropdown();
        });

        this._isDropdownVisibleOnMobile = true;
    }
}
