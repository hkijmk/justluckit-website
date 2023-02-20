import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { deserialize } from 'borsh';
import { Observable } from 'rxjs';

import { AppStateService } from '../../../../../services/app-state.service';
import { BlockChainService } from '../../../../../services/block-chain.service';
import { PlayService } from '../../../services/play.service';

import { BLOCK_CHAIN_KEYS } from '../../../../../constants';
import { RecordModel } from '../../../../../models';
import { TermsModel } from '../../../models';

@Component({
    selector: 'play-card',
    templateUrl: './play-card.component.html',
    styleUrls: ['./play-card.component.scss']
})
export class PlayCardComponent implements OnInit {
    @Output() showConfirmPlayLotteryModal = new EventEmitter<void>();

    private _isLoadingTerms: boolean = false;

    numbersList: number[];

    get selectedNumbers(): number[] {
        return this._playService.selectedNumbers;
    }

    get record(): RecordModel {
        return this._appStateService.record;
    }

    get isWalletConnected$(): Observable<boolean> {
        return this._blockChainService.isWalletConnected$;
    }

    get isLoadingTerms(): boolean {
        return this._isLoadingTerms;
    }

    get totalDeposit(): number {
        if (!this._playService.terms) {
            return 0;
        }

        return this._playService.terms.deposit;
    }

    get totalDepositInUsd(): string {
        if (!this._playService.terms || !this._appStateService.poolInfo) {
            return '0';
        }

        return (this._playService.terms.deposit * this._appStateService.poolInfo.solToUsd).toFixed(2);
    }

    get totalPrice(): number {
        if (!this._playService.terms) {
            return 0;
        }

        return this._playService.terms.totalPrice;
    }

    get totalPriceInUsd(): string {
        if (!this._playService.terms || !this._appStateService.poolInfo) {
            return '0';
        }

        return (this._playService.terms.totalPrice * this._appStateService.poolInfo.solToUsd).toFixed(2);
    }

    constructor(private _appStateService: AppStateService,
                private _playService: PlayService,
                private _blockChainService: BlockChainService) {
        this.numbersList = Array.from(Array(49)).map((_, i) => i + 1);
    }

    ngOnInit(): void {
        this._getTerms();
    }

    isNumberSelected(selectedNumber: number): boolean {
        return this._playService.isNumberSelected(selectedNumber);
    }

    onSelectNumber(selectedNumber: number): void {
        this._playService.toggleSelectedNumber(selectedNumber);
    }

    private async _getTerms(): Promise<void> {
        this._isLoadingTerms = true;

        const termsBuffer = await this._blockChainService.connection.getAccountInfo(BLOCK_CHAIN_KEYS.term);
        this._playService.terms = deserialize(TermsModel.getSchema(), TermsModel, termsBuffer!.data);

        this._isLoadingTerms = false;
    }
}
