import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Wallet } from '@heavy-duty/wallet-adapter';
import { firstValueFrom, Subscription } from 'rxjs';

import { BlockChainService } from '../../../../../services/block-chain.service';

@Component({
    selector: 'connect-wallet-modal',
    templateUrl: './connect-wallet-modal.component.html',
    styleUrls: ['./connect-wallet-modal.component.scss']
})
export class ConnectWalletModalComponent implements OnInit, OnDestroy {
    @Output() close = new EventEmitter<void>();

    private _wallets: Wallet[] | undefined;
    private _isWalletConnected$?: Subscription;
    private _isWalletConnected: boolean = false;
    private _isDisconnecting: boolean = false;
    private _isAirDropping: boolean = false;

    get wallets(): Wallet[] | undefined {
        return this._wallets;
    }

    get selectedWallet(): Wallet | null {
        return this._blockChainService.selectedWallet;
    }

    get isWalletConnected(): boolean {
        return this._isWalletConnected;
    }

    get isDisconnecting(): boolean {
        return this._isDisconnecting;
    }

    get isAirDropping(): boolean {
        return this._isAirDropping;
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

    onSelectWallet(wallet: Wallet): void {
        this._blockChainService.selectWallet(wallet.adapter.name);
    }

    async onAirDrop(): Promise<void> {
        this._isAirDropping = true;

        const airDrop = await this._blockChainService.connection.requestAirdrop(this._blockChainService.walletPublicKey!, 1000000000);
        await this._blockChainService.connection.confirmTransaction(airDrop);

        this._isAirDropping = false;
    }

    async onDisconnect(): Promise<void> {
        this._isDisconnecting = true;

        await firstValueFrom(this._blockChainService.disconnectWallet());
        this._isDisconnecting = false;
    }

    private _getWallets(): void {
        this._blockChainService.getWallets().subscribe((wallets) => {
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
        this._isWalletConnected$?.unsubscribe();
    }
}
