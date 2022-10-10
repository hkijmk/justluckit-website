import { Component, OnInit } from '@angular/core';
import { PublicKey } from '@solana/web3.js';
import { deserialize } from 'borsh';

import { AppStateService } from '../../services/app-state.service';
import { BlockChainService } from '../../services/block-chain.service';

import { BLOCK_CHAIN_KEYS } from '../../constants';
import { MainScreenInfoModel, RecordModel } from '../../models';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    private _mainScreenInfo?: MainScreenInfoModel;
    private _isLoading: boolean = false;

    get record(): RecordModel {
        return this._appStateService.record;
    }

    get mainScreenInfo(): MainScreenInfoModel | undefined {
        return this._mainScreenInfo;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    constructor(private _appStateService: AppStateService,
                private _blockChainService: BlockChainService) {
    }

    ngOnInit(): void {
        this._getInfo();
    }

    async _getInfo(): Promise<void> {
        if (this._appStateService.mainScreenInfo !== undefined) {
            this._mainScreenInfo = this._appStateService.mainScreenInfo;
            return;
        }

        this._isLoading = true;

        const mainScreenInfoProgram = await PublicKey.findProgramAddress([
                Buffer.from("interface"),
                Buffer.from((this.record.weekNumber - 1).toString()),
            ],
            BLOCK_CHAIN_KEYS.programId,
        );

        const mainScreenInfoBuffer = await this._blockChainService.connection.getAccountInfo(mainScreenInfoProgram[0]);
        const mainScreenInfo = deserialize(MainScreenInfoModel.getSchema(), MainScreenInfoModel, mainScreenInfoBuffer!.data);

        this._appStateService.initMainScreenInfo(mainScreenInfo);
        this._mainScreenInfo = deserialize(MainScreenInfoModel.getSchema(), MainScreenInfoModel, mainScreenInfoBuffer!.data);

        this._isLoading = false;
    }
}
