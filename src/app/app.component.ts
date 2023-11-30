import { Component, OnInit } from '@angular/core';
import { deserialize } from 'borsh';

import { AppStateService } from './services/app-state.service';
import { BlockChainService } from './services/block-chain.service';

import { BLOCK_CHAIN_KEYS, LOCAL_STORAGE_KEYS } from './constants';
import { RecordModel, PoolInfo } from './models';
import { PublicKey } from '@solana/web3.js';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    private _isLoading: boolean = false;

    get isLoading(): boolean {
        return this._isLoading;
    }

    constructor(private _appStateService: AppStateService,
                private _blockChainService: BlockChainService) {
    }

    async ngOnInit(): Promise<void> {
        this._isLoading = true;

        this._initHostKey();
        await this._blockChainService.setConnection();
        await this._initRecord();
        await this._initMainScreenInfo();
        await this._getPoolInfo();

        this._isLoading = false;
    }

    private async _initRecord(): Promise<void> {
        const recordBuffer = await this._blockChainService.connection.getAccountInfo(BLOCK_CHAIN_KEYS.record);
        this._appStateService.record = deserialize(RecordModel.getSchema(), RecordModel, recordBuffer!.data);
    }

    private async _initMainScreenInfo(): Promise<void> {
        const mainScreenInfo = await this._appStateService.getMainScreenInfo(this._blockChainService.connection, this._appStateService.record.weekNumber - 1);
        if (!mainScreenInfo) {
            return;
        }

        this._appStateService.initMainScreenInfo(mainScreenInfo);
    }

    private async _getPoolInfo(): Promise<void> {
        const poolBuffer = await this._blockChainService.connection.getAccountInfo(BLOCK_CHAIN_KEYS.pool);
        if (!poolBuffer) {
            return;
        }

        const poolInfo = deserialize(PoolInfo.getSchema(), PoolInfo, poolBuffer.data);
        this._appStateService.initPoolInfo(poolInfo);
    }

    private _initHostKey(): void {
        const savedHostKeyString = localStorage.getItem(LOCAL_STORAGE_KEYS.hostKeyString);
        if (!savedHostKeyString) {
            return;
        }

        try {
            this._blockChainService.hostKey = new PublicKey(savedHostKeyString);
        } catch (_) {
        }
    }
}
