import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FrameworkModule } from '../framework-module/framework.module';
import { PlayRoutingModule } from './play-routing.module';

import { PlayService } from './services/play.service';
import { WalletService } from './services/wallet.service';

import { ConfirmPlayLotteryStep1Component } from './components/play-view/confirm-play-lottery/step-1/step-1.component';
import { ConfirmPlayLotteryStep2Component } from './components/play-view/confirm-play-lottery/step-2/step-2.component';
import { ConfirmPlayLotteryComponent } from './components/play-view/confirm-play-lottery/confirm-play-lottery.component';
import { ConnectWalletComponent } from './components/play-view/connect-wallet/connect-wallet.component';
import { PlayCardComponent } from './components/play-view/play-card/play-card.component';
import { LotteryNumberComponent } from './components/lottery-number/lottery-number.component';
import { PlayViewComponent } from './components/play-view/play-view.component';

@NgModule({
    declarations: [
        ConfirmPlayLotteryComponent,
        ConnectWalletComponent,
        ConfirmPlayLotteryStep1Component,
        ConfirmPlayLotteryStep2Component,
        LotteryNumberComponent,
        PlayCardComponent,
        PlayViewComponent,
    ],
    imports: [
        CommonModule,
        FrameworkModule,
        PlayRoutingModule,
    ],
    providers: [
        PlayService,
        WalletService,
    ],
    bootstrap: [],
    exports: [
        LotteryNumberComponent
    ]
})
export class PlayModule {
}
