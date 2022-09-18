import { BlockChainSchemaType } from '../../../types';

export class TermOneModel implements ITermOneModel {
    is_init: number;
    new_demand: number;
    old_demand: number;
    apply_after_t: number;
    new_hostfee: number;
    old_hostfee: number;
    apply_after_h: number;
    rent: number;

    constructor(obj?: ITermOneModel) {
        this.is_init = obj?.is_init ?? 0;
        this.new_demand = obj?.new_demand ?? 0;
        this.old_demand = obj?.old_demand ?? 0;
        this.apply_after_t = obj?.apply_after_t ?? 0;
        this.new_hostfee = obj?.new_hostfee ?? 0;
        this.old_hostfee = obj?.old_hostfee ?? 0;
        this.apply_after_h = obj?.apply_after_h ?? 0;
        this.rent = obj?.rent ?? 0;
    }

    static toSchema(): BlockChainSchemaType<typeof TermOneModel> {
        return new Map([
            [
                TermOneModel,
                {
                    kind: "struct",
                    fields: [
                        ["is_init", "u8"],
                        ["new_demand", "u64"],
                        ["old_demand", "u64"],
                        ["apply_after_t", "u16"],
                        ["new_hostfee", "u64"],
                        ["old_hostfee", "u64"],
                        ["apply_after_h", "u16"],
                        ["rent", "u64"],
                    ],
                },
            ],
        ]);
    }
}

export interface ITermOneModel {
    is_init: number;
    new_demand: number;
    old_demand: number;
    apply_after_t: number;
    new_hostfee: number;
    old_hostfee: number;
    apply_after_h: number;
    rent: number;
}
