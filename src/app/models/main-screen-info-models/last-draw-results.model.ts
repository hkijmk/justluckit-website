import * as BN from 'bn.js';

export class LastDrawResultsModel implements ILastDrawResultsModel {
    private static readonly _WINNING_AMOUNT_DIVIDER = 1000000000;

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
    drawRewardBN: BN;
    drawRewardDividedTo: number;
    carryOverBN: BN;

    get totalReward(): number {
        const totalWinningAmount = this.threeWinnersRewardBN.toNumber() * this.threeWinnersCountBN.toNumber() +
            this.fourWinnersRewardBN.toNumber() * this.fourWinnersCountBN.toNumber() +
            this.fiveWinnersRewardBN.toNumber() * this.fiveWinnersCountBN.toNumber() +
            this.sixWinnersRewardBN.toNumber() * this.sixWinnersCount

        return totalWinningAmount / LastDrawResultsModel._WINNING_AMOUNT_DIVIDER;
    }

    get carryOver(): number {
        return this.carryOverBN.toNumber() / LastDrawResultsModel._WINNING_AMOUNT_DIVIDER;
    }

    get winningNumbers(): number[] {
        return [this.number1, this.number2, this.number3, this.number4, this.number5, this.number6].sort((numberA, numberB) => numberA > numberB ? 1 : -1);
    }

    get threeWinnersCount(): number {
        return this.threeWinnersCountBN.toNumber();
    }

    get fourWinnersCount(): number {
        return this.fourWinnersCountBN.toNumber();
    }

    get fiveWinnersCount(): number {
        return this.fiveWinnersCountBN.toNumber();
    }

    get threeWinnersReward(): number {
        return this.threeWinnersRewardBN.toNumber() / LastDrawResultsModel._WINNING_AMOUNT_DIVIDER;
    }

    get fourWinnersReward(): number {
        return this.fourWinnersRewardBN.toNumber() / LastDrawResultsModel._WINNING_AMOUNT_DIVIDER;
    }

    get fiveWinnersReward(): number {
        return this.fiveWinnersRewardBN.toNumber() / LastDrawResultsModel._WINNING_AMOUNT_DIVIDER;
    }

    get sixWinnersReward(): number {
        return this.sixWinnersRewardBN.toNumber() / LastDrawResultsModel._WINNING_AMOUNT_DIVIDER;
    }

    constructor(obj: ILastDrawResultsModel) {
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
        this.drawRewardBN = obj.drawRewardBN;
        this.drawRewardDividedTo = obj.drawRewardDividedTo;
        this.carryOverBN = obj.carryOverBN;
    }
}

export interface ILastDrawResultsModel {
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
    drawRewardBN: BN;
    drawRewardDividedTo: number;
    carryOverBN: BN;
}
