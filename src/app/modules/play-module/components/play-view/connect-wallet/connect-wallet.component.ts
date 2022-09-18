import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Wallet } from '@heavy-duty/wallet-adapter';
import { Observable, Subscription } from 'rxjs';

import { WalletService } from '../../../../../services/wallet.service';

@Component({
    selector: 'connect-wallet',
    templateUrl: './connect-wallet.component.html',
    styleUrls: ['./connect-wallet.component.scss']
})
export class ConnectWalletComponent implements OnInit, OnDestroy {
    @Output() close = new EventEmitter<void>();

    private _isWalletConnected$?: Subscription;
    private _wallets: Wallet[] | undefined;

    get wallets(): Wallet[] | undefined {
        return this._wallets;
    }

    get wallets$(): Observable<Wallet[] | undefined> {
        return this._walletService.wallets$;
    }

    get selectedWallet(): Wallet | null {
        return this._walletService.selectedWallet;
    }

    constructor(private _walletService: WalletService) {
    }

    ngOnInit(): void {
        this._getWallets();
        this._setIsWalletConnected$();
    }

    ngOnDestroy(): void {
        this._clearIsWalletConnected$();
    }

    onSelectWallet(wallet: Wallet) {
        this._walletService.selectWallet(wallet.adapter.name);
    }

    private _getWallets(): void {
        this._walletService.wallets$.subscribe((wallets) => {
            this._wallets = wallets;
        })
    }


    private _setIsWalletConnected$(): void {
        this._isWalletConnected$ = this._walletService.isWalletConnected$.subscribe((isConnected: boolean) => {
            if (isConnected) {
                this.close.emit();
            }
        })
    }

    private _clearIsWalletConnected$(): void {
        if (this._isWalletConnected$) {
            this._isWalletConnected$.unsubscribe();
        }
    }
}
