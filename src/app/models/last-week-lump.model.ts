import * as BN from 'bn.js';

import { BlockChainSchemaType } from '../types';

export class LastWeekLumpModel implements ILastWeekLumpModel {
    isInit: number;
    amountBN: BN;
    weekNumber: number;

    get amount(): number {
        return this.amountBN.toNumber();
    }

    constructor(obj: ILastWeekLumpModel) {
        this.isInit = obj.isInit;
        this.amountBN = obj.amountBN;
        this.weekNumber = obj.weekNumber;
    }

    static getSchema(): BlockChainSchemaType<typeof LastWeekLumpModel> {
        return new Map([
            [
                LastWeekLumpModel,
                {
                    kind: "struct",
                    fields: [
                        ["isInit", "u8"],
                        ["amountBN", "u64"],
                        ["weekNumber", "u16"],
                    ],
                },
            ],
        ]);
    }
}

export interface ILastWeekLumpModel {
    isInit: number;
    amountBN: BN;
    weekNumber: number;
}
