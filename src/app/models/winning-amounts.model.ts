import * as BN from 'bn.js';

import { BlockChainSchemaType } from '../types';

export class WinningAmountsModel implements IWinningAmountsModel {
    threeMatchersAmount: BN;
    fourMatchersAmount: BN;
    fiveMatchersAmount: BN;
    sixMatchersAmount: BN;
    weekNumber: number;

    constructor(obj: IWinningAmountsModel) {
        this.threeMatchersAmount = obj?.threeMatchersAmount;
        this.fourMatchersAmount = obj?.fourMatchersAmount;
        this.fiveMatchersAmount = obj?.fiveMatchersAmount;
        this.sixMatchersAmount = obj?.sixMatchersAmount;
        this.weekNumber = obj?.weekNumber;
    }

    static getSchema(): BlockChainSchemaType<typeof WinningAmountsModel> {
        return new Map([
            [
                WinningAmountsModel,
                {
                    kind: "struct",
                    fields: [
                        ["threeMatchersAmount", "u64"],
                        ["fourMatchersAmount", "u64"],
                        ["fiveMatchersAmount", "u64"],
                        ["sixMatchersAmount", "u64"],
                        ["weekNumber", "u16"],
                    ],
                },
            ],
        ]);
    }
}

export interface IWinningAmountsModel {
    threeMatchersAmount: BN;
    fourMatchersAmount: BN;
    fiveMatchersAmount: BN;
    sixMatchersAmount: BN;
    weekNumber: number;
}
