import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './components/main/main.component';
import { FaqComponent } from './components/faq/faq.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { MyCouponsComponent } from './components/my-coupons/my-coupons.component';

const routes: Routes = [
    { path: '', component: MainComponent },
    {
        path: 'play',
        loadChildren: () => import('./modules/play-module/play.module').then(m => m.PlayModule),
    },
    {
        path: 'faq',
        component: FaqComponent,
    },
    {
        path: 'how-it-works',
        component: HowItWorksComponent,
    },
    {
        path: 'my-coupons',
        component: MyCouponsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        initialNavigation: 'enabledBlocking'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
