import * as BN from 'bn.js';

import { BlockChainSchemaType } from '../types';

export class CalculatedDistributionModel implements ICalculatedDistributionModel {
    weekNumber: number;
    sq3BN: BN;
    sq4BN: BN;
    sq5BN: BN;
    createdThreeWinnerSubDistributorCount: number;
    createdFourWinnerSubDistributorCount: number;
    createdFiveWinnerSubDistributorCount: number;
    createdSixWinnerSubDistributorCount: number;
    requiredThreeWinnerSubDistributorCount: number;
    requiredFourWinnerSubDistributorCount: number;
    requiredFiveWinnerSubDistributorCount: number;

    constructor(obj: ICalculatedDistributionModel) {
        this.weekNumber = obj.weekNumber;
        this.sq3BN = obj.sq3BN;
        this.sq4BN = obj.sq4BN;
        this.sq5BN = obj.sq5BN;
        this.createdThreeWinnerSubDistributorCount = obj.createdThreeWinnerSubDistributorCount;
        this.createdFourWinnerSubDistributorCount = obj.createdFourWinnerSubDistributorCount;
        this.createdFiveWinnerSubDistributorCount = obj.createdFiveWinnerSubDistributorCount;
        this.createdSixWinnerSubDistributorCount = obj.createdSixWinnerSubDistributorCount;
        this.requiredThreeWinnerSubDistributorCount = obj.requiredThreeWinnerSubDistributorCount;
        this.requiredFourWinnerSubDistributorCount = obj.requiredFourWinnerSubDistributorCount;
        this.requiredFiveWinnerSubDistributorCount = obj.requiredFiveWinnerSubDistributorCount;
    }

    static getSchema(): BlockChainSchemaType<typeof CalculatedDistributionModel> {
        return new Map([
            [
                CalculatedDistributionModel,
                {
                    kind: "struct",
                    fields: [
                        ["weekNumber", "u16"],
                        ["sq3BN", "u64"],
                        ["sq4BN", "u64"],
                        ["sq5BN", "u64"],
                        ["numberthree", "u16"],
                        ["numberfour", "u16"],
                        ["numberfive", "u16"],
                        ["numbersix", "u8"],
                        ["dist_three", "u16"],
                        ["dist_four", "u16"],
                        ["dist_five", "u16"],
                    ],
                },
            ],
        ]);
    }
}

export interface ICalculatedDistributionModel {
    weekNumber: number;
    sq3BN: BN;
    sq4BN: BN;
    sq5BN: BN;
    createdThreeWinnerSubDistributorCount: number;
    createdFourWinnerSubDistributorCount: number;
    createdFiveWinnerSubDistributorCount: number;
    createdSixWinnerSubDistributorCount: number;
    requiredThreeWinnerSubDistributorCount: number;
    requiredFourWinnerSubDistributorCount: number;
    requiredFiveWinnerSubDistributorCount: number;
}
