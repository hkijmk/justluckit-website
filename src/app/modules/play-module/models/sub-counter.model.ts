import { BlockChainSchemaType } from '../../../types';

export class SubCounterModel implements ISubCounterModel {
    threeWinnersCount: number;
    fourWinnersCount: number;
    fiveWinnersCount: number;
    sixWinnersCount: number;
    counter: number;
    numberOfSeries: number;
    belongsToController: number;
    belongsToMainCountNumber: number;
    belongsToMidCountNumber: number;
    isCollectedData: number;

    constructor(obj: ISubCounterModel) {
        this.threeWinnersCount = obj.threeWinnersCount;
        this.fourWinnersCount = obj.fourWinnersCount;
        this.fiveWinnersCount = obj.fiveWinnersCount;
        this.sixWinnersCount = obj.sixWinnersCount;
        this.counter = obj.counter;
        this.numberOfSeries = obj.numberOfSeries;
        this.belongsToController = obj.belongsToController;
        this.belongsToMainCountNumber = obj.belongsToMainCountNumber;
        this.belongsToMidCountNumber = obj.belongsToMidCountNumber;
        this.isCollectedData = obj.isCollectedData;
    }

    static toSchema(): BlockChainSchemaType<typeof SubCounterModel> {
        return new Map([
            [
                SubCounterModel,
                {
                    kind: "struct",
                    fields: [
                        ["threeWinnersCount", "u64"],
                        ["fourWinnersCount", "u64"],
                        ["fiveWinnersCount", "u64"],
                        ["sixWinnersCount", "u16"],
                        ["counter", "u16"],
                        ["numberOfSeries", "u8"],
                        ["belongsToController", "u8"],
                        ["belongsToMainCountNumber", "u8"],
                        ["belongsToMidCountNumber", "u8"],
                        ["isCollectedData", "u8"],
                    ],
                },
            ],
        ]);
    }
}

export interface ISubCounterModel {
    threeWinnersCount: number;
    fourWinnersCount: number;
    fiveWinnersCount: number;
    sixWinnersCount: number;
    counter: number;
    numberOfSeries: number;
    belongsToController: number;
    belongsToMainCountNumber: number;
    belongsToMidCountNumber: number;
    isCollectedData: number;
}
