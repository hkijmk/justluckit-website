import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FrameworkModule } from '../framework-module/framework.module';
import { MyCouponsRoutingModule } from './my-coupons-routing.module';

import { CouponItemComponent } from './components/my-coupons/coupon-item/coupon-item.component';
import { MyCouponsComponent } from './components/my-coupons/my-coupons.component';

@NgModule({
    imports: [
        CommonModule,
        FrameworkModule,
        MyCouponsRoutingModule,
    ],
    declarations: [
        CouponItemComponent,
        MyCouponsComponent,
    ],
})
export class MyCouponsModule {
}
