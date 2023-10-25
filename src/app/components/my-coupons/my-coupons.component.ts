import { Component, OnDestroy, OnInit } from '@angular/core';
import { decode, encode } from '@faustbrian/node-base58';
import { PublicKey } from '@solana/web3.js';
import { deserialize } from 'borsh';
import { BehaviorSubject, debounceTime, Subscription } from 'rxjs';

import { BlockChainService } from '../../services/block-chain.service';

import { BLOCK_CHAIN_KEYS } from '../../constants';
import { LottoGameModel } from '../../models';

@Component({
    selector: 'my-coupons',
    templateUrl: './my-coupons.component.html',
    styleUrls: ['./my-coupons.component.scss']
})
export class MyCouponsComponent implements OnInit, OnDestroy {
    private _allCoupons?: LottoGameModel[];
    private _searchedCoupon?: LottoGameModel;
    private _walletPublicKeyChanged$?: Subscription;
    private _searchTextDebounce = new BehaviorSubject<string>('');
    private _searchTextListener?: Subscription;
    private _isLoading: boolean = false;

    get searchText(): string {
        return this._searchTextDebounce.value;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    get allCoupons(): LottoGameModel[] | undefined {
        return this._allCoupons;
    }

    get searchedCoupon(): LottoGameModel | undefined {
        return this._searchedCoupon;
    }

    get walletPublicKey(): PublicKey | null {
        return this._blockChainService.walletPublicKey;
    }

    constructor(private _blockChainService: BlockChainService) {
    }

    ngOnInit(): void {
        this._getAllMyCoupons();
        this._setWalletPublicKeyChanged$();
        this._setSearchTextListener();
    }

    ngOnDestroy(): void {
        this._clearPublicKeyChanged();
        this._clearSearchTextListener();
    }

    onSearchTextChange(value: string): void {
        const searchText = value.trim();
        this._searchedCoupon = undefined;
        this._searchTextDebounce.next(searchText);
        if (searchText !== '') {
            this._isLoading = true
        }
    }

    async searchByCouponByCode(searchText: string): Promise<void> {
        if (!searchText) {
            this._isLoading = false;
            return;
        }

        try {
            const seed = decode(searchText);
            const playerAddress = await PublicKey.findProgramAddress([Buffer.from("L"), Buffer.from(seed)], BLOCK_CHAIN_KEYS.programId);
            const playerBuffer = await this._blockChainService.connection.getAccountInfo(playerAddress[0]);
            if (playerBuffer === null) {
                this._isLoading = false;
                this._searchedCoupon = undefined;
                return;
            }

            this._searchedCoupon = deserialize(LottoGameModel.getSchema(), LottoGameModel, playerBuffer!.data);
        } catch (_) {
        }

        this._isLoading = false;
    }

    removeCouponFromList(couponSeed: string): void {
        this._searchedCoupon = undefined;

        if (!this._allCoupons) {
            return;
        }

        const couponIndex = this._allCoupons?.findIndex((coupon) => coupon.getSeed() === couponSeed);
        if (couponIndex === -1) {
            return;
        }

        this._allCoupons.splice(couponIndex, 1);
        this._allCoupons = [...this._allCoupons]
    }

    private async _getAllMyCoupons(): Promise<void> {
        if (this.walletPublicKey === null) {
            return;
        }

        this._isLoading = true;

        const base = encode(this.walletPublicKey.toString());

        const accounts = await this._blockChainService.connection.getProgramAccounts(
            BLOCK_CHAIN_KEYS.programId,
            {
                filters: [
                    { dataSize: 93 },
                    { memcmp: { offset: 12, bytes: base } },
                ],
            }
        );

        this._allCoupons = accounts.map(accountItem => deserialize(LottoGameModel.getSchema(), LottoGameModel, accountItem.account!.data));
        this._isLoading = false;
    }

    private _setWalletPublicKeyChanged$(): void {
        this._walletPublicKeyChanged$ = this._blockChainService.walletPublicKey$
            .subscribe(() => {
                this._allCoupons = undefined;
                this._searchedCoupon = undefined;

                this._getAllMyCoupons();
            });
    }

    private _setSearchTextListener(): void {
        this._searchTextListener = this._searchTextDebounce
            .pipe(debounceTime(1000))
            .subscribe((searchText: string) => this.searchByCouponByCode(searchText));
    }

    private _clearPublicKeyChanged(): void {
        if (this._walletPublicKeyChanged$ !== undefined) {
            this._walletPublicKeyChanged$.unsubscribe();
        }
    }

    private _clearSearchTextListener(): void {
        if (this._searchTextListener !== undefined) {
            this._searchTextListener.unsubscribe();
        }
    }


}
