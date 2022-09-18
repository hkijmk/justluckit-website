import { Component, EventEmitter, Output } from '@angular/core';

import { PlayService } from '../../../../services/play.service';

@Component({
    selector: 'confirm-play-lottery-step-2',
    templateUrl: './step-2.component.html',
    styleUrls: ['./step-2.component.scss', '../confirm-play-lottery.component.scss']
})
export class ConfirmPlayLotteryStep2Component {
    @Output() onClose = new EventEmitter();

    get selectedNumbers(): number[] {
        return this._playService.selectedNumbers;
    }

    constructor(private _playService: PlayService) {
    }

    finalize(): void {
        this._playService.clear();
        this.onClose.emit();
    }
}
