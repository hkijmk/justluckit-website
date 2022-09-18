import { Component, OnInit } from '@angular/core';
import { Connection, PublicKey } from '@solana/web3.js';
import { deserialize } from 'borsh';
import { firstValueFrom } from 'rxjs';

import { WalletService } from '../../../services/wallet.service';

import { BLOCK_CHAIN_KEYS } from '../../../constants';
import { LastWeekLumpModel, NumberOfWinners, WinningAmountsModel, WinningNumbers } from '../../../models';
import { RecordModel } from '../../../modules/play-module/models';

@Component({
    selector: 'last-draw-results',
    templateUrl: './last-draw-results.component.html',
    styleUrls: ['./last-draw-results.component.scss']
})
export class LastDrawResultsComponent implements OnInit {
    private _winningNumbers?: number[];
    private _numberOfWinners?: NumberOfWinners;
    private _winningAmounts?: WinningAmountsModel;

    get winningNumbers(): number[] | undefined {
        return this._winningNumbers;
    }

    get numberOfWinners(): NumberOfWinners | undefined {
        return this._numberOfWinners;
    }

    get winningAmounts(): WinningAmountsModel | undefined {
        return this._winningAmounts;
    }

    constructor(private _walletService: WalletService) {
    }

    ngOnInit(): void {
        this._getLastDrawResults();
    }

    private async _getLastDrawResults(): Promise<void> {
        const connection: Connection | null = await firstValueFrom(this._walletService.connection$);
        if (connection === null) {
            return;
        }

        const recordBuffer = await connection.getAccountInfo(BLOCK_CHAIN_KEYS.record);
        const record = deserialize(RecordModel.getSchema(), RecordModel, recordBuffer!.data);
        const week = record.week;

        const lastWeekProgramAddress = await PublicKey.findProgramAddress(
            [
                Buffer.from("lastweek"),
                Buffer.from(week.toString()),
            ],
            BLOCK_CHAIN_KEYS.programId,
        );

        const lastWeekLumpBuffer = await connection.getAccountInfo(lastWeekProgramAddress[0]);
        const lastWeekLump = deserialize(LastWeekLumpModel.getSchema(), LastWeekLumpModel, lastWeekLumpBuffer!.data);

        const winningAmountsProgramAddress = await PublicKey.findProgramAddress(
            [
                Buffer.from("dist"),
                Buffer.from(week.toString()),
            ],
            BLOCK_CHAIN_KEYS.programId,
        );

        const winningAmountsBuffer = await connection.getAccountInfo(winningAmountsProgramAddress[0]);
        this._winningAmounts = deserialize(WinningAmountsModel.getSchema(), WinningAmountsModel, winningAmountsBuffer!.data);

        const numberOfWinnersProgramAddress = await PublicKey.findProgramAddress(
            [
                Buffer.from("numberof"),
                Buffer.from(week.toString()),
            ],
            BLOCK_CHAIN_KEYS.programId,);

        const numberOfWinnersBuffer = await connection.getAccountInfo(numberOfWinnersProgramAddress[0]);
        this._numberOfWinners = deserialize(NumberOfWinners.getSchema(), NumberOfWinners, numberOfWinnersBuffer!.data);

        const winningNumbersProgramAddress = await PublicKey.findProgramAddress(
            [
                Buffer.from("winnumbers"),
                Buffer.from(week.toString()),
            ],
            BLOCK_CHAIN_KEYS.programId,
        );

        const winningNumbersBuffer = await connection.getAccountInfo(winningNumbersProgramAddress[0]);
        const winningNumbers = deserialize(WinningNumbers.getSchema(), WinningNumbers, winningNumbersBuffer!.data);

        this._winningNumbers = winningNumbers.getWinningNumbersAsArray();

        // //ikramiyeler bilen yoksa sıfır olarak görünür
        console.log("carryover = ", lastWeekLump.amount.toString());
    }
}
