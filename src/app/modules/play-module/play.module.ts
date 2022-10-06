import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FrameworkModule } from '../framework-module/framework.module';
import { PlayRoutingModule } from './play-routing.module';

import { PlayService } from './services/play.service';

import { ConfirmPlayLotteryStep1Component } from './components/play-view/confirm-play-lottery/step-1/step-1.component';
import { ConfirmPlayLotteryStep2Component } from './components/play-view/confirm-play-lottery/step-2/step-2.component';
import { ConfirmPlayLotteryComponent } from './components/play-view/confirm-play-lottery/confirm-play-lottery.component';
import { PlayCardComponent } from './components/play-view/play-card/play-card.component';
import { PlayViewComponent } from './components/play-view/play-view.component';

@NgModule({
    declarations: [
        ConfirmPlayLotteryComponent,
        ConfirmPlayLotteryStep1Component,
        ConfirmPlayLotteryStep2Component,
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
    ],
    bootstrap: [],
})
export class PlayModule {
}
