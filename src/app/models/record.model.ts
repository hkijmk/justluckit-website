import { BlockChainSchemaType } from '../types';

export class RecordModel implements IRecordModel {
    isInit: number;
    weekNumber: number;
    mainCountNumber: number;
    midCountNumber: number;
    subCountNumber: number;

    constructor(obj: IRecordModel) {
        this.isInit = obj.isInit;
        this.weekNumber = obj.weekNumber;
        this.mainCountNumber = obj.mainCountNumber;
        this.midCountNumber = obj.midCountNumber;
        this.subCountNumber = obj.subCountNumber;
    }

    static getSchema(): BlockChainSchemaType<typeof RecordModel> {
        return new Map([
            [
                RecordModel,
                {
                    kind: "struct",
                    fields: [
                        ["isInit", "u8"],
                        ["weekNumber", "u16"],
                        ["mainCountNumber", "u8"],
                        ["midCountNumber", "u8"],
                        ["subCountNumber", "u8"],
                    ],
                },
            ],
        ]);
    }
}

export interface IRecordModel {
    isInit: number;
    weekNumber: number;
    mainCountNumber: number;
    midCountNumber: number;
    subCountNumber: number;
}
