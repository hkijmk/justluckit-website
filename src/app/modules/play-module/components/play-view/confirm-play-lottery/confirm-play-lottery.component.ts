import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'confirm-play-lottery',
    templateUrl: './confirm-play-lottery.component.html',
    styleUrls: ['./confirm-play-lottery.component.scss']
})
export class ConfirmPlayLotteryComponent {
    @Output() close = new EventEmitter<void>();

    isConfirmed: boolean = false;

    constructor() {
    }
}
