import { BlockChainSchemaType } from '../types';

export class HowOftenModel implements IHowOftenModel {
    isInit: number;
    howOften: number;

    constructor(obj: IHowOftenModel) {
        this.isInit = obj.isInit;
        this.howOften = obj.howOften;
    }

    static getSchema(): BlockChainSchemaType<typeof HowOftenModel> {
        return new Map([
            [
                HowOftenModel,
                {
                    kind: "struct",
                    fields: [
                        ["isInit", "u8"],
                        ["howOften", "u64"],
                    ],
                },
            ],
        ]);
    }
}

export interface IHowOftenModel {
    isInit: number;
    howOften: number;
}
