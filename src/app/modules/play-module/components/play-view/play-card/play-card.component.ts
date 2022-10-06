import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { BlockChainService } from '../../../../../services/block-chain.service';
import { PlayService } from '../../../services/play.service';

@Component({
    selector: 'play-card',
    templateUrl: './play-card.component.html',
    styleUrls: ['./play-card.component.scss']
})
export class PlayCardComponent {
    @Output() showConfirmPlayLotteryModal = new EventEmitter<void>();

    numbersList: number[];

    get selectedNumbers(): number[] {
        return this._playService.selectedNumbers;
    }

    get totalPrice(): number {
        return this._playService.totalPrice;
    }

    get isWalletConnected$(): Observable<boolean> {
        return this._blockChainService.isWalletConnected$;
    }

    constructor(private _playService: PlayService,
                private _blockChainService: BlockChainService) {
        this.numbersList = Array.from(Array(49)).map((_, i) => i + 1);
    }

    isNumberSelected(selectedNumber: number): boolean {
        return this._playService.isNumberSelected(selectedNumber);
    }

    onSelectNumber(selectedNumber: number): void {
        this._playService.toggleSelectedNumber(selectedNumber);
    }

}
