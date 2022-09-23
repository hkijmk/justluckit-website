import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FrameworkModule } from '../framework-module/framework.module';
import { MyCouponsRoutingModule } from './my-coupons-routing.module';

import { MyCouponsComponent } from './components/my-coupons/my-coupons.component';

@NgModule({
    imports: [
        CommonModule,
        FrameworkModule,
        MyCouponsRoutingModule,
    ],
    declarations: [
        MyCouponsComponent,
    ],
})
export class MyCouponsModule {
}
