import * as BN from 'bn.js';

import { BlockChainSchemaType } from '../../types';

import { DirectorModel } from './director.model';
import { LastDrawResultsModel } from './last-draw-results.model';

export class MainScreenInfoModel implements IMainScreenInfoModel {
    weekNumber: number;
    number1: number;
    number2: number;
    number3: number;
    number4: number;
    number5: number;
    number6: number;
    threeWinnersCountBN: BN;
    fourWinnersCountBN: BN;
    fiveWinnersCountBN: BN;
    sixWinnersCount: number;
    threeWinnersRewardBN: BN;
    fourWinnersRewardBN: BN;
    fiveWinnersRewardBN: BN;
    sixWinnersRewardBN: BN;
    timeToLottoBN: BN;
    drawRewardBN: BN;
    drawRewardDividedTo: number;
    carryOverBN: BN;
    directorStage: number;
    directorReady: number;
    distributionNumberThree: number;
    distributionNumberFour: number;
    distributionNumberFive: number;

    get director(): DirectorModel {
        return new DirectorModel({
            stage: this.directorStage,
            ready: this.directorReady,
        });
    }

    get lastDrawResults(): LastDrawResultsModel {
        return new LastDrawResultsModel({
            number1: this.number1,
            number2: this.number2,
            number3: this.number3,
            number4: this.number4,
            number5: this.number5,
            number6: this.number6,
            threeWinnersCountBN: this.threeWinnersCountBN,
            fourWinnersCountBN: this.fourWinnersCountBN,
            fiveWinnersCountBN: this.fiveWinnersCountBN,
            sixWinnersCount: this.sixWinnersCount,
            threeWinnersRewardBN: this.threeWinnersRewardBN,
            fourWinnersRewardBN: this.fourWinnersRewardBN,
            fiveWinnersRewardBN: this.fiveWinnersRewardBN,
            sixWinnersRewardBN: this.sixWinnersRewardBN,
            drawRewardBN: this.drawRewardBN,
            drawRewardDividedTo: this.drawRewardDividedTo,
            carryOverBN: this.carryOverBN,
        });
    }

    constructor(obj: IMainScreenInfoModel) {
        this.weekNumber = obj.weekNumber;
        this.number1 = obj.number1;
        this.number2 = obj.number2;
        this.number3 = obj.number3;
        this.number4 = obj.number4;
        this.number5 = obj.number5;
        this.number6 = obj.number6;
        this.threeWinnersCountBN = obj.threeWinnersCountBN;
        this.fourWinnersCountBN = obj.fourWinnersCountBN;
        this.fiveWinnersCountBN = obj.fiveWinnersCountBN;
        this.sixWinnersCount = obj.sixWinnersCount;
        this.threeWinnersRewardBN = obj.threeWinnersRewardBN;
        this.fourWinnersRewardBN = obj.fourWinnersRewardBN;
        this.fiveWinnersRewardBN = obj.fiveWinnersRewardBN;
        this.sixWinnersRewardBN = obj.sixWinnersRewardBN;
        this.timeToLottoBN = obj.timeToLottoBN;
        this.drawRewardBN = obj.drawRewardBN;
        this.drawRewardDividedTo = obj.drawRewardDividedTo;
        this.carryOverBN = obj.carryOverBN;
        this.directorStage = obj.directorStage;
        this.directorReady = obj.directorReady;
        this.distributionNumberThree = obj.distributionNumberThree;
        this.distributionNumberFour = obj.distributionNumberFour;
        this.distributionNumberFive = obj.distributionNumberFive;
    }

    static getSchema(): BlockChainSchemaType<typeof MainScreenInfoModel> {
        return new Map([
            [
                MainScreenInfoModel,
                {
                    kind: "struct",
                    fields: [
                        ["weekNumber", "u16"],
                        ["number1", "u8"],
                        ["number2", "u8"],
                        ["number3", "u8"],
                        ["number4", "u8"],
                        ["number5", "u8"],
                        ["number6", "u8"],
                        ["threeWinnersCountBN", "u64"],
                        ["fourWinnersCountBN", "u64"],
                        ["fiveWinnersCountBN", "u64"],
                        ["sixWinnersCount", "u16"],
                        ["threeWinnersRewardBN", "u64"],
                        ["fourWinnersRewardBN", "u64"],
                        ["fiveWinnersRewardBN", "u64"],
                        ["sixWinnersRewardBN", "u64"],
                        ["timeToLottoBN", "u64"],
                        ["drawRewardBN", "u64"],
                        ["drawRewardDividedTo", "u16"],
                        ["carryOverBN", "u64"],
                        ["directorStage", "u8"],
                        ["directorReady", "u8"],
                        ["distributionNumberThree", "u16"],
                        ["distributionNumberFour", "u16"],
                        ["distributionNumberFive", "u16"],
                    ],
                },
            ],
        ]);
    }
}

export interface IMainScreenInfoModel {
    weekNumber: number;
    number1: number;
    number2: number;
    number3: number;
    number4: number;
    number5: number;
    number6: number;
    threeWinnersCountBN: BN;
    fourWinnersCountBN: BN;
    fiveWinnersCountBN: BN;
    sixWinnersCount: number;
    threeWinnersRewardBN: BN;
    fourWinnersRewardBN: BN;
    fiveWinnersRewardBN: BN;
    sixWinnersRewardBN: BN;
    timeToLottoBN: BN;
    drawRewardBN: BN;
    drawRewardDividedTo: number;
    carryOverBN: BN;
    directorStage: number;
    directorReady: number;
    distributionNumberThree: number;
    distributionNumberFour: number;
    distributionNumberFive: number;
}
