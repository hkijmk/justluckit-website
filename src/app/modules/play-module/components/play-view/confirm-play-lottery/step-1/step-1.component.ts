import { Component, EventEmitter, Output } from '@angular/core';

import { PlayService } from '../../../../services/play.service';

@Component({
    selector: 'confirm-play-lottery-step-1',
    templateUrl: './step-1.component.html',
    styleUrls: ['./step-1.component.scss']
})
export class ConfirmPlayLotteryStep1Component {
    @Output() onConfirm = new EventEmitter<void>();
    @Output() onCancel = new EventEmitter<void>();

    get selectedNumbers(): number[] {
        return this._playService.selectedNumbers;
    }

    constructor(private _playService: PlayService) {
    }
}
