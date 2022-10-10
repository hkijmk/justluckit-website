import { Component, Input } from '@angular/core';

import { LottoGameModel } from '../../../models';

@Component({
    selector: 'coupon-item',
    templateUrl: './coupon-item.component.html',
    styleUrls: ['./coupon-item.component.scss']
})
export class CouponItemComponent {
    @Input() coupon!: LottoGameModel;

    constructor() {
    }
}
