import { Component, OnInit } from '@angular/core';
import { Connection, PublicKey } from '@solana/web3.js';
import { deserialize } from 'borsh';
import { firstValueFrom } from 'rxjs';

import { BlockChainService } from '../../../services/block-chain.service';

import { BLOCK_CHAIN_KEYS } from '../../../constants';
import { LastWeekLumpModel, NumberOfWinners, RecordModel, WinningAmountsModel, WinningNumbers } from '../../../models';

@Component({
    selector: 'last-draw-results',
    templateUrl: './last-draw-results.component.html',
    styleUrls: ['./last-draw-results.component.scss']
})
export class LastDrawResultsComponent implements OnInit {
    private _winningNumbers?: number[];
    private _numberOfWinners?: NumberOfWinners;
    private _winningAmounts?: WinningAmountsModel;
    private _lastWeekLump?: LastWeekLumpModel;
    private _isLoading: boolean = false;

    get isLoading(): boolean {
        return this._isLoading;
    }

    get winningNumbers(): number[] | undefined {
        return this._winningNumbers;
    }

    get numberOfWinners(): NumberOfWinners | undefined {
        return this._numberOfWinners;
    }

    get winningAmounts(): WinningAmountsModel | undefined {
        return this._winningAmounts;
    }

    get lastWeekLump(): LastWeekLumpModel | undefined {
        return this._lastWeekLump;
    }

    get lastWeekReward(): number {
        if (this._winningAmounts === undefined || this._numberOfWinners === undefined) {
            return 0;
        }

        const totalWinningAmount = this._winningAmounts!.threeMatchersAmount.toNumber() * this._numberOfWinners!.threeMatchersCount.toNumber() +
            this._winningAmounts!.fourMatchersAmount.toNumber() * this._numberOfWinners!.fourMatchersCount.toNumber() +
            this._winningAmounts!.fiveMatchersAmount.toNumber() * this._numberOfWinners!.fiveMatchersCount.toNumber() +
            this._winningAmounts!.sixMatchersAmount.toNumber() * this._numberOfWinners!.sixMatchersCount

        return totalWinningAmount / 1000000000;
    }

    constructor(private _blockChainService: BlockChainService) {
    }

    ngOnInit(): void {
        this._getLastDrawResults();
    }

    private async _getLastDrawResults(): Promise<void> {
        this._isLoading = true;

        const connection: Connection | null = await firstValueFrom(this._blockChainService.connection$);
        if (connection === null) {
            this._isLoading = false;
            return;
        }

        const recordBuffer = await connection.getAccountInfo(BLOCK_CHAIN_KEYS.record);
        const record = deserialize(RecordModel.getSchema(), RecordModel, recordBuffer!.data);
        const weekNumber = record.weekNumber - 1;

        await this._setLastWeekLump(connection, weekNumber);
        await this._setWinningAmounts(connection, weekNumber);
        await this._setNumberOfWinners(connection, weekNumber);
        await this._setWinningNumbers(connection, weekNumber);

        this._isLoading = false;
    }

    private async _setLastWeekLump(connection: Connection, weekNumber: number): Promise<void> {
        const lastWeekProgramAddress = await PublicKey.findProgramAddress(
            [
                Buffer.from("lastweek"),
                Buffer.from(weekNumber.toString()),
            ],
            BLOCK_CHAIN_KEYS.programId,
        );

        const lastWeekLumpBuffer = await connection.getAccountInfo(lastWeekProgramAddress[0]);
        this._lastWeekLump = deserialize(LastWeekLumpModel.getSchema(), LastWeekLumpModel, lastWeekLumpBuffer!.data);
    }

    private async _setWinningAmounts(connection: Connection, weekNumber: number): Promise<void> {
        const winningAmountsProgramAddress = await PublicKey.findProgramAddress(
            [
                Buffer.from("dist"),
                Buffer.from(weekNumber.toString()),
            ],
            BLOCK_CHAIN_KEYS.programId,
        );

        const winningAmountsBuffer = await connection.getAccountInfo(winningAmountsProgramAddress[0]);
        this._winningAmounts = deserialize(WinningAmountsModel.getSchema(), WinningAmountsModel, winningAmountsBuffer!.data);
    }

    private async _setNumberOfWinners(connection: Connection, weekNumber: number): Promise<void> {
        const numberOfWinnersProgramAddress = await PublicKey.findProgramAddress(
            [
                Buffer.from("numberof"),
                Buffer.from(weekNumber.toString()),
            ],
            BLOCK_CHAIN_KEYS.programId,);

        const numberOfWinnersBuffer = await connection.getAccountInfo(numberOfWinnersProgramAddress[0]);
        this._numberOfWinners = deserialize(NumberOfWinners.getSchema(), NumberOfWinners, numberOfWinnersBuffer!.data);
    }

    private async _setWinningNumbers(connection: Connection, weekNumber: number): Promise<void> {
        const winningNumbersProgramAddress = await PublicKey.findProgramAddress(
            [
                Buffer.from("winnumbers"),
                Buffer.from(weekNumber.toString()),
            ],
            BLOCK_CHAIN_KEYS.programId,
        );

        const winningNumbersBuffer = await connection.getAccountInfo(winningNumbersProgramAddress[0]);
        const winningNumbers = deserialize(WinningNumbers.getSchema(), WinningNumbers, winningNumbersBuffer!.data);

        this._winningNumbers = winningNumbers.getWinningNumbersAsArray();
    }
}
