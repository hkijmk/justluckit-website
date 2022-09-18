import { Component, EventEmitter, Output } from '@angular/core';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { deserialize, serialize } from 'borsh';
import { firstValueFrom } from 'rxjs';

import { WalletService } from '../../../../../../services/wallet.service';
import { PlayService } from '../../../../services/play.service';

import { BLOCK_CHAIN_KEYS } from '../../../../../../constants';
import { LottoGameModel, MinerTermsModel, RecordModel, SubControllerModel, SubCounterModel, TermOneModel } from '../../../../models';

@Component({
    selector: 'confirm-play-lottery-step-1',
    templateUrl: './step-1.component.html',
    styleUrls: ['./step-1.component.scss', '../confirm-play-lottery.component.scss']
})
export class ConfirmPlayLotteryStep1Component {
    @Output() confirmed = new EventEmitter<void>();
    @Output() onCancel = new EventEmitter<void>();

    get selectedNumbers(): number[] {
        return this._playService.selectedNumbers;
    }

    constructor(private _playService: PlayService,
                private _walletService: WalletService) {
    }

    async onConfirm(): Promise<void> {
        const connection: Connection | null = await firstValueFrom(this._walletService.connection$);
        if (connection === null) {
            return;
        }

        const publicKey: PublicKey | null = await firstValueFrom(this._walletService.publicKey$);
        if (publicKey === null) {
            return;
        }

        const recordBuffer = await connection.getAccountInfo(BLOCK_CHAIN_KEYS.record);
        const record = deserialize(RecordModel.getSchema(), RecordModel, recordBuffer!.data);

        const mainCounter = await PublicKey.findProgramAddress([Buffer.from("maincounter"), Buffer.from([record.mainCountNumber])], BLOCK_CHAIN_KEYS.programId);

        const midCountNumber = Math.floor(Math.random() * record.subCountNumber) + 1;
        const midCount = await PublicKey.findProgramAddress(
            [
                Buffer.from("midc"), Buffer.from([record.mainCountNumber]),
                Buffer.from("m"), Buffer.from([midCountNumber]),
                Buffer.from("n"),
            ],
            BLOCK_CHAIN_KEYS.programId,
        );

        const controllerNumber = Math.floor(Math.random() * record.subCountNumber) + 1;
        const controller = await PublicKey.findProgramAddress(
            [
                Buffer.from("sctrl"), Buffer.from([record.mainCountNumber]),
                Buffer.from("m"), Buffer.from([midCountNumber]),
                Buffer.from("md"), Buffer.from([controllerNumber]),
            ],
            BLOCK_CHAIN_KEYS.programId,
        );

        const controllerAccountInfo = await connection.getAccountInfo(controller[0]);
        const controllerData = deserialize(SubControllerModel.getSchema(), SubControllerModel, controllerAccountInfo!.data);

        const controllerNumberOfSeries = controllerData.number_of_series;
        const programAddress = await PublicKey.findProgramAddress([
                Buffer.from("sc"), Buffer.from([record.mainCountNumber]),
                Buffer.from("m"), Buffer.from([midCountNumber]),
                Buffer.from("md"), Buffer.from([controllerNumber]),
                Buffer.from("n"), Buffer.from([controllerNumberOfSeries]),
                Buffer.from("s")
            ],
            BLOCK_CHAIN_KEYS.programId
        );

        await this.play(
            publicKey,
            connection,
            mainCounter[0],
            midCount[0],
            controller[0],
            programAddress[0],
            record.mainCountNumber,
            midCountNumber,
            controllerNumber,
            controllerNumberOfSeries,
            record.week,
        );
    }

    async play(
        publicKey: PublicKey,
        connection: Connection,
        mainCount: PublicKey,
        midCount: PublicKey,
        controller: PublicKey,
        subCount: PublicKey,
        mainCountNumber: number,
        midCountNumber: number,
        controllerNumber: number,
        controllerNumberOfSeries: number,
        week: number,
    ) {
        try {
            let numberOfSeries: number;
            let s5: string;
            let s6: string;
            let counter: number | undefined;

            if (controllerNumberOfSeries === 0) {
                s5 = (1).toString();
                s6 = (1).toString();
                numberOfSeries = 1;
            } else {
                const subCounterAccountInfo = await connection.getAccountInfo(subCount);
                const subCounterData = deserialize(SubCounterModel.toSchema(), SubCounterModel, subCounterAccountInfo!.data);
                numberOfSeries = subCounterData.serialno;
                counter = subCounterData.counter;

                if (counter < 10) {
                    s5 = (numberOfSeries).toString();
                    s6 = (counter + 1).toString();
                } else {
                    s5 = (numberOfSeries + 1).toString();
                    s6 = (1).toString();
                }
            }

            const sp1 = 'w';
            const s1 = week.toString();
            const sp2 = "m";
            const s2 = mainCountNumber.toString();
            const sp3 = "md";
            const s3 = midCountNumber.toString();
            const sp4 = "sc";
            const s4 = controllerNumber.toString();
            const sp5 = "sr";
            const sp6 = "x";
            const seed = sp1 + s1 + sp2 + s2 + sp3 + s3 + sp4 + s4 + sp5 + s5 + sp6 + s6;

            const programAddress = await PublicKey.findProgramAddress([Buffer.from("L"), Buffer.from(seed)], BLOCK_CHAIN_KEYS.programId);

            const temp1 = Keypair.generate();
            const temp2 = Keypair.generate();

            const termOneBuffer = await connection.getAccountInfo(BLOCK_CHAIN_KEYS.term);
            const termOne = deserialize(TermOneModel.toSchema(), TermOneModel, termOneBuffer!.data);
            const minerAccountInfo = await connection.getAccountInfo(BLOCK_CHAIN_KEYS.minerTerms);
            const minerData = deserialize(MinerTermsModel.toSchema(), MinerTermsModel, minerAccountInfo!.data);

            const rentAsString = String(termOne.rent);
            let demandAsString = String(termOne.new_demand);
            let hostFeesAsString = String(termOne.new_hostfee);
            let minerFeesAsString = String(minerData.new_minersfee);

            if (week <= minerData.apply_after) {
                minerFeesAsString = String(minerData.old_minersfee);
            }

            if (week <= termOne.apply_after_t) {
                demandAsString = String(termOne.old_demand);
            }

            if (week <= termOne.apply_after_h) {
                hostFeesAsString = String(termOne.old_hostfee);
            }

            const game = new LottoGameModel();
            game.number1 = this._playService.selectedNumbers[0];
            game.number2 = this._playService.selectedNumbers[1];
            game.number3 = this._playService.selectedNumbers[2];
            game.number4 = this._playService.selectedNumbers[3];
            game.number5 = this._playService.selectedNumbers[4];
            game.number6 = this._playService.selectedNumbers[5];
            game.player = publicKey.toString();
            game.bump = programAddress[1];

            const encoded = serialize(LottoGameModel.toSchema(), game);
            let concatenated = Uint8Array.of(10, ...encoded);
            let account2ProgramId = SystemProgram.programId;

            const serial = numberOfSeries + 1;
            const subCountNew = await PublicKey.findProgramAddress([
                    Buffer.from("sc"), Buffer.from([mainCountNumber]),
                    Buffer.from("m"), Buffer.from([midCountNumber]),
                    Buffer.from("md"), Buffer.from([controllerNumber]),
                    Buffer.from("n"), Buffer.from([serial]),
                    Buffer.from("s"),
                ],
                BLOCK_CHAIN_KEYS.programId
            );
            let keys = [
                { isSigner: false, isWritable: false, pubkey: BLOCK_CHAIN_KEYS.record },
                { isSigner: false, isWritable: true, pubkey: publicKey },
                { isSigner: false, isWritable: true, pubkey: programAddress[0] },
                { isSigner: false, isWritable: true, pubkey: temp1.publicKey },
                { isSigner: false, isWritable: true, pubkey: temp2.publicKey },
                { isSigner: false, isWritable: true, pubkey: subCountNew[0] },
                { isSigner: false, isWritable: true, pubkey: subCountNew[0] },
                { isSigner: false, isWritable: true, pubkey: controller },
                { isSigner: false, isWritable: false, pubkey: mainCount },
                { isSigner: false, isWritable: false, pubkey: midCount },
                { isSigner: false, isWritable: false, pubkey: BLOCK_CHAIN_KEYS.term },
                { isSigner: false, isWritable: false, pubkey: BLOCK_CHAIN_KEYS.minerTerms },
                { isSigner: false, isWritable: true, pubkey: SystemProgram.programId },
            ]

            if (counter !== undefined && counter < 10) {
                account2ProgramId = BLOCK_CHAIN_KEYS.programId;
                concatenated = Uint8Array.of(0, ...encoded);
                keys = [
                    { isSigner: false, isWritable: false, pubkey: BLOCK_CHAIN_KEYS.record },
                    { isSigner: false, isWritable: true, pubkey: publicKey },
                    { isSigner: false, isWritable: true, pubkey: programAddress[0] },
                    { isSigner: false, isWritable: true, pubkey: temp1.publicKey },
                    { isSigner: false, isWritable: true, pubkey: temp2.publicKey },
                    { isSigner: false, isWritable: true, pubkey: BLOCK_CHAIN_KEYS.host },
                    { isSigner: false, isWritable: true, pubkey: subCount },
                    { isSigner: false, isWritable: true, pubkey: controller },
                    { isSigner: false, isWritable: false, pubkey: mainCount },
                    { isSigner: false, isWritable: false, pubkey: midCount },
                    { isSigner: false, isWritable: false, pubkey: subCount },
                    { isSigner: false, isWritable: false, pubkey: BLOCK_CHAIN_KEYS.term },
                    { isSigner: false, isWritable: false, pubkey: BLOCK_CHAIN_KEYS.minerTerms },
                    { isSigner: false, isWritable: true, pubkey: SystemProgram.programId },
                ]
            }

            const gameplay = new TransactionInstruction({
                programId: BLOCK_CHAIN_KEYS.programId,
                keys,
                data: Buffer.from(concatenated)
            });

            const rent = parseInt(rentAsString, 10);
            const demand = parseInt(demandAsString, 10);
            const hostFee = parseInt(hostFeesAsString, 10);
            const minerFee = parseInt(minerFeesAsString, 10);

            const total = demand + hostFee + minerFee;

            const account = SystemProgram.createAccount({
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
            transaction.add(account, account2, gameplay);
            transaction.feePayer = publicKey;

            const hash = await connection.getLatestBlockhash();
            transaction.recentBlockhash = hash.blockhash;
            transaction.lastValidBlockHeight = hash.lastValidBlockHeight;

            transaction.sign(temp1, temp2);
            const signedTrans = await firstValueFrom(this._walletService.signTransaction(transaction));
            const signature = await connection.sendRawTransaction(signedTrans.serialize());
            const result = await connection.confirmTransaction(
                { signature, blockhash: hash.blockhash, lastValidBlockHeight: hash.lastValidBlockHeight },
                'singleGossip',
            );
            alert(result.context.slot.toString());
        } catch (e) {
            alert(e);
        }
    }
}
