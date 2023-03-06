import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SafeHtmlPipe } from './pipes/safe-html.pipe';

import { ConnectWalletModalComponent } from './components/connect-wallet-button/connect-wallet-modal/connect-wallet-modal.component';
import { ConnectWalletButtonComponent } from './components/connect-wallet-button/connect-wallet-button.component';
import { LoadingIndicatorIconComponent } from './components/loading-indicator-icon/loading-indicator-icon.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { ActionStepComponent } from './components/action-step/action-step.component';
import { LotteryNumberComponent } from './components/lottery-number/lottery-number.component';
import { LotteryNumbersComponent } from './components/lottery-numbers/lottery-numbers.component';
import { ButtonComponent } from './components/button/button.component';
import { IconComponent } from './components/icon/icon.component';
import { InputComponent } from './components/input/input.component';
import { ModalComponent } from './components/modal/modal.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { TimeRemainingComponent } from './components/time-remaining/time-remaining.component';

@NgModule({
    declarations: [
        AccordionComponent,
        ActionStepComponent,
        ButtonComponent,
        ConnectWalletButtonComponent,
        ConnectWalletModalComponent,
        IconComponent,
        InputComponent,
        LoadingIndicatorIconComponent,
        LotteryNumberComponent,
        LotteryNumbersComponent,
        ModalComponent,
        TimeRemainingComponent,
        SearchInputComponent,
        SafeHtmlPipe,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        ButtonComponent,
        ConnectWalletButtonComponent,
        ConnectWalletModalComponent,
        IconComponent,
        InputComponent,
        LoadingIndicatorIconComponent,
        LotteryNumberComponent,
        LotteryNumbersComponent,
        ModalComponent,
        TimeRemainingComponent,
        SearchInputComponent,
        SafeHtmlPipe,
        ActionStepComponent,
        AccordionComponent,
    ]
})
export class FrameworkModule {
}
