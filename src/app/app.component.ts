import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { BlockChainService } from './services/block-chain.service';

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

    constructor(private _blockChainService: BlockChainService) {
    }

    ngOnInit(): void {
        this._initBlockChainConnection();
    }

    private async _initBlockChainConnection(): Promise<void> {
        this._isLoading = true;

        await this._blockChainService.setConnection();
        this._isLoading = false;
    }
}
