import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PlayViewComponent } from './components/play-view/play-view.component';

const routes: Routes = [
    { path: '', component: PlayViewComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class PlayRoutingModule {
}
