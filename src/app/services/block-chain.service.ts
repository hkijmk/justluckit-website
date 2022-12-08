import { Injectable } from '@angular/core';
import { ConnectionStore, Wallet, WalletStore } from '@heavy-duty/wallet-adapter';
import { WalletName } from '@solana/wallet-adapter-base';
import { LedgerWalletAdapter, PhantomWalletAdapter, SlopeWalletAdapter, SolflareWalletAdapter, } from '@solana/wallet-adapter-wallets';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';

import { BLOCK_CHAIN_KEYS } from '../constants';

@Injectable()
export class BlockChainService {
    private _selectedWallet: Wallet | null = null;
    private _wallets?: Wallet[];
    private _walletPublicKey: PublicKey | null = null;
    private _walletPublicKeySubject = new BehaviorSubject<PublicKey | null>(null);
    private _connection?: Connection;

    get walletPublicKey(): PublicKey | null {
        return this._walletPublicKey;
    }

    get walletPublicKey$(): Observable<PublicKey | null> {
        return this._walletPublicKeySubject.asObservable();
    }

    get isWalletConnected$(): Observable<boolean> {
        return this._walletStore.connected$;
    }

    get isWalletReady$(): Observable<Wallet | null> {
        return this._walletStore.wallet$;
    }

    get selectedWallet(): Wallet | null {
        return this._selectedWallet;
    }

    get connection(): Connection {
        return this._connection!;
    }

    get hostKey(): PublicKey {
        const hostKeyIndex = Math.round(Math.random() * 10);
        return BLOCK_CHAIN_KEYS.hosts[hostKeyIndex];
    }

    constructor(private _connectionStore: ConnectionStore,
                private _walletStore: WalletStore) {
        this._initAdapters();
        this._initListeners();
    }

    signTransaction(transaction: Transaction): Observable<Transaction> {
        return this._walletStore.signTransaction(transaction)!;
    }

    selectWallet(walletName: WalletName): void {
        this._walletStore.selectWallet(walletName);
    }

    getWallets(): Observable<Wallet[]> {
        if (this._wallets !== undefined) {
            return of(this._wallets);
        }

        return this._walletStore.wallets$.pipe(
            tap((wallets) => this._wallets = wallets)
        );
    }

    disconnectWallet(): Observable<void> {
        return this._walletStore.disconnect().pipe(
            map(() => undefined)
        );
    }

    async setConnection(): Promise<void> {
        this._connection = new Connection('https://magical-multi-mansion.solana-mainnet.discover.quiknode.pro/172e18dadc3cbf6fa6ce8a567354861a8f1c4c9e/', "confirmed");
        // this._connectionStore.setEndpoint('https://api.mainnet-beta.solana.com');
        // this._connection = (await firstValueFrom(this._connectionStore.connection$))!;
    }

    private _initAdapters(): void {
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

    private _initListeners(): void {
        this._walletStore.wallet$.subscribe((selectedWallet) => {
            this._selectedWallet = selectedWallet;
            this._connectToWalletStore();
        });

        this._walletStore.publicKey$.subscribe((publicKey) => {
            this._setPublicKey(publicKey);
        });
    }

    private _setPublicKey(publicKey: PublicKey | null): void {
        this._walletPublicKey = publicKey;
        this._walletPublicKeySubject.next(this._walletPublicKey);
    }
}
