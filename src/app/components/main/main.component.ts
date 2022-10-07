import { Component, OnInit } from '@angular/core';
import { PublicKey } from '@solana/web3.js';
import { deserialize } from 'borsh';

import { BlockChainService } from '../../services/block-chain.service';

import { BLOCK_CHAIN_KEYS } from '../../constants';
import { MainScreenInfoModel, RecordModel } from '../../models';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    private _record?: RecordModel;
    private _mainScreenInfo?: MainScreenInfoModel;
    private _isLoading: boolean = false;

    get record(): RecordModel | undefined {
        return this._record;
    }

    get mainScreenInfo(): MainScreenInfoModel | undefined {
        return this._mainScreenInfo;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    constructor(private _blockChainService: BlockChainService) {
    }

    ngOnInit(): void {
        this._getInfo();
    }

    async _getInfo(): Promise<void> {
        this._isLoading = true;

        const recordBuffer = await this._blockChainService.connection.getAccountInfo(BLOCK_CHAIN_KEYS.record);
        this._record = deserialize(RecordModel.getSchema(), RecordModel, recordBuffer!.data);

        const mainScreenInfoProgram = await PublicKey.findProgramAddress([
                Buffer.from("interface"),
                Buffer.from((this._record.weekNumber - 1).toString()),
            ],
            BLOCK_CHAIN_KEYS.programId,
        );

        const mainScreenInfoBuffer = await this._blockChainService.connection.getAccountInfo(mainScreenInfoProgram[0]);
        this._mainScreenInfo = deserialize(MainScreenInfoModel.getSchema(), MainScreenInfoModel, mainScreenInfoBuffer!.data);

        this._isLoading = false;
    }
}
