import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SafeHtmlPipe } from './pipes/safe-html.pipe';

import { ButtonComponent } from './components/button/button.component';
import { IconComponent } from './components/icon/icon.component';
import { LotteryNumberComponent } from './components/lottery-number/lottery-number.component';
import { LotteryNumbersComponent } from './components/lottery-numbers/lottery-numbers.component';
import { ModalComponent } from './components/modal/modal.component';
import { TimeRemainingComponent } from './components/time-remaining/time-remaining.component';

@NgModule({
    declarations: [
        ButtonComponent,
        IconComponent,
        LotteryNumberComponent,
        LotteryNumbersComponent,
        ModalComponent,
        TimeRemainingComponent,
        SafeHtmlPipe,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        ButtonComponent,
        IconComponent,
        LotteryNumberComponent,
        LotteryNumbersComponent,
        ModalComponent,
        TimeRemainingComponent,
        SafeHtmlPipe,
    ]
})
export class FrameworkModule {
}
