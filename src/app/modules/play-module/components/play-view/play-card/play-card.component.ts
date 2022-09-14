import { Component, EventEmitter, Output } from '@angular/core';

import { PlayService } from '../../../services/play.service';
import { WalletService } from '../../../services/wallet.service';
import { WALLET_TYPE } from '../../../enums';

@Component({
    selector: 'play-card',
    templateUrl: './play-card.component.html',
    styleUrls: ['./play-card.component.scss']
})
export class PlayCardComponent {
    @Output() showConnectWalletModal = new EventEmitter<void>();
    @Output() showConfirmPlayLotteryModal = new EventEmitter<void>();

    numbersList: number[];

    get selectedNumbers(): number[] {
        return this._playService.selectedNumbers;
    }

    get totalPrice(): number {
        return this._playService.totalPrice;
    }

    get selectedWallet(): WALLET_TYPE | undefined {
        return this._walletService.selectedWallet;
    }

    constructor(private _playService: PlayService,
                private _walletService: WalletService) {
        this.numbersList = Array.from(Array(49)).map((_, i) => i + 1);
    }

    isNumberSelected(selectedNumber: number): boolean {
        return this._playService.isNumberSelected(selectedNumber);
    }

    onSelectNumber(selectedNumber: number): void {
        this._playService.toggleSelectedNumber(selectedNumber);
    }
}
