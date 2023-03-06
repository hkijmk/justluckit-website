import { Injectable } from '@angular/core';
import { Connection, PublicKey } from '@solana/web3.js';
import { deserialize } from 'borsh';

import { BLOCK_CHAIN_KEYS } from '../constants';
import { LastDrawResultsModel, MainScreenInfoModel, PoolInfo, RecordModel } from '../models';

@Injectable()
export class AppStateService {
    private _record?: RecordModel;
    private _mainScreenInfo?: MainScreenInfoModel;
    private _poolInfo?: PoolInfo;
    private _drawResultsPerWeekNumber: { [weekNumber: number]: LastDrawResultsModel | undefined } = {};

    get record(): RecordModel {
        return this._record!;
    }

    set record(value: RecordModel | undefined) {
        this._mainScreenInfo = undefined;
        this._record = value;
    }

    get poolInfo(): PoolInfo | undefined {
        return this._poolInfo;
    }

    get mainScreenInfo(): MainScreenInfoModel | undefined {
        return this._mainScreenInfo;
    }

    constructor() {
    }

    initMainScreenInfo(value: MainScreenInfoModel): void {
        this._mainScreenInfo = value;
    }

    initPoolInfo(value: PoolInfo): void {
        this._poolInfo = value;
    }

    async getMainScreenInfo(connection: Connection, weekNumber: number): Promise<MainScreenInfoModel | undefined> {
        const mainScreenInfoProgram = PublicKey.findProgramAddressSync([
                Buffer.from("interface"),
                Buffer.from((weekNumber).toString()),
            ],
            BLOCK_CHAIN_KEYS.programId,
        );

        const mainScreenInfoBuffer = await connection.getAccountInfo(mainScreenInfoProgram[0]);
        if (!mainScreenInfoBuffer) {
            return;
        }


        const mainScreenInfo = deserialize(MainScreenInfoModel.getSchema(), MainScreenInfoModel, mainScreenInfoBuffer!.data);
        this._drawResultsPerWeekNumber[weekNumber] = mainScreenInfo.lastDrawResults;

        return mainScreenInfo;
    }

    getDrawResultPerWeek(weekNumber: number): LastDrawResultsModel | undefined {
        return this._drawResultsPerWeekNumber[weekNumber];
    }
}
