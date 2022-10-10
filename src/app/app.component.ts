import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { deserialize } from 'borsh';

import { AppStateService } from './services/app-state.service';
import { BlockChainService } from './services/block-chain.service';

import { BLOCK_CHAIN_KEYS } from './constants';
import { RecordModel } from './models';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild('modal', { read: ViewContainerRef }) private _modalViewRef!: ViewContainerRef;

    private _isLoading: boolean = false;

    get isLoading(): boolean {
        return this._isLoading;
    }

    constructor(private _appStateService: AppStateService,
                private _blockChainService: BlockChainService) {
    }

    async ngOnInit(): Promise<void> {
        this._isLoading = true;

        await this._blockChainService.setConnection();
        await this._initRecord();

        this._isLoading = false;
    }

    private async _initRecord(): Promise<void> {
        const recordBuffer = await this._blockChainService.connection.getAccountInfo(BLOCK_CHAIN_KEYS.record);
        const record = deserialize(RecordModel.getSchema(), RecordModel, recordBuffer!.data);
        this._appStateService.initRecord(record);
    }
}
