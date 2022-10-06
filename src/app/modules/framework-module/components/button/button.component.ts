import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subscription, timer } from 'rxjs';

import { ICON_SVGS } from '../../../../constants';
import { BUTTON_VARIANT } from '../../enums';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ButtonComponent implements OnChanges {
    @Input() variant: BUTTON_VARIANT | string = BUTTON_VARIANT.default;
    @Input() disabled: boolean = false;

    @Input() set isLoading(_: boolean) {
    };

    @Output() onClick = new EventEmitter<MouseEvent>;

    private _isLoading: boolean = false;
    private _timer$?: Subscription;

    ICON_SVGS = ICON_SVGS;

    get isLoading(): boolean {
        return this._isLoading;
    }

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const isLoadingChanges = changes['isLoading'];
        if (isLoadingChanges !== undefined) {
            this._onIsLoadingChange(isLoadingChanges.previousValue, isLoadingChanges.currentValue);
        }
    }

    private _onIsLoadingChange(prevValue: boolean, currentValue: boolean): void {
        if (prevValue && !currentValue) {
            this._setTimer$();
            return;
        }

        if (currentValue) {
            this._isLoading = true;
        }

        this._clearTimer$();
    }

    private _setTimer$(): void {
        this._clearTimer$();
        this._isLoading = true;

        this._timer$ = timer(1000).subscribe(() => {
            this._isLoading = false;
            this._clearTimer$();
        });
    }

    private _clearTimer$(): void {
        this._timer$?.unsubscribe()
    }
}
