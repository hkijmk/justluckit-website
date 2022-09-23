import { Component } from '@angular/core';

import { ICON_SVGS } from '../../../../constants';

@Component({
    selector: 'my-coupons',
    templateUrl: './my-coupons.component.html',
    styleUrls: ['./my-coupons.component.scss']
})
export class MyCouponsComponent {
    private _isLoading: boolean = false;

    get isLoading(): boolean {
        return this._isLoading;
    }

    ICON_SVGS = ICON_SVGS;

    constructor() {
    }

    searchCouponByCode(couponCode: string): void {
        this._isLoading = true;
        console.log(couponCode);

        setTimeout(() => {
            this._isLoading = false;
        }, 2000);
    }
}
