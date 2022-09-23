import { BlockChainSchemaType } from '../types';

export class DirectorModel implements IDirectorModel {
    isInit: number;
    weekNumber: number;
    stage: number;
    ready: number;

    get currentStage(): number {
        return this.ready === 0 ? 0 : this.stage;
    }

    constructor(obj: IDirectorModel) {
        this.isInit = obj.isInit;
        this.weekNumber = obj.weekNumber;
        this.stage = obj.stage;
        this.ready = obj.ready;
    }

    static getSchema(): BlockChainSchemaType<typeof DirectorModel> {
        return new Map([
            [
                DirectorModel,
                {
                    kind: "struct",
                    fields: [
                        ["isInit", "u8"],
                        ["weekNumber", "u16"],
                        ["stage", "u8"],
                        ["ready", "u8"],
                    ],
                },
            ],
        ]);
    }

}

export interface IDirectorModel {
    isInit: number;
    weekNumber: number;
    stage: number;
    ready: number;
}
