import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { deserialize } from 'borsh';
import { Observable } from 'rxjs';

import { AppStateService } from '../../../../../services/app-state.service';
import { BlockChainService } from '../../../../../services/block-chain.service';
import { PlayService } from '../../../services/play.service';

import { BLOCK_CHAIN_KEYS } from '../../../../../constants';
import { MainScreenInfoModel, RecordModel } from '../../../../../models';
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

    get terms(): TermsModel | undefined {
        return this._playService.terms;
    }

    get record(): RecordModel {
        return this._appStateService.record;
    }

    get mainScreenInfo(): MainScreenInfoModel {
        return this._appStateService.mainScreenInfo;
    }

    get isWalletConnected$(): Observable<boolean> {
        return this._blockChainService.isWalletConnected$;
    }

    get isLoadingTerms(): boolean {
        return this._isLoadingTerms;
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
