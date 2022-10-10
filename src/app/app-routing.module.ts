import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DrawNowComponent } from './components/draw-now/draw-now.component';
import { MainComponent } from './components/main/main.component';
import { MyCouponsComponent } from './components/my-coupons/my-coupons.component';

const routes: Routes = [
    { path: '', component: MainComponent },
    {
        path: 'play',
        loadChildren: () => import('./modules/play-module/play.module').then(m => m.PlayModule),
    },
    {
        path: 'draw-now',
        component: DrawNowComponent,
    },
    {
        path: 'my-coupons',
        component: MyCouponsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
