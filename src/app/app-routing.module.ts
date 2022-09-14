import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './components/main/main.component';

const routes: Routes = [
    { path: '', component: MainComponent },
    {
        path: 'play',
        loadChildren: () => import('./modules/play-module/play.module').then(m => m.PlayModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
