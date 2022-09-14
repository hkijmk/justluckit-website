import { Injectable } from '@angular/core';
import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

import { WALLET_TYPE } from '../enums';

@Injectable()
export class WalletService {
    private _selectedWallet?: WALLET_TYPE;

    get selectedWallet(): WALLET_TYPE | undefined {
        return this._selectedWallet;
    }

    constructor(private _connectionStore: ConnectionStore,
                private _walletStore: WalletStore) {
        this._initStoreAndAdapters();
    }

    selectWallet(wallet: WALLET_TYPE): void {
        this._selectedWallet = wallet;
    }

    private _initStoreAndAdapters(): void {
        this._connectionStore.setEndpoint('http://api.devnet.solana.com');
        this._walletStore.setAdapters([
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new LedgerWalletAdapter(),
            new SlopeWalletAdapter(),
        ]);
    }
}
