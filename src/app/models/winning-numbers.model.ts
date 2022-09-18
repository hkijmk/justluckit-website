import { BlockChainSchemaType } from '../types';

export class WinningNumbers implements IWinningNumbers {
    isInit: number;
    number1: number;
    number2: number;
    number3: number;
    number4: number;
    number5: number;
    number6: number;
    weekNumber: number;

    constructor(obj?: IWinningNumbers) {
        this.isInit = obj?.isInit ?? 0;
        this.number1 = obj?.number1 ?? 0;
        this.number2 = obj?.number2 ?? 0;
        this.number3 = obj?.number3 ?? 0;
        this.number4 = obj?.number4 ?? 0;
        this.number5 = obj?.number5 ?? 0;
        this.number6 = obj?.number6 ?? 0;
        this.weekNumber = obj?.weekNumber ?? 0;
    }

    static getSchema(): BlockChainSchemaType<typeof WinningNumbers> {
        return new Map([
            [
                WinningNumbers,
                {
                    kind: "struct",
                    fields: [
                        ["isInit", "u8"],
                        ["number1", "u8"],
                        ["number2", "u8"],
                        ["number3", "u8"],
                        ["number4", "u8"],
                        ["number5", "u8"],
                        ["number6", "u8"],
                        ["weekNumber", "u16"],
                    ],
                },
            ],
        ]);
    }

    getWinningNumbersAsArray(): number[] {
        return [this.number1, this.number2, this.number3, this.number4, this.number5, this.number6];
    }
}

export interface IWinningNumbers {
    isInit: number;
    number1: number;
    number2: number;
    number3: number;
    number4: number;
    number5: number;
    number6: number;
    weekNumber: number;
}
