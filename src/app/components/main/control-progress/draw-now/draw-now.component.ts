import { Component } from '@angular/core';
import { encode } from '@faustbrian/node-base58';
import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { deserialize } from 'borsh';
import { firstValueFrom } from 'rxjs';

import { BlockChainService } from '../../../../services/block-chain.service';

import { BLOCK_CHAIN_KEYS } from '../../../../constants';
import { LotteryModel, MainCounterModel, RecordModel } from '../../../../models';

@Component({
    selector: 'draw-now',
    templateUrl: './draw-now.component.html',
    styleUrls: ['./draw-now.component.scss']
})
export class DrawNowComponent {
    private _isLoading: boolean = false;
    private _connection?: Connection;

    get isLoading(): boolean {
        return this._isLoading;
    }

    constructor(private _blockChainService: BlockChainService) {
    }

    async draw(): Promise<void> {
        this._isLoading = true;
        this._connection = (await firstValueFrom(this._blockChainService.connection$))!;

        const lotteryBuffer = await this._connection.getAccountInfo(BLOCK_CHAIN_KEYS.lottery);
        const lottery = deserialize(LotteryModel.getSchema(), LotteryModel, lotteryBuffer!.data);

        const walletPublicKey = (await firstValueFrom(this._blockChainService.publicKey$))!;
        const walletPublicKeyBytes = encode(walletPublicKey.toString());

        const accounts = await this._connection.getProgramAccounts(
            BLOCK_CHAIN_KEYS.programId,
            {
                filters: [
                    {
                        dataSize: 93, // number of bytes
                    },
                    {
                        memcmp: {
                            offset: 12, // number of bytes
                            bytes: walletPublicKeyBytes,
                        },
                    },
                ],
            }
        );

        const playerPublicKey = accounts[0].pubkey.toString();

        if (lottery.call == 0) {
            await this._startLottery(playerPublicKey, walletPublicKey);
        } else if (lottery.call == lottery.shouldCall) {
            await this._endLottery(playerPublicKey, walletPublicKey);
        } else {
            await this._randomizeLottery(playerPublicKey, walletPublicKey);
        }

        this._isLoading = false;
    }

    private async _startLottery(playerPublicKey: string, walletPublicKey: PublicKey): Promise<void> {
        const idleMainCounter = await this._findIdleMainCounter();
        const playerAccount = new PublicKey(playerPublicKey);

        const mainCount =
            await PublicKey.findProgramAddress(
                [
                    Buffer.from("maincounter"),
                    Buffer.from([idleMainCounter]),
                ],
                BLOCK_CHAIN_KEYS.programId,
            );

        const midCountAddress = await PublicKey.findProgramAddress(
            [
                Buffer.from("midc"), Buffer.from([idleMainCounter]),
                Buffer.from("m"), Buffer.from([1]),
                Buffer.from("n"),
            ],
            BLOCK_CHAIN_KEYS.programId,
        );

        const gameTransactionInstruction = new TransactionInstruction({
            programId: BLOCK_CHAIN_KEYS.programId,
            keys: [
                { isSigner: false, isWritable: true, pubkey: BLOCK_CHAIN_KEYS.record },
                { isSigner: false, isWritable: true, pubkey: mainCount[0] },
                { isSigner: false, isWritable: false, pubkey: midCountAddress[0] },
                { isSigner: false, isWritable: true, pubkey: walletPublicKey },
                { isSigner: false, isWritable: true, pubkey: playerAccount },
                { isSigner: false, isWritable: true, pubkey: BLOCK_CHAIN_KEYS.lottoFund },
                { isSigner: false, isWritable: true, pubkey: BLOCK_CHAIN_KEYS.dateOfDraw },
                { isSigner: false, isWritable: true, pubkey: BLOCK_CHAIN_KEYS.lottery },
                { isSigner: false, isWritable: false, pubkey: BLOCK_CHAIN_KEYS.playTerm },
                { isSigner: false, isWritable: false, pubkey: BLOCK_CHAIN_KEYS.rentTerms },
            ],
            data: Buffer.from([200])
        });

        await this._sendAndConfirmTransaction(gameTransactionInstruction, walletPublicKey);
    }

    private async _randomizeLottery(playerPublicKey: string, walletPublicKey: PublicKey) {
        const recordBuffer = await this._connection!.getAccountInfo(BLOCK_CHAIN_KEYS.record);
        const record = deserialize(RecordModel.getSchema(), RecordModel, recordBuffer!.data);
        const mainCountOfLastWeek = await this._mainCounterOfLastWeek(record);
        const playerAccount = new PublicKey(playerPublicKey);

        const subCounterNumber = Math.floor(Math.random() * record.subCount) + 1;
        const midCounterNumber = Math.floor(Math.random() * record.midCount) + 1;
        const controllerAddress =
            await PublicKey.findProgramAddress([
                Buffer.from("sctrl"), Buffer.from([mainCountOfLastWeek]),
                Buffer.from("m"), Buffer.from([midCounterNumber]),
                Buffer.from("md"), Buffer.from([subCounterNumber]),
            ], BLOCK_CHAIN_KEYS.programId);

        const mainCountAddress =
            await PublicKey.findProgramAddress([
                    Buffer.from("maincounter"),
                    Buffer.from([mainCountOfLastWeek])],
                BLOCK_CHAIN_KEYS.programId);

        const gameTransactionInstruction = new TransactionInstruction({
            programId: BLOCK_CHAIN_KEYS.programId,
            keys: [
                { isSigner: false, isWritable: false, pubkey: controllerAddress[0] },
                { isSigner: false, isWritable: false, pubkey: mainCountAddress[0] },
                { isSigner: false, isWritable: true, pubkey: walletPublicKey },
                { isSigner: false, isWritable: false, pubkey: playerAccount },
                { isSigner: false, isWritable: true, pubkey: BLOCK_CHAIN_KEYS.lottoFund },
                { isSigner: false, isWritable: true, pubkey: BLOCK_CHAIN_KEYS.lottery },
                { isSigner: false, isWritable: true, pubkey: BLOCK_CHAIN_KEYS.record },
                { isSigner: false, isWritable: false, pubkey: BLOCK_CHAIN_KEYS.rentTerms },
            ],
            data: Buffer.from([210])
        });

        await this._sendAndConfirmTransaction(gameTransactionInstruction, walletPublicKey);
    }

    private async _endLottery(playerPublicKey: string, walletPublicKey: PublicKey) {
        const playerAccount = new PublicKey(playerPublicKey);

        const gameTransactionInstruction = new TransactionInstruction({
            programId: BLOCK_CHAIN_KEYS.programId,
            keys: [
                { isSigner: false, isWritable: false, pubkey: BLOCK_CHAIN_KEYS.record },
                { isSigner: false, isWritable: true, pubkey: walletPublicKey },
                { isSigner: false, isWritable: false, pubkey: playerAccount },
                { isSigner: false, isWritable: true, pubkey: BLOCK_CHAIN_KEYS.lottoFund },
                { isSigner: false, isWritable: true, pubkey: BLOCK_CHAIN_KEYS.lottery },
                { isSigner: false, isWritable: false, pubkey: BLOCK_CHAIN_KEYS.rentTerms },
            ],
            data: Buffer.from([220])
        });

        await this._sendAndConfirmTransaction(gameTransactionInstruction, walletPublicKey);
    }

    private async _sendAndConfirmTransaction(gameTransactionInstruction: TransactionInstruction, walletPublicKey: PublicKey): Promise<void> {
        try {
            const hash = await this._connection!.getLatestBlockhash();
            const transaction = new Transaction();
            transaction.add(gameTransactionInstruction);
            transaction.feePayer = walletPublicKey;
            transaction.recentBlockhash = hash.blockhash;
            transaction.lastValidBlockHeight = hash.lastValidBlockHeight;

            let signedTrans = await firstValueFrom(this._blockChainService.signTransaction(transaction));
            let signature = await this._connection!.sendRawTransaction(signedTrans.serialize());
            await this._connection!.confirmTransaction({ signature, blockhash: hash.blockhash, lastValidBlockHeight: hash.lastValidBlockHeight });
        } catch (error) {
            alert(error);
        }
    }

    private async _getMainCounterByIndex(index: number): Promise<MainCounterModel> {
        const mainCount = await PublicKey.findProgramAddress([Buffer.from("maincounter"), Buffer.from([index])], BLOCK_CHAIN_KEYS.programId);
        const mainCountBuffer = await this._connection!.getAccountInfo(mainCount[0]);
        return deserialize(MainCounterModel.getSchema(), MainCounterModel, mainCountBuffer!.data);
    }

    private async _findIdleMainCounter(): Promise<number> {
        for (let index = 1; index < 5; index++) {
            const mainCounter = await this._getMainCounterByIndex(index);
            if (mainCounter.weekNumber == 0) {
                return mainCounter.counterNumber;
            }
        }

        return 1;
    }

    private async _mainCounterOfLastWeek(record: RecordModel): Promise<number> {
        for (let index = 1; index < 5; index++) {
            const mainCounter = await this._getMainCounterByIndex(index);
            if (mainCounter.weekNumber == (record.weekNumber - 1)) {
                return mainCounter.counterNumber;
            }
        }

        return 1;
    }
}
