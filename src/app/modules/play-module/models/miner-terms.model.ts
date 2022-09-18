import { BlockChainSchemaType } from '../../../types';

export class MinerTermsModel implements IMinerTermsModel {
    is_init: number;
    new_minersfee: number;
    old_minersfee: number;
    apply_after: number;
    minerhold: number;
    rent: number;
    shouldplay: number;

    constructor(obj?: IMinerTermsModel) {
        this.is_init = obj?.is_init ?? 0;
        this.new_minersfee = obj?.new_minersfee ?? 0;
        this.old_minersfee = obj?.old_minersfee ?? 0;
        this.apply_after = obj?.apply_after ?? 0;
        this.minerhold = obj?.minerhold ?? 0;
        this.rent = obj?.rent ?? 0;
        this.shouldplay = obj?.shouldplay ?? 0;
    }

    static toSchema(): BlockChainSchemaType<typeof MinerTermsModel> {
        return new Map([
            [
                MinerTermsModel,
                {
                    kind: "struct",
                    fields: [
                        ["is_init", "u8"],
                        ["new_minersfee", "u64"],
                        ["old_minersfee", "u64"],
                        ["apply_after", "u16"],
                        ["minerhold", "u64"],
                        ["rent", "u64"],
                        ["shouldplay", "u8"]
                    ],
                },
            ],
        ]);
    }
}

export interface IMinerTermsModel {
    is_init: number;
    new_minersfee: number;
    old_minersfee: number;
    apply_after: number;
    minerhold: number;
    rent: number;
    shouldplay: number;
}
