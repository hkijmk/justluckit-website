import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonComponent } from './components/button/button.component';
import { ModalComponent } from './components/modal/modal.component';
import { TimeRemainingComponent } from './components/time-remaining/time-remaining.component';

@NgModule({
    declarations: [
        ButtonComponent,
        ModalComponent,
        TimeRemainingComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        ButtonComponent,
        ModalComponent,
        TimeRemainingComponent,
    ]
})
export class FrameworkModule {
}
