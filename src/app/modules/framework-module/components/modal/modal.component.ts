import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [   // :enter is alias to 'void => *'
                style({ opacity: 0, transform: 'scale(0.5)' }),
                animate(250, style({ opacity: 1, transform: 'scale(1)' }))
            ]),
            transition(':leave', [   // :leave is alias to '* => void'
                animate(250, style({ opacity: 0, transform: 'scale(0.5)' }))
            ])
        ])
    ],
})
export class ModalComponent {
    @HostBinding('@fadeInOut') _anim = true;

    constructor() {
    }
}
