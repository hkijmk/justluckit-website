import { Component, OnInit } from '@angular/core';
import { decode, encode } from '@faustbrian/node-base58';
import { Connection, PublicKey } from '@solana/web3.js';
import { deserialize } from 'borsh';
import { firstValueFrom } from 'rxjs';

import { BlockChainService } from '../../../../services/block-chain.service';

import { BLOCK_CHAIN_KEYS } from '../../../../constants';
import { LottoGameModel } from '../../../../models';

@Component({
    selector: 'my-coupons',
    templateUrl: './my-coupons.component.html',
    styleUrls: ['./my-coupons.component.scss']
})
export class MyCouponsComponent implements OnInit {
    private _isLoading: boolean = false;
    private _allCoupons?: LottoGameModel[];
    private _searchedCoupon?: LottoGameModel;

    get isLoading(): boolean {
        return this._isLoading;
    }

    get allCoupons(): LottoGameModel[] | undefined {
        return this._allCoupons;
    }

    get searchedCoupon(): LottoGameModel | undefined {
        return this._searchedCoupon;
    }

    constructor(private _blockChainService: BlockChainService) {
    }

    ngOnInit(): void {
        this._getAllMyCoupons();
    }

    async searchCouponByCode(couponCode: string): Promise<void> {
        this._isLoading = true;

        const connection: Connection | null = await firstValueFrom(this._blockChainService.connection$);
        if (connection === null) {
            this._isLoading = false;
            return;
        }

        const seed = decode(couponCode);
        const playerAddress = await PublicKey.findProgramAddress([Buffer.from("L"), Buffer.from(seed)], BLOCK_CHAIN_KEYS.programId);
        const playerBuffer = await connection.getAccountInfo(playerAddress[0]);
        if (playerBuffer === null) {
            this._isLoading = false;
            this._searchedCoupon = undefined;
            return;
        }

        this._searchedCoupon = deserialize(LottoGameModel.getSchema(), LottoGameModel, playerBuffer!.data);

        this._isLoading = false;
    }

    private async _getAllMyCoupons(): Promise<void> {
        this._isLoading = true;

        const connection: Connection | null = await firstValueFrom(this._blockChainService.connection$);
        if (connection === null) {
            this._isLoading = false;
            return;
        }

        const walletPublicKey = await firstValueFrom(this._blockChainService.publicKey$);
        const base = encode(walletPublicKey!.toString());

        const accounts = await connection.getProgramAccounts(
            BLOCK_CHAIN_KEYS.programId,
            {
                filters: [
                    { dataSize: 93 },
                    {
                        memcmp: {
                            offset: 12, // number of bytes
                            bytes: base,
                        },
                    },
                ],
            }
        );

        this._allCoupons = accounts.map(accountItem => deserialize(LottoGameModel.getSchema(), LottoGameModel, accountItem.account!.data));

        this._isLoading = false;
    }
}
