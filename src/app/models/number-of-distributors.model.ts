import { BlockChainSchemaType } from '../types';

export class NumberOfDistributorsModel implements INumberOfDistributorsModel {
    currentLevelThreeNumber: number;
    remainingLevelTwo: number;
    remainingLevelOne: number;
    forDistribution: number;
    week: number;

    constructor(obj: INumberOfDistributorsModel) {
        this.currentLevelThreeNumber = obj.currentLevelThreeNumber;
        this.remainingLevelTwo = obj.remainingLevelTwo;
        this.remainingLevelOne = obj.remainingLevelOne;
        this.forDistribution = obj.forDistribution;
        this.week = obj.week;
    }

    static getSchema(): BlockChainSchemaType<typeof NumberOfDistributorsModel> {
        return new Map([
            [
                NumberOfDistributorsModel,
                {
                    kind: "struct",
                    fields: [
                        ["currentLevelThreeNumber", "u16"],
                        ["remainingLevelTwo", "u8"],
                        ["remainingLevelOne", "u8"],
                        ["forDistribution", "u8"],
                        ["week", "u16"],
                    ],
                },
            ],
        ]);
    }
}

export interface INumberOfDistributorsModel {
    currentLevelThreeNumber: number;
    remainingLevelTwo: number;
    remainingLevelOne: number;
    forDistribution: number;
    week: number;
}
