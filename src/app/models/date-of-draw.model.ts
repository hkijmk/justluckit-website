import * as BN from 'bn.js';

import { BlockChainSchemaType } from '../types';

export class DateOfDrawModel implements IDateOfDrawModel {
    isInit: number;
    time: BN | undefined;

    constructor(obj?: IDateOfDrawModel) {
        this.isInit = obj?.isInit ?? 0;
        this.time = obj?.time ?? undefined;
    }

    static getSchema(): BlockChainSchemaType<typeof DateOfDrawModel> {
        return new Map([
            [
                DateOfDrawModel,
                {
                    kind: "struct",
                    fields: [
                        ["isInit", "u8"],
                        ["time", "u64"],
                    ],
                },
            ],
        ]);
    }

    getDate(): Date {
        if (this.time === undefined) {
            return new Date();
        }

        return new Date(this.time.toNumber() * 1000);
    }
}

export interface IDateOfDrawModel {
    isInit: number;
    time: BN | undefined;
}
