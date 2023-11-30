import { Component, EventEmitter, Output } from '@angular/core';
import { encode } from '@faustbrian/node-base58';
import { Keypair, PublicKey, RpcResponseAndContext, SignatureResult, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { deserialize, serialize } from 'borsh';
import { firstValueFrom } from 'rxjs';

import { AppStateService } from '../../../../../../services/app-state.service';
import { BlockChainService } from '../../../../../../services/block-chain.service';
import { PlayService } from '../../../../services/play.service';

import { BLOCK_CHAIN_KEYS } from '../../../../../../constants';
import { LottoGameModel, RecordModel } from '../../../../../../models';
import { SubControllerModel, SubCounterModel, TermsModel } from '../../../../models';

@Component({
    selector: 'confirm-play-lottery-step-1',
    templateUrl: './step-1.component.html',
    styleUrls: ['./step-1.component.scss', '../confirm-play-lottery.component.scss']
})
export class ConfirmPlayLotteryStep1Component {
    @Output() confirmed = new EventEmitter<string>();
    @Output() onCancel = new EventEmitter<void>();

    private _isPlaying: boolean = false;

    get selectedNumbers(): number[] {
        return this._playService.selectedNumbers;
    }

    get terms(): TermsModel | undefined {
        return this._playService.terms;
    }

    get isPlaying(): boolean {
        return this._isPlaying;
    }

    constructor(private _appStateService: AppStateService,
                private _playService: PlayService,
                private _blockChainService: BlockChainService) {
    }

    async onConfirm(): Promise<void> {
        this._isPlaying = true;

        const publicKey: PublicKey | null = await firstValueFrom(this._blockChainService.walletPublicKey$);
        if (publicKey === null) {
            return;
        }

        const recordBuffer = await this._blockChainService.connection.getAccountInfo(BLOCK_CHAIN_KEYS.record);
        const record = deserialize(RecordModel.getSchema(), RecordModel, recordBuffer!.data);
        this._appStateService.record = record;

        const mainCounterAddress = PublicKey.findProgramAddressSync([Buffer.from("maincounter"), Buffer.from([record.mainCount])], BLOCK_CHAIN_KEYS.programId);

        const midCountNumber = Math.floor(Math.random() * record.midCount) + 1;
        const midCountAddress = PublicKey.findProgramAddressSync(
            [
                Buffer.from("midc"), Buffer.from([record.mainCount]),
                Buffer.from("m"), Buffer.from([midCountNumber]),
                Buffer.from("n"),
            ],
            BLOCK_CHAIN_KEYS.programId,
        );

        const controllerNumber = Math.floor(Math.random() * record.subCount) + 1;
        const controllerAddress = PublicKey.findProgramAddressSync(
            [
                Buffer.from("sreg"), Buffer.from([record.mainCount]),
                Buffer.from("m"), Buffer.from([midCountNumber]),
                Buffer.from("md"), Buffer.from([controllerNumber]),
            ],
            BLOCK_CHAIN_KEYS.programId,
        );

        const controllerBuffer = await this._blockChainService.connection.getAccountInfo(controllerAddress[0]);
        const controllerData = deserialize(SubControllerModel.getSchema(), SubControllerModel, controllerBuffer!.data);

        const controllerNumberOfSeries = controllerData.numberOfSeries;
        const programAddress = PublicKey.findProgramAddressSync([
                Buffer.from("sc"), Buffer.from([record.mainCount]),
                Buffer.from("m"), Buffer.from([midCountNumber]),
                Buffer.from("md"), Buffer.from([controllerNumber]),
                Buffer.from("n"), Buffer.from([controllerNumberOfSeries]),
                Buffer.from("s")
            ],
            BLOCK_CHAIN_KEYS.programId
        );

        await this._play(
            publicKey,
            mainCounterAddress[0],
            midCountAddress[0],
            controllerAddress[0],
            programAddress[0],
            record.mainCount,
            midCountNumber,
            controllerNumber,
            controllerNumberOfSeries,
            record.weekNumber,
        );
    }

    async _play(
        publicKey: PublicKey,
        mainCountKey: PublicKey,
        midCountKey: PublicKey,
        controllerKey: PublicKey,
        subCountKey: PublicKey,
        mainCount: number,
        midCount: number,
        controllerNumber: number,
        controllerNumberOfSeries: number,
        weekNumber: number,
    ): Promise<void> {
        try {
            let numberOfSeries: number;
            let counter: number | undefined;
            let bumpGameWins: boolean = false;

            if (controllerNumberOfSeries === 0) {
                numberOfSeries = 1;
                bumpGameWins = true;
            } else {
                const subCounterBuffer = await this._blockChainService.connection.getAccountInfo(subCountKey);
                const subCounter = deserialize(SubCounterModel.toSchema(), SubCounterModel, subCounterBuffer!.data);
                numberOfSeries = subCounter.numberOfSeries;
                counter = subCounter.counter;

                if (counter >= 1000) {
                    bumpGameWins = true;
                    numberOfSeries++;
                }
            }

            const seed = ConfirmPlayLotteryStep1Component._getSeed(
                weekNumber,
                controllerNumberOfSeries,
                numberOfSeries,
                mainCount,
                midCount,
                controllerNumber,
                counter,
            );

            const programAddress = PublicKey.findProgramAddressSync([Buffer.from("L"), Buffer.from(seed)], BLOCK_CHAIN_KEYS.programId);

            const temp1 = Keypair.generate();
            const temp2 = Keypair.generate();

            const subCountNew = PublicKey.findProgramAddressSync([
                    Buffer.from("sc"), Buffer.from([mainCount]),
                    Buffer.from("m"), Buffer.from([midCount]),
                    Buffer.from("md"), Buffer.from([controllerNumber]),
                    Buffer.from("n"), Buffer.from([numberOfSeries]),
                    Buffer.from("s"),
                ],
                BLOCK_CHAIN_KEYS.programId
            );

            const game = new LottoGameModel();
            game.number1 = this._playService.selectedNumbers[0];
            game.number2 = this._playService.selectedNumbers[1];
            game.number3 = this._playService.selectedNumbers[2];
            game.number4 = this._playService.selectedNumbers[3];
            game.number5 = this._playService.selectedNumbers[4];
            game.number6 = this._playService.selectedNumbers[5];
            game.player = publicKey.toString();
            game.bump = programAddress[1];
            game.wins = bumpGameWins ? subCountNew[1] : 0;

            const lottoGameEncoded = serialize(LottoGameModel.getSchema(), game);
            const playerRecordKey = await PublicKey.createWithSeed(this._blockChainService.walletPublicKey!, "playerrecord", BLOCK_CHAIN_KEYS.programId);

            let account2ProgramId = SystemProgram.programId;
            let lottoGameBuffer: Uint8Array;
            let keys = [
                { isSigner: false, isWritable: false, pubkey: BLOCK_CHAIN_KEYS.record },
                { isSigner: false, isWritable: true, pubkey: publicKey },
                { isSigner: false, isWritable: true, pubkey: programAddress[0] },
                { isSigner: false, isWritable: true, pubkey: temp1.publicKey },
                { isSigner: false, isWritable: true, pubkey: temp2.publicKey },
                { isSigner: false, isWritable: true, pubkey: subCountKey },
                { isSigner: false, isWritable: true, pubkey: controllerKey },
                { isSigner: false, isWritable: false, pubkey: mainCountKey },
                { isSigner: false, isWritable: false, pubkey: midCountKey },
                { isSigner: false, isWritable: false, pubkey: BLOCK_CHAIN_KEYS.term },
                { isSigner: false, isWritable: true, pubkey: playerRecordKey },
                { isSigner: false, isWritable: true, pubkey: SystemProgram.programId },
            ];

            if (counter !== undefined && counter < 1000) {
                account2ProgramId = BLOCK_CHAIN_KEYS.programId;
                lottoGameBuffer = Uint8Array.of(0, ...lottoGameEncoded);
                keys.splice(5, 0, { isSigner: false, isWritable: true, pubkey: this._blockChainService.hostKey });
            } else {
                lottoGameBuffer = Uint8Array.of(1, ...lottoGameEncoded);
                keys.splice(6, 0, { isSigner: false, isWritable: true, pubkey: subCountNew[0] });
            }

            const { rent, total } = await this._getFees(weekNumber);
            const transactionInstruction = new TransactionInstruction({
                programId: BLOCK_CHAIN_KEYS.programId,
                keys,
                data: Buffer.from(lottoGameBuffer)
            });

            await this._createAndConfirmTransaction(
                account2ProgramId,
                transactionInstruction,
                publicKey,
                playerRecordKey,
                rent,
                temp1,
                temp2,
                total,
            );

            const couponCode = encode(seed);
            this.confirmed.emit(couponCode);
        } catch (e) {
            alert(e);
        }

        this._isPlaying = false;
    }

    private static _getSeed(
        weekNumber: number,
        controllerNumberOfSeries: number,
        numberOfSeries: number,
        mainCount: number,
        midCount: number,
        controllerNumber: number,
        counter?: number,
    ): string {
        let s6: string;

        if (controllerNumberOfSeries === 0) {
            s6 = (1).toString();
        } else {
            if (counter! < 1000) {
                s6 = (counter! + 1).toString();
            } else {
                s6 = (1).toString();
            }
        }

        const sp1 = 'w';
        const s1 = weekNumber.toString();
        const sp2 = "m";
        const s2 = mainCount.toString();
        const sp3 = "md";
        const s3 = midCount.toString();
        const sp4 = "sc";
        const s4 = controllerNumber.toString();
        const sp5 = "sr";
        const s5 = numberOfSeries.toString();
        const sp6 = "x";

        return sp1 + s1 + sp2 + s2 + sp3 + s3 + sp4 + s4 + sp5 + s5 + sp6 + s6;
    }

    private async _getFees(weekNumber: number): Promise<{ rent: number, total: number }> {
        const rentAsString = String(this._playService.terms!.rentBN);
        let demandAsString = String(this._playService.terms!.newDemandBN);
        let hostFeesAsString = String(this._playService.terms!.newHostFeeBN);
        let minerFeesAsString = String(this._playService.terms!.newMinersFeeBN);

        if (weekNumber <= this._playService.terms!.applyAfter) {
            minerFeesAsString = String(this._playService.terms!.oldMinersFeeBN);
        }

        if (weekNumber <= this._playService.terms!.applyAfterT) {
            demandAsString = String(this._playService.terms!.oldDemandBN);
        }

        if (weekNumber <= this._playService.terms!.applyAfterH) {
            hostFeesAsString = String(this._playService.terms!.oldHostFeeBN);
        }

        const rent = parseInt(rentAsString, 10);
        const demand = parseInt(demandAsString, 10);
        const hostFee = parseInt(hostFeesAsString, 10);
        const minerFee = parseInt(minerFeesAsString, 10);

        const total = demand + hostFee + minerFee;

        return { rent, total };
    }

    private async _createAndConfirmTransaction(
        account2ProgramId: PublicKey,
        transactionInstruction: TransactionInstruction,
        publicKey: PublicKey,
        playerRecordKey: PublicKey,
        rent: number,
        temp1: Keypair,
        temp2: Keypair,
        total: number,
    ): Promise<RpcResponseAndContext<SignatureResult>> {
        const account1 = SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: temp1.publicKey,
            lamports: rent,
            space: 0,
            programId: SystemProgram.programId
        });

        const account2 = SystemProgram.createAccount({
            fromPubkey: publicKey!,
            newAccountPubkey: temp2.publicKey,
            lamports: total,
            space: 0,
            programId: account2ProgramId
        });

        const transaction = new Transaction();

        if (this._playService.terms!.drawTicketAmount !== 0) {
            const playerRecordBuffer = await this._blockChainService.connection.getAccountInfo(playerRecordKey);
            if ((playerRecordBuffer === null || playerRecordBuffer.lamports === null)) {
                const createdPlayerRecord = SystemProgram.createAccountWithSeed({
                    fromPubkey: this._blockChainService.walletPublicKey!,
                    newAccountPubkey: playerRecordKey,
                    basePubkey: this._blockChainService.walletPublicKey!,
                    seed: "playerrecord",
                    lamports: 20000000,
                    space: 10,
                    programId: BLOCK_CHAIN_KEYS.programId,
                });

                transaction.add(createdPlayerRecord);
            }
        }

        transaction.add(account1, account2, transactionInstruction);
        transaction.feePayer = publicKey;

        const hash = await this._blockChainService.connection.getLatestBlockhash();
        transaction.recentBlockhash = hash.blockhash;
        transaction.lastValidBlockHeight = hash.lastValidBlockHeight;

        transaction.sign(temp1, temp2);

        const signedTrans = await firstValueFrom(this._blockChainService.signTransaction(transaction));
        const signature = await this._blockChainService.connection.sendRawTransaction(signedTrans.serialize());

        return await this._blockChainService.connection.confirmTransaction(
            { signature, blockhash: hash.blockhash, lastValidBlockHeight: hash.lastValidBlockHeight },
            'singleGossip',
        );
    }
}
