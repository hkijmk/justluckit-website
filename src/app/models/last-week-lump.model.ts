import { BlockChainSchemaType } from '../types';

export class LastWeekLumpModel implements ILastWeekLumpModel {
    isInit: number;
    amount: number;
    weekNumber: number;

    constructor(obj?: ILastWeekLumpModel) {
        this.isInit = obj?.isInit ?? 0;
        this.amount = obj?.amount ?? 0;
        this.weekNumber = obj?.weekNumber ?? 0;
    }

    static getSchema(): BlockChainSchemaType<typeof LastWeekLumpModel> {
        return new Map([
            [
                LastWeekLumpModel,
                {
                    kind: "struct",
                    fields: [
                        ["isInit", "u8"],
                        ["amount", "u64"],
                        ["weekNumber", "u16"],
                    ],
                },
            ],
        ]);
    }
}

export interface ILastWeekLumpModel {
    isInit: number;
    amount: number;
    weekNumber: number;
}
