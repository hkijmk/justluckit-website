import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HdWalletAdapterModule } from '@heavy-duty/wallet-adapter';

import { FrameworkModule } from './modules/framework-module/framework.module';
import { AppRoutingModule } from './app-routing.module';

import { AppStateService } from './services/app-state.service';
import { BroadcastService } from './services/broadcast.service';
import { BlockChainService } from './services/block-chain.service';

import { ControlStageItemComponent } from './components/main/control-progress/control-stages/control-stage-item/control-stage-item.component';
import { ControlStagesComponent } from './components/main/control-progress/control-stages/control-stages.component';
import { ControlProgressComponent } from './components/main/control-progress/control-progress.component';
import { LastDrawResultsComponent } from './components/main/last-draw-results/last-draw-results.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { WelcomeViewComponent } from './components/main/welcome-view/welcome-view.component';
import { MainComponent } from './components/main/main.component';
import { MyCouponsComponent } from './components/my-coupons/my-coupons.component';
import { CouponItemComponent } from './components/my-coupons/coupon-item/coupon-item.component';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        FooterComponent,
        HeaderComponent,
        ControlProgressComponent,
        ControlStagesComponent,
        ControlStageItemComponent,
        LastDrawResultsComponent,
        MyCouponsComponent,
        CouponItemComponent,
        WelcomeViewComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        BrowserAnimationsModule,
        FrameworkModule,
        HdWalletAdapterModule.forRoot({ autoConnect: true }),
    ],
    providers: [
        AppStateService,
        BroadcastService,
        BlockChainService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
