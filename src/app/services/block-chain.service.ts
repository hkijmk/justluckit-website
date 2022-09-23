import { Injectable } from '@angular/core';
import { ConnectionStore, Wallet, WalletStore } from '@heavy-duty/wallet-adapter';
import { WalletName } from '@solana/wallet-adapter-base';
import { LedgerWalletAdapter, PhantomWalletAdapter, SlopeWalletAdapter, SolflareWalletAdapter, } from '@solana/wallet-adapter-wallets';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Observable } from 'rxjs';

@Injectable()
export class BlockChainService {
    private _selectedWallet: Wallet | null = null;

    get isWalletConnected$(): Observable<boolean> {
        return this._walletStore.connected$;
    }

    get connection$(): Observable<Connection | null> {
        return this._connectionStore.connection$;
    }

    get isWalletReady$(): Observable<Wallet | null> {
        return this._walletStore.wallet$;
    }

    get publicKey$(): Observable<PublicKey | null> {
        return this._walletStore.publicKey$;
    }

    get wallets$(): Observable<Wallet[]> {
        return this._walletStore.wallets$;
    }

    get selectedWallet(): Wallet | null {
        return this._selectedWallet;
    }

    constructor(private _connectionStore: ConnectionStore,
                private _walletStore: WalletStore) {
        this._initStoreAndAdapters();

        this._walletStore.wallet$.subscribe((selectedWallet) => {
            this._selectedWallet = selectedWallet;
            this._connectToWalletStore();
        });
    }

    signTransaction(transaction: Transaction): Observable<Transaction> {
        return this._walletStore.signTransaction(transaction)!;
    }

    selectWallet(walletName: WalletName): void {
        this._walletStore.selectWallet(walletName);
    }

    private _initStoreAndAdapters(): void {
        this._connectionStore.setEndpoint('https://api.testnet.solana.com');
        this._walletStore.setAdapters([
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new LedgerWalletAdapter(),
            new SlopeWalletAdapter(),
        ]);
    }

    private async _connectToWalletStore(): Promise<void> {
        if (!this._selectedWallet) {
            return;
        }

        this._walletStore.connect().subscribe(
            () => {
            },
            (error) => {
                if (error.name === 'WalletNotReadyError') {

                }
            });
    }
}
