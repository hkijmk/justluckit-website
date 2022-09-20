import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HdWalletAdapterModule } from '@heavy-duty/wallet-adapter';

import { FrameworkModule } from './modules/framework-module/framework.module';
import { AppRoutingModule } from './app-routing.module';

import { BroadcastService } from './services/broadcast.service';
import { BlockChainService } from './services/block-chain.service';

import { ControlStageItemComponent } from './components/main/control-progress/control-stages/control-stage-item/control-stage-item.component';
import { ControlStagesComponent } from './components/main/control-progress/control-stages/control-stages.component';
import { ControlProgressComponent } from './components/main/control-progress/control-progress.component';
import { LastDrawResultsComponent } from './components/main/last-draw-results/last-draw-results.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { NextDrawComponent } from './components/main/next-draw/next-draw.component';
import { WelcomeViewComponent } from './components/main/welcome-view/welcome-view.component';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        HeaderComponent,
        WelcomeViewComponent,
        ControlProgressComponent,
        ControlStagesComponent,
        ControlStageItemComponent,
        LastDrawResultsComponent,
        NextDrawComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        FrameworkModule,
        HdWalletAdapterModule.forRoot({ autoConnect: true }),
    ],
    providers: [
        BroadcastService,
        BlockChainService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
