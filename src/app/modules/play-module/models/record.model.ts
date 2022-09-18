import { BlockChainSchemaType } from '../../../types';

export class RecordModel implements IRecordModel {
    isInit: number;
    week: number;
    mainCountNumber: number;
    midCountNumber: number;
    subCountNumber: number;

    constructor(obj?: IRecordModel) {
        this.isInit = obj?.isInit ?? 0;
        this.week = obj?.week ?? 0;
        this.mainCountNumber = obj?.mainCountNumber ?? 0;
        this.midCountNumber = obj?.midCountNumber ?? 0;
        this.subCountNumber = obj?.subCountNumber ?? 0;
    }

    static getSchema(): BlockChainSchemaType<typeof RecordModel> {
        return new Map([
            [
                RecordModel,
                {
                    kind: "struct",
                    fields: [
                        ["isInit", "u8"],
                        ["week", "u16"],
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
    week: number;
    mainCountNumber: number;
    midCountNumber: number;
    subCountNumber: number;
}
