import * as BN from 'bn.js';

import { BlockChainSchemaType } from '../types';

export class NumberOfWinners implements INumberOfWinners {
    threeMatchersCount: BN;
    fourMatchersCount: BN;
    fiveMatchersCount: BN;
    sixMatchersCount: number;
    weekNumber: number;

    constructor(obj: INumberOfWinners) {
        this.threeMatchersCount = obj.threeMatchersCount;
        this.fourMatchersCount = obj.fourMatchersCount;
        this.fiveMatchersCount = obj.fiveMatchersCount;
        this.sixMatchersCount = obj.sixMatchersCount;
        this.weekNumber = obj.weekNumber;
    }

    static getSchema(): BlockChainSchemaType<typeof NumberOfWinners> {
        return new Map([
            [
                NumberOfWinners,
                {
                    kind: "struct",
                    fields: [
                        ["threeMatchersCount", "u64"],
                        ["fourMatchersCount", "u64"],
                        ["fiveMatchersCount", "u64"],
                        ["sixMatchersCount", "u16"],
                        ["weekNumber", "u16"],
                    ],
                },
            ],
        ]);
    }
}

export interface INumberOfWinners {
    threeMatchersCount: BN;
    fourMatchersCount: BN;
    fiveMatchersCount: BN;
    sixMatchersCount: number;
    weekNumber: number;
}
