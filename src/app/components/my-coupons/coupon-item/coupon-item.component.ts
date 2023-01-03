import { Component, Input } from '@angular/core';
import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { deserialize } from 'borsh';
import { firstValueFrom } from 'rxjs';

import { BlockChainService } from '../../../services/block-chain.service';

import { BLOCK_CHAIN_KEYS } from '../../../constants';
import { CalculatedDistributionModel, LottoGameModel } from '../../../models';

@Component({
    selector: 'coupon-item',
    templateUrl: './coupon-item.component.html',
    styleUrls: ['./coupon-item.component.scss']
})
export class CouponItemComponent {
    @Input() coupon!: LottoGameModel;

    private readonly _MIN_DISTRIBUTOR_LAMPORTS_FOR_CLAIM: number = 2000000;
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

        const gameAddress = PublicKey.findProgramAddressSync([Buffer.from("L"), Buffer.from(this.coupon.getEncodedSeed())], BLOCK_CHAIN_KEYS.programId);
        const calculatedDistributionAddress = PublicKey.findProgramAddressSync([Buffer.from("caldist"), Buffer.from(this.coupon.week.toString())], BLOCK_CHAIN_KEYS.programId);
        const calculatedDistributionInfo = await this._blockChainService.connection.getAccountInfo(calculatedDistributionAddress[0]);
        const calculatedDistributionData = deserialize(CalculatedDistributionModel.getSchema(), CalculatedDistributionModel, calculatedDistributionInfo!.data);

        const distribution = await PublicKey.findProgramAddressSync([Buffer.from("dist"), Buffer.from(this.coupon.week.toString())], BLOCK_CHAIN_KEYS.programId);

        let subDistributorNumber: number = 0;
        let distributorCount: number = 0;
        let lamports: number = 0;
        let win: number = this.coupon.wins;
        let subDistributorAddress: [PublicKey, number];

        if (win == 3) {
            distributorCount = calculatedDistributionData.createdThreeWinnerSubDistributorCount;
        } else if (win == 4) {
            distributorCount = calculatedDistributionData.createdFourWinnerSubDistributorCount;
        } else if (win == 5) {
            distributorCount = calculatedDistributionData.createdFiveWinnerSubDistributorCount;
        } else if (win == 6) {
            distributorCount = calculatedDistributionData.createdSixWinnerSubDistributorCount;
        }

        while (lamports <= this._MIN_DISTRIBUTOR_LAMPORTS_FOR_CLAIM) {
            subDistributorNumber = Math.floor(Math.random() * distributorCount) + 1;

            subDistributorAddress = PublicKey.findProgramAddressSync([
                Buffer.from(this.coupon.week.toString()),
                Buffer.from("sd"),
                Buffer.from(subDistributorNumber.toString()),
                Buffer.from("f"),
                Buffer.from(win.toString()),
            ], BLOCK_CHAIN_KEYS.programId);

            const subDistributorAccount = await this._blockChainService.connection.getAccountInfo(subDistributorAddress[0])
            lamports = subDistributorAccount?.lamports ?? lamports;
        }

        const gameplay = new TransactionInstruction({
            programId: BLOCK_CHAIN_KEYS.programId,
            keys: [
                { isSigner: false, isWritable: false, pubkey: distribution[0] },
                { isSigner: false, isWritable: true, pubkey: subDistributorAddress![0] },
                { isSigner: false, isWritable: true, pubkey: this._blockChainService.walletPublicKey! },
                { isSigner: false, isWritable: true, pubkey: gameAddress[0] },
            ],
            data: Buffer.from([90])
        });

        const transaction = new Transaction();
        transaction.add(gameplay);
        this._sendTransaction(transaction);

        this._isClaimingReward = false;
    }

    async returnDeposit(): Promise<void> {
        this._isReturningDeposit = true;

        const gameAddress = PublicKey.findProgramAddressSync([Buffer.from("L"), Buffer.from(this.coupon.getEncodedSeed())], BLOCK_CHAIN_KEYS.programId);

        const transactionInstruction = new TransactionInstruction({
            programId: BLOCK_CHAIN_KEYS.programId,
            keys: [
                { isSigner: false, isWritable: true, pubkey: this._blockChainService.walletPublicKey! },
                { isSigner: false, isWritable: true, pubkey: gameAddress[0] },
                { isSigner: false, isWritable: true, pubkey: SystemProgram.programId },
            ],
            data: Buffer.from([17])
        });

        const transaction = new Transaction();
        transaction.add(transactionInstruction);
        this._sendTransaction(transaction);

        this._isReturningDeposit = false;
    }

    private async _sendTransaction(transaction: Transaction): Promise<void> {
        const hash = await this._blockChainService.connection.getLatestBlockhash();
        transaction.recentBlockhash = hash.blockhash;
        transaction.lastValidBlockHeight = hash.lastValidBlockHeight;

        const signedTrans = await firstValueFrom(this._blockChainService.signTransaction(transaction));
        const signature = await this._blockChainService.connection.sendRawTransaction(signedTrans.serialize());
        await this._blockChainService.connection.confirmTransaction(
            { signature, blockhash: hash.blockhash, lastValidBlockHeight: hash.lastValidBlockHeight },
            'singleGossip',
        );
    }
}
