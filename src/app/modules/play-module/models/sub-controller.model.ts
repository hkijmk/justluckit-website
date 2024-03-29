import { BlockChainSchemaType } from '../../../types';

export class SubControllerModel implements ISubControllerModel {
    threeWinnersCount: number;
    fourWinnersCount: number;
    fiveWinnersCount: number;
    sixWinnersCount: number;
    numberOfSeries: number;
    counterNumber: number;
    belongsToMainCountNumber: number;
    belongsToMidCountNumber: number;
    isCollectedData: number;
    randomness: string;
    r43: number;

    constructor(obj: ISubControllerModel) {
        this.threeWinnersCount = obj.threeWinnersCount;
        this.fourWinnersCount = obj.fourWinnersCount;
        this.fiveWinnersCount = obj.fiveWinnersCount;
        this.sixWinnersCount = obj.sixWinnersCount;
        this.numberOfSeries = obj.numberOfSeries;
        this.counterNumber = obj.counterNumber;
        this.belongsToMainCountNumber = obj.belongsToMainCountNumber;
        this.belongsToMidCountNumber = obj.belongsToMidCountNumber;
        this.isCollectedData = obj.isCollectedData;
        this.randomness = obj.randomness;
        this.r43 = obj.r43;
    }

    static getSchema(): BlockChainSchemaType<typeof SubControllerModel> {
        return new Map([
            [
                SubControllerModel,
                {
                    kind: "struct",
                    fields: [
                        ["threeWinnersCount", "u64"],
                        ["fourWinnersCount", "u64"],
                        ["fiveWinnersCount", "u64"],
                        ["sixWinnersCount", "u16"],
                        ["numberOfSeries", "u8"],
                        ["counterNumber", "u8"],
                        ["belongsToMainCountNumber", "u8"],
                        ["belongsToMidCountNumber", "u8"],
                        ["isCollectedData", "u8"],
                        ["randomness", "String"],
                        ["r43", "u8"],
                    ],
                },
            ],
        ]);
    }
}

export interface ISubControllerModel {
    threeWinnersCount: number;
    fourWinnersCount: number;
    fiveWinnersCount: number;
    sixWinnersCount: number;
    numberOfSeries: number;
    counterNumber: number;
    belongsToMainCountNumber: number;
    belongsToMidCountNumber: number;
    isCollectedData: number;
    randomness: string;
    r43: number;
}
