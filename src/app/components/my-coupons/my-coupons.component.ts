import { Component, OnDestroy, OnInit } from '@angular/core';
import { decode, encode } from '@faustbrian/node-base58';
import { PublicKey } from '@solana/web3.js';
import { deserialize } from 'borsh';
import { Subscription } from 'rxjs';

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
    private _searchText: string = ''
    private _isLoading: boolean = false;

    get searchText(): string {
        return this._searchText;
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
    }

    ngOnDestroy(): void {
        this._clearPublicKeyChanged();
    }

    onSearchTextChange(value: string): void {
        this._searchText = value;
        this._searchedCoupon = undefined;
    }

    async searchCouponByCode(couponCode: string): Promise<void> {
        if (!couponCode) {
            return;
        }

        this._isLoading = true;

        const seed = decode(couponCode);
        const playerAddress = await PublicKey.findProgramAddress([Buffer.from("L"), Buffer.from(seed)], BLOCK_CHAIN_KEYS.programId);
        const playerBuffer = await this._blockChainService.connection.getAccountInfo(playerAddress[0]);
        if (playerBuffer === null) {
            this._isLoading = false;
            this._searchedCoupon = undefined;
            return;
        }

        this._searchedCoupon = deserialize(LottoGameModel.getSchema(), LottoGameModel, playerBuffer!.data);
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

    private _clearPublicKeyChanged(): void {
        if (this._walletPublicKeyChanged$ !== undefined) {
            this._walletPublicKeyChanged$.unsubscribe();
        }
    }
}
