import { Injectable } from '@angular/core';
import { ConnectionStore, Wallet, WalletStore } from '@heavy-duty/wallet-adapter';
import { WalletName } from '@solana/wallet-adapter-base';
import { BackpackWalletAdapter, LedgerWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter, } from '@solana/wallet-adapter-wallets';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';

import { SnickerDoodleService } from './snicker-doodle.service';

import { BLOCK_CHAIN_KEYS, QUICK_NODES } from '../constants';

@Injectable()
export class BlockChainService {
    private _selectedWallet: Wallet | null = null;
    private _wallets?: Wallet[];
    private _walletPublicKey: PublicKey | null = null;
    private _walletPublicKeySubject = new BehaviorSubject<PublicKey | null>(null);
    private _connection?: Connection;
    private _hostKey: PublicKey = BLOCK_CHAIN_KEYS.hosts[Math.floor(Math.random() * 10)]

    get walletPublicKey(): PublicKey | null {
        return this._walletPublicKey;
    }

    get walletPublicKey$(): Observable<PublicKey | null> {
        return this._walletPublicKeySubject.asObservable();
    }

    get isWalletConnected$(): Observable<boolean> {
        return this._walletStore.connected$;
    }

    get selectedWallet(): Wallet | null {
        return this._selectedWallet;
    }

    get connection(): Connection {
        return this._connection!;
    }

    get hostKey(): PublicKey {
        return this._hostKey;
    }

    set hostKey(value: PublicKey) {
        this._hostKey = value;
    }

    constructor(private _connectionStore: ConnectionStore,
                private _snickerDoodleService: SnickerDoodleService,
                private _walletStore: WalletStore) {
        this._initAdapters();
        this._initListeners();
    }

    signTransaction(transaction: Transaction): Observable<Transaction> {
        return this._walletStore.signTransaction(transaction)!;
    }

    signMessage(message: string): Observable<Uint8Array> | undefined {
        const encodedMessage = new TextEncoder().encode(message);
        return this._walletStore.signMessage(encodedMessage);
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
        const quickNodeIndex = Math.floor(Math.random() * 10);
        this._connection = new Connection(QUICK_NODES[10], 'confirmed');
        // this._connection = new Connection('https://api.mainnet-beta.solana.com', "confirmed");
        // this._connection = (await firstValueFrom(this._connectionStore.connection$))!;
    }

    private _initAdapters(): void {
        this._walletStore.setAdapters([
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new LedgerWalletAdapter(),
            new BackpackWalletAdapter(),
        ]);
    }

    private async _connectToWalletStore(): Promise<void> {
        if (!this._selectedWallet) {
            return;
        }

        this._walletStore.connect().subscribe(
            () => {
            },
            (_) => {
            });
    }

    private _initListeners(): void {
        this._walletStore.wallet$.subscribe(async (selectedWallet) => {
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
