import { Component, OnDestroy, OnInit } from '@angular/core';
import { decode } from '@faustbrian/node-base58';
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

    get searchedCoupon(): LottoGameModel | undefined {
        return this._searchedCoupon;
    }

    get walletPublicKey(): PublicKey | null {
        return this._blockChainService.walletPublicKey;
    }

    constructor(private _blockChainService: BlockChainService) {
    }

    ngOnInit(): void {
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

    private _setWalletPublicKeyChanged$(): void {
        this._walletPublicKeyChanged$ = this._blockChainService.walletPublicKey$
            .subscribe(() => {
                this._searchedCoupon = undefined;
            });
    }

    private _clearPublicKeyChanged(): void {
        if (this._walletPublicKeyChanged$ !== undefined) {
            this._walletPublicKeyChanged$.unsubscribe();
        }
    }
}
