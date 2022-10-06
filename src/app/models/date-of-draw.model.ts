import * as BN from 'bn.js';

import { BlockChainSchemaType } from '../types';

export class DateOfDrawModel implements IDateOfDrawModel {
    isInit: number;
    drawDateBN: BN;

    get drawDate(): Date {
        return new Date(this.drawDateBN.toNumber() * 1000);
    }

    constructor(obj: IDateOfDrawModel) {
        this.isInit = obj.isInit;
        this.drawDateBN = obj.drawDateBN;
    }

    static getSchema(): BlockChainSchemaType<typeof DateOfDrawModel> {
        return new Map([
            [
                DateOfDrawModel,
                {
                    kind: "struct",
                    fields: [
                        ["isInit", "u8"],
                        ["drawDateBN", "u64"],

                    ],
                },
            ],
        ]);
    }
}

export interface IDateOfDrawModel {
    isInit: number;
    drawDateBN: BN;
}
