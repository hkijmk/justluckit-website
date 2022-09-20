import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Wallet } from '@heavy-duty/wallet-adapter';
import { Observable, Subscription } from 'rxjs';

import { BlockChainService } from '../../../../../services/block-chain.service';

@Component({
    selector: 'connect-wallet',
    templateUrl: './connect-wallet.component.html',
    styleUrls: ['./connect-wallet.component.scss']
})
export class ConnectWalletComponent implements OnInit, OnDestroy {
    @Output() close = new EventEmitter<void>();

    private _wallets: Wallet[] | undefined;
    private _isWalletConnected$?: Subscription;
    private _isWalletConnected: boolean = false;

    get wallets(): Wallet[] | undefined {
        return this._wallets;
    }

    get wallets$(): Observable<Wallet[] | undefined> {
        return this._blockChainService.wallets$;
    }

    get selectedWallet(): Wallet | null {
        return this._blockChainService.selectedWallet;
    }

    get isWalletConnected(): boolean {
        return this._isWalletConnected;
    }

    constructor(private _blockChainService: BlockChainService) {
    }

    ngOnInit(): void {
        this._setIsWalletConnected$();
        this._getWallets();
    }

    ngOnDestroy(): void {
        this._clearIsWalletConnected$();
    }

    onSelectWallet(wallet: Wallet) {
        this._blockChainService.selectWallet(wallet.adapter.name);
    }

    private _getWallets(): void {
        this._blockChainService.wallets$.subscribe((wallets) => {
            this._wallets = wallets;
        })
    }

    private _setIsWalletConnected$(): void {
        this._clearIsWalletConnected$();

        this._isWalletConnected$ = this._blockChainService.isWalletConnected$.subscribe((isConnected => {
            this._isWalletConnected = isConnected;
        }));
    }

    private _clearIsWalletConnected$(): void {
        if (this._isWalletConnected$ !== undefined) {
            this._isWalletConnected$.unsubscribe();
        }
    }
}
