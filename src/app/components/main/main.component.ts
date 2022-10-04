import { Component, OnInit } from '@angular/core';
import { PublicKey } from '@solana/web3.js';
import { deserialize } from 'borsh';
import { firstValueFrom } from 'rxjs';

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

        const connection = (await firstValueFrom(this._blockChainService.connection$))!;

        const recordBuffer = await connection.getAccountInfo(BLOCK_CHAIN_KEYS.record);
        const record = deserialize(RecordModel.getSchema(), RecordModel, recordBuffer!.data);

        const mainScreenInfoProgram = await PublicKey.findProgramAddress([
                Buffer.from("interface"),
                Buffer.from((record.weekNumber - 1).toString()),
            ],
            BLOCK_CHAIN_KEYS.programId,
        );

        const mainScreenInfoBuffer = await connection.getAccountInfo(mainScreenInfoProgram[0]);
        this._mainScreenInfo = deserialize(MainScreenInfoModel.getSchema(), MainScreenInfoModel, mainScreenInfoBuffer!.data);

        this._isLoading = false;
    }
}
