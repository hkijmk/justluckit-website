import { BlockChainSchemaType } from '../types';

export class MainCounterModel implements IMainCounterModel {
    counterNumber: number;
    weekNumber: number;
    numberOfMidCounters: number;
    numberOfMidCountersCalculated: number;

    constructor(obj: IMainCounterModel) {
        this.counterNumber = obj.counterNumber;
        this.weekNumber = obj.weekNumber;
        this.numberOfMidCounters = obj.numberOfMidCounters;
        this.numberOfMidCountersCalculated = obj.numberOfMidCountersCalculated;
    }

    static getSchema(): BlockChainSchemaType<typeof MainCounterModel> {
        return new Map([
            [
                MainCounterModel,
                {
                    kind: "struct",
                    fields: [
                        ["counterNumber", "u8"],
                        ["weekNumber", "u16"],
                        ["numberOfMidCounters", "u8"],
                        ["numberOfMidCountersCalculated", "u8"],
                    ],
                },
            ],
        ]);
    }
}

export interface IMainCounterModel {
    counterNumber: number;
    weekNumber: number;
    numberOfMidCounters: number;
    numberOfMidCountersCalculated: number;
}
