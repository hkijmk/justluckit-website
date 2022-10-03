import { Component, OnInit } from '@angular/core';
import { encode } from '@faustbrian/node-base58';
import { Connection, PublicKey } from '@solana/web3.js';
import { deserialize } from 'borsh';
import { firstValueFrom } from 'rxjs';

import { BlockChainService } from '../../../services/block-chain.service';

import { BLOCK_CHAIN_KEYS } from '../../../constants';
import { DateOfDrawModel, DirectorModel, LotteryModel, LottoGameModel, RecordModel } from '../../../models';

@Component({
    selector: 'control-progress',
    templateUrl: './control-progress.component.html',
    styleUrls: ['./control-progress.component.scss']
})
export class ControlProgressComponent implements OnInit {
    private _director?: DirectorModel;
    private _drawDate?: Date;
    private _canDrawLottery: boolean = false;
    private _connection?: Connection;
    private _isLoading: boolean = false;

    get director(): DirectorModel | undefined {
        return this._director;
    }

    get drawDate(): Date | undefined {
        return this._drawDate;
    }

    get canDrawLottery(): boolean {
        return this._canDrawLottery;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    constructor(private _blockChainService: BlockChainService) {
    }

    ngOnInit(): void {
        this._init();
    }

    private async _init(): Promise<void> {
        this._isLoading = true;

        this._connection = (await firstValueFrom(this._blockChainService.connection$))!;
        await this._getControlStages();
        await this._getDateOfDraw();

        this._isLoading = false;
    }

    private async _getControlStages(): Promise<void> {
        const recordBuffer = await this._connection!.getAccountInfo(BLOCK_CHAIN_KEYS.record);
        const record = deserialize(RecordModel.getSchema(), RecordModel, recordBuffer!.data);

        const directorAddress = await PublicKey.findProgramAddress([
                Buffer.from("director"),
                Buffer.from((record.weekNumber - 1).toString()),
            ],
            BLOCK_CHAIN_KEYS.programId,
        );

        const directorBuffer = await this._connection!.getAccountInfo(directorAddress[0]);
        this._director = deserialize(DirectorModel.getSchema(), DirectorModel, directorBuffer!.data);
    }

    private async _getDateOfDraw(): Promise<void> {
        const dateOfDrawBuffer = await this._connection!.getAccountInfo(BLOCK_CHAIN_KEYS.dateOfDraw);
        const dateOfDraw = deserialize(DateOfDrawModel.getSchema(), DateOfDrawModel, dateOfDrawBuffer!.data);

        const lotteryBuffer = await this._connection!.getAccountInfo(BLOCK_CHAIN_KEYS.lottery);
        const lottery = deserialize(LotteryModel.getSchema(), LotteryModel, lotteryBuffer!.data);

        const currentTime = new Date().getTime();
        if (lottery.call <= lottery.shouldCall || dateOfDraw.getDate().getTime() <= currentTime) {
            await this._setCanDrawLottery();
        } else {
            this._drawDate = new Date(dateOfDraw.getDate().getTime());
        }
    }

    private async _setCanDrawLottery(): Promise<void> {
        const walletPublicKey = (await firstValueFrom(this._blockChainService.publicKey$))!;
        const walletPublicKeyBytes = encode(walletPublicKey.toString());

        const accounts = await this._connection!.getProgramAccounts(
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
