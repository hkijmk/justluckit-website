import { Component, EventEmitter, Input, Output } from '@angular/core';
import { encode } from '@faustbrian/node-base58';
import { AccountInfo, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { deserialize } from 'borsh';
import { Buffer } from 'buffer';
import { firstValueFrom } from 'rxjs';

import { AppStateService } from '../../../services/app-state.service';
import { BlockChainService } from '../../../services/block-chain.service';

import { BLOCK_CHAIN_KEYS } from '../../../constants';
import { LottoGameModel, NumberOfDistributorsModel } from '../../../models';

@Component({
    selector: 'coupon-item',
    templateUrl: './coupon-item.component.html',
    styleUrls: ['./coupon-item.component.scss']
})
export class CouponItemComponent {
    @Input() coupon!: LottoGameModel;

    @Output() removeFromList = new EventEmitter<string>();

    private _isClaimingReward: boolean = false;
    private _isReturningDeposit: boolean = false;

    get isClaimingReward(): boolean {
        return this._isClaimingReward;
    }

    get isReturningDeposit(): boolean {
        return this._isReturningDeposit;
    }

    get hasWinner(): boolean {
        const mainScreenInfo = this._appStateService.mainScreenInfo;
        if (!mainScreenInfo) {
            return false;
        }

        return mainScreenInfo.weekNumber >= this.coupon.weekNumber + 2
            || (mainScreenInfo.weekNumber === this.coupon.weekNumber + 1 && mainScreenInfo.director.stage === 4);
    }

    constructor(private _appStateService: AppStateService,
                private _blockChainService: BlockChainService) {
    }

    async claimReward(): Promise<void> {
        this._isClaimingReward = true;

        const gameAddress = PublicKey.findProgramAddressSync([Buffer.from("L"), Buffer.from(this.coupon.getEncodedSeed())], BLOCK_CHAIN_KEYS.programId);
        const distributionAddress = PublicKey.findProgramAddressSync([Buffer.from("dist"), Buffer.from(this.coupon.weekNumber.toString())], BLOCK_CHAIN_KEYS.programId);
        let distributorPublicKey: PublicKey;

        if (this.coupon.wins === 3 || this.coupon.wins === 4 || this.coupon.wins === 5) {
            distributorPublicKey = await this._getDistributorPublicKey(this.coupon.weekNumber, this.coupon.wins)
        } else if (this.coupon.wins === 6) {
            distributorPublicKey = PublicKey.findProgramAddressSync([
                Buffer.from(this.coupon.weekNumber.toString()),
                Buffer.from("sd"),
                Buffer.from('1'),
                Buffer.from("f"),
                Buffer.from(this.coupon.wins.toString()),
            ], BLOCK_CHAIN_KEYS.programId)[0];
        } else {
            this._isClaimingReward = false;
            return;
        }

        const gameplay = new TransactionInstruction({
            programId: BLOCK_CHAIN_KEYS.programId,
            keys: [
                { isSigner: false, isWritable: false, pubkey: distributionAddress[0] },
                { isSigner: false, isWritable: true, pubkey: distributorPublicKey },
                { isSigner: false, isWritable: true, pubkey: this._blockChainService.walletPublicKey! },
                { isSigner: false, isWritable: true, pubkey: gameAddress[0] },
            ],
            data: Buffer.from([90])
        });

        const transaction = new Transaction();
        transaction.add(gameplay);

        try {
            await this._sendTransaction(transaction);
            alert('Your reward has been successfully transferred to your wallet.')
            this.removeFromList.emit(this.coupon.getSeed());
        } catch (e) {
            alert(e);
        }

        this._isClaimingReward = false;
    }

    async returnDeposit(): Promise<void> {
        this._isReturningDeposit = true;

        const gameAddress = PublicKey.findProgramAddressSync([Buffer.from("L"), Buffer.from(this.coupon.getSeed())], BLOCK_CHAIN_KEYS.programId);

        console.log(gameAddress.toString())
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
        transaction.feePayer = this._blockChainService.walletPublicKey!;
        try {
            await this._sendTransaction(transaction);

            alert('Your deposit has been returned to your wallet.')
            this.removeFromList.emit(this.coupon.getSeed());
        } catch (e) {
            alert(e)
        }

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

    private async _getDistributorPublicKey(weekToClaim: number, numberOfMatches: number): Promise<PublicKey> {
        const usedNumberThreeDistributors: { [distributorNumber: number]: true } = {};

        const distributorCount = PublicKey.findProgramAddressSync([
            Buffer.from("nodist"),
            Buffer.from(weekToClaim.toString()),
            Buffer.from("f"),
            Buffer.from(numberOfMatches.toString()),
        ], BLOCK_CHAIN_KEYS.programId);

        const info = await this._blockChainService.connection.getAccountInfo(distributorCount[0]);
        const data = deserialize(NumberOfDistributorsModel.getSchema(), NumberOfDistributorsModel, info!.data);

        let levelThreeDistributorNumber: number | null = this._getLevelThreeDistributorNumber(usedNumberThreeDistributors, data.currentLevelThreeNumber)!;
        let levelTwoDistributorNumber = Math.floor(Math.random() * (levelThreeDistributorNumber !== 1 ? data.remainingLevelTwo : 255)) + 1; //number of level 2 accounts in the first level 3
        let levelOneDistributorNumber = Math.floor(Math.random() * (levelTwoDistributorNumber !== 1 ? data.remainingLevelOne : 255)) + 1; //number of level 1 accounts in the first level 2

        const s1 = "u".toString();
        const s2 = numberOfMatches.toString();

        const weekSeed = weekToClaim.toString().padEnd(6, 'w');
        let levelThreeSeed = levelThreeDistributorNumber.toString().padEnd(4, 'l');
        let levelTwoSeed = levelTwoDistributorNumber.toString().padEnd(4, 'v');
        let levelOneSeed = levelOneDistributorNumber.toString().padEnd(4, 'c');

        let seed = s1 + s2 + weekSeed + levelThreeSeed + levelTwoSeed + levelOneSeed;
        let accounts = await this._getDistributorAccounts(seed)

        while (accounts.length === 0) {
            if (levelOneSeed.length > 0) {
                const numberOfLettersToRemove = levelOneSeed.length === 4 ? 2 : 1;
                levelOneSeed = levelOneSeed.slice(0, levelOneSeed.length - numberOfLettersToRemove)
            } else if (levelTwoSeed.length > 0) {
                const numberOfLettersToRemove = levelTwoSeed.length === 4 ? 2 : 1;
                levelTwoSeed = levelTwoSeed.slice(0, levelTwoSeed.length - numberOfLettersToRemove)
            } else {
                levelThreeDistributorNumber = this._getLevelThreeDistributorNumber(usedNumberThreeDistributors, data.currentLevelThreeNumber)
                if (levelThreeDistributorNumber == null) {
                    throw new Error('All distributors are used.')
                }

                levelThreeSeed = levelThreeDistributorNumber.toString().padEnd(4, 'l');
            }

            seed = s1 + s2 + weekSeed + levelThreeSeed + levelTwoSeed + levelOneSeed;
            accounts = await this._getDistributorAccounts(seed)
        }

        return accounts[0].pubkey;
    }

    private async _getDistributorAccounts(seed: string): Promise<Array<{ pubkey: PublicKey; account: AccountInfo<Buffer> }>> {
        const base = encode(seed);

        return await this._blockChainService.connection.getProgramAccounts(
            BLOCK_CHAIN_KEYS.programId,
            {
                filters: [
                    { dataSize: 39 },
                    { memcmp: { offset: 4, bytes: base } },
                ],
            }
        );
    }

    private _getLevelThreeDistributorNumber(usedNumberThreeDistributors: { [distributorNumber: number]: true }, currentLevelThreeNumber: number): number | null {
        const numberOfUsedThreeDistributors = Object.keys(usedNumberThreeDistributors).length;
        if (numberOfUsedThreeDistributors >= currentLevelThreeNumber) {
            return null;
        }

        const numberThreeDistributor = Math.floor(Math.random() * currentLevelThreeNumber) + 1;
        if (usedNumberThreeDistributors[numberThreeDistributor]) {
            return this._getLevelThreeDistributorNumber(usedNumberThreeDistributors, currentLevelThreeNumber);
        }

        usedNumberThreeDistributors[numberThreeDistributor] = true;
        return numberThreeDistributor;
    }
}
