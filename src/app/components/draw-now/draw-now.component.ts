import { Component, Input } from '@angular/core';
import { encode } from '@faustbrian/node-base58';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { deserialize } from 'borsh';
import { firstValueFrom } from 'rxjs';

import { BlockChainService } from '../../services/block-chain.service';

import { PlayLotteryHandler } from './handlers/play_lottery.handler';

import { BLOCK_CHAIN_KEYS } from '../../constants';
import { LotteryModel, LottoGameModel, PlayerRecordModel } from '../../models';

@Component({
    selector: 'draw-now',
    templateUrl: './draw-now.component.html',
    styleUrls: ['./draw-now.component.scss']
})
export class DrawNowComponent {
    @Input() drawDate!: Date;

    private _isLoading: boolean = false;
    private _canDrawLottery: boolean = false;
    private _playerRecord?: PlayerRecordModel;

    get isLoading(): boolean {
        return this._isLoading;
    }

    get canDrawLottery(): boolean {
        return this._canDrawLottery
    }

    constructor(private _blockChainService: BlockChainService) {
    }

    ngOnInit(): void {
        this._setCanDrawLottery();
    }

    async playLottery(): Promise<void> {
        this._isLoading = true;

        await new PlayLotteryHandler(this._blockChainService).draw();
        await this._setCanDrawLottery();

        this._isLoading = false;
    }

    private async _setCanDrawLottery(): Promise<void> {
        const lotteryBuffer = await this._blockChainService.connection.getAccountInfo(BLOCK_CHAIN_KEYS.lottery);
        const lottery = deserialize(LotteryModel.getSchema(), LotteryModel, lotteryBuffer!.data);

        const currentTime = new Date().getTime();

        if (lottery.call <= lottery.shouldCall || this.drawDate.getTime() <= currentTime) {
            await this._setCanDrawLotteryPerGameActivity();
        }

        // let airdrop = await connection.requestAirdrop(this._blockChainService.publicKey$,LAMPORTS_PER_SOL);
        // await connection.confirmTransaction(airdrop);
    }

    private async _getPlayerRecord(): Promise<void> {
        const playerRecordKey = await PublicKey.createWithSeed(this._blockChainService.walletPublicKey!, "playerrecord", BLOCK_CHAIN_KEYS.programId);
        const playerRecordBuffer = await this._blockChainService.connection.getAccountInfo(playerRecordKey);

        if (playerRecordBuffer == null) {
            alert("account info is null");
            return;
        }

        if (playerRecordBuffer?.data == null) {
            alert("data is null");
            return;
        }

        if (playerRecordBuffer?.lamports == null) {
            alert("lamports is null");
            return;
        }

        this._playerRecord = deserialize(PlayerRecordModel.getSchema(), PlayerRecordModel, playerRecordBuffer.data);

        const createdPlayerRecord = SystemProgram.createAccountWithSeed({
            fromPubkey: this._blockChainService.walletPublicKey!,
            newAccountPubkey: playerRecordKey,
            basePubkey: this._blockChainService.walletPublicKey!,
            seed: "playerrecord",
            lamports: 20000000,
            space: 61,
            programId: BLOCK_CHAIN_KEYS.programId,
        });
    }

    private async _setCanDrawLotteryPerGameActivity(): Promise<void> {
        const walletPublicKey = (await firstValueFrom(this._blockChainService.walletPublicKey$));
        if (walletPublicKey === null) {
            return;
        }

        const walletPublicKeyBytes = encode(walletPublicKey.toString());

        const accounts = await this._blockChainService.connection.getProgramAccounts(
            BLOCK_CHAIN_KEYS.programId,
            {
                filters: [
                    {
                        dataSize: 93,
                    },
                    {
                        memcmp: {
                            offset: 12,
                            bytes: walletPublicKeyBytes,
                        },
                    },
                ],
            }
        );

        const isPlayerAlreadyPlayed = accounts[0] !== null;
        if (!isPlayerAlreadyPlayed) {
            this._canDrawLottery = false;
            return;
        }

        const lottoGame = deserialize(LottoGameModel.getSchema(), LottoGameModel, accounts[0].account.data);
        this._canDrawLottery = lottoGame.alreadyparticipated === 0;
    }
}
