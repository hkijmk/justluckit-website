import { BlockChainSchemaType } from '../types';

export class LotteryModel implements ILotteryModel {
    isInit: number = 0;
    call: number = 0;
    randomness: string = "DmmcFwtXfF1DUH8dh4yrFzjqecTUYPqqeNzSnnfUTVht";
    r43: number = 0;
    shouldCall: number = 0;

    constructor(obj: ILotteryModel) {
        this.isInit = obj.isInit;
        this.call = obj.call;
        this.randomness = obj.randomness;
        this.r43 = obj.r43;
        this.shouldCall = obj.shouldCall;
    }

    static getSchema(): BlockChainSchemaType<typeof LotteryModel> {
        return new Map([
            [
                LotteryModel,
                {
                    kind: "struct",
                    fields: [
                        ["isInit", "u8"],
                        ["call", "u16"],
                        ["randomness", "String"],
                        ["r43", "u8"],
                        ["shouldCall", "u16"],

                    ],
                },
            ],
        ]);
    }
}

export interface ILotteryModel {
    isInit: number;
    call: number;
    randomness: string;
    r43: number;
    shouldCall: number;
}
