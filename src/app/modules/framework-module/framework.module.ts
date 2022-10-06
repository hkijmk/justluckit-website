import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SafeHtmlPipe } from './pipes/safe-html.pipe';

import { ConnectWalletModalComponent } from './components/connect-wallet-button/connect-wallet-modal/connect-wallet-modal.component';
import { ConnectWalletButtonComponent } from './components/connect-wallet-button/connect-wallet-button.component';
import { LoadingIndicatorIconComponent } from './components/loading-indicator-icon/loading-indicator-icon.component';
import { LotteryNumberComponent } from './components/lottery-number/lottery-number.component';
import { LotteryNumbersComponent } from './components/lottery-numbers/lottery-numbers.component';
import { ButtonComponent } from './components/button/button.component';
import { IconComponent } from './components/icon/icon.component';
import { ModalComponent } from './components/modal/modal.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { TimeRemainingComponent } from './components/time-remaining/time-remaining.component';

@NgModule({
    declarations: [
        ButtonComponent,
        ConnectWalletButtonComponent,
        ConnectWalletModalComponent,
        IconComponent,
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
        LoadingIndicatorIconComponent,
        LotteryNumberComponent,
        LotteryNumbersComponent,
        ModalComponent,
        TimeRemainingComponent,
        SearchInputComponent,
        SafeHtmlPipe,
    ]
})
export class FrameworkModule {
}
