import { BlockChainSchemaType } from '../types';

export class RecordModel implements IRecordModel {
    isInit: number;
    weekNumber: number;
    mainCount: number;
    midCount: number;
    subCount: number;

    constructor(obj: IRecordModel) {
        this.isInit = obj.isInit;
        this.weekNumber = obj.weekNumber;
        this.mainCount = obj.mainCount;
        this.midCount = obj.midCount;
        this.subCount = obj.subCount;
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
                        ["mainCount", "u8"],
                        ["midCount", "u8"],
                        ["subCount", "u8"],
                    ],
                },
            ],
        ]);
    }
}

export interface IRecordModel {
    isInit: number;
    weekNumber: number;
    mainCount: number;
    midCount: number;
    subCount: number;
}
