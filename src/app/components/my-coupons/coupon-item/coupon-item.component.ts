import { Component, Input } from '@angular/core';
import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { firstValueFrom } from 'rxjs';

import { BlockChainService } from '../../../services/block-chain.service';

import { BLOCK_CHAIN_KEYS } from '../../../constants';
import { LottoGameModel } from '../../../models';

@Component({
    selector: 'coupon-item',
    templateUrl: './coupon-item.component.html',
    styleUrls: ['./coupon-item.component.scss']
})
export class CouponItemComponent {
    @Input() coupon!: LottoGameModel;

    private _isClaimingReward: boolean = false;
    private _isReturningDeposit: boolean = false;

    get isClaimingReward(): boolean {
        return this._isClaimingReward;
    }

    get isReturningDeposit(): boolean {
        return this._isReturningDeposit;
    }

    constructor(private _blockChainService: BlockChainService) {
    }

    async claimReward(): Promise<void> {
        this._isClaimingReward = true;

        this._isClaimingReward = false;
    }

    async returnDeposit(): Promise<void> {
        this._isReturningDeposit = true;

        const programAddress = PublicKey.findProgramAddressSync([Buffer.from("L"), Buffer.from(this.coupon.getEncodedSeed())], BLOCK_CHAIN_KEYS.programId);

        const transactionInstruction = new TransactionInstruction({
            programId: BLOCK_CHAIN_KEYS.programId,
            keys: [
                { isSigner: true, isWritable: true, pubkey: this._blockChainService.walletPublicKey! },
                { isSigner: false, isWritable: true, pubkey: programAddress[0] },
                { isSigner: false, isWritable: true, pubkey: SystemProgram.programId },
            ],
            data: Buffer.from([17])
        });

        const transaction = new Transaction();
        transaction.add(transactionInstruction);

        const hash = await this._blockChainService.connection.getLatestBlockhash();
        transaction.recentBlockhash = hash.blockhash;
        transaction.lastValidBlockHeight = hash.lastValidBlockHeight;

        const signedTrans = await firstValueFrom(this._blockChainService.signTransaction(transaction));
        const signature = await this._blockChainService.connection.sendRawTransaction(signedTrans.serialize());
        await this._blockChainService.connection.confirmTransaction(
            { signature, blockhash: hash.blockhash, lastValidBlockHeight: hash.lastValidBlockHeight },
            'singleGossip',
        );

        this._isReturningDeposit = false;
    }
}
