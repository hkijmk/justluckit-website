import { BlockChainSchemaType } from '../../../types';

export class SubCounterModel implements ISubCounterModel {
    numberofthreewinners: number;
    numberoffourwinners: number;
    numberoffivewinners: number;
    numberofsixwinners: number;
    counter: number;
    serialno: number;
    belongtoctrller: number;
    belongtomcno: number;
    belongtomidno: number;
    icollecteddata: number;

    constructor(obj?: ISubCounterModel) {
        this.numberofthreewinners = obj?.numberofthreewinners ?? 0;
        this.numberoffourwinners = obj?.numberoffourwinners ?? 0;
        this.numberoffivewinners = obj?.numberoffivewinners ?? 0;
        this.numberofsixwinners = obj?.numberofsixwinners ?? 0;
        this.counter = obj?.counter ?? 0;
        this.serialno = obj?.serialno ?? 0;
        this.belongtoctrller = obj?.belongtoctrller ?? 0;
        this.belongtomcno = obj?.belongtomcno ?? 0;
        this.belongtomidno = obj?.belongtomidno ?? 0;
        this.icollecteddata = obj?.icollecteddata ?? 0;
    }

    static toSchema(): BlockChainSchemaType<typeof SubCounterModel> {
        return new Map([
            [
                SubCounterModel,
                {
                    kind: "struct",
                    fields: [
                        ["numberofthreewinners", "u64"],
                        ["numberoffourwinners", "u64"],
                        ["numberoffivewinners", "u64"],
                        ["numberofsixwinners", "u16"],
                        ["counter", "u16"],
                        ["serialno", "u8"],
                        ["belongtoctrller", "u8"],
                        ["belongtomcno", "u8"],
                        ["belongtomidno", "u8"],
                        ["icollecteddata", "u8"],
                    ],
                },
            ],
        ]);
    }
}

export interface ISubCounterModel {
    numberofthreewinners: number;
    numberoffourwinners: number;
    numberoffivewinners: number;
    numberofsixwinners: number;
    counter: number;
    serialno: number;
    belongtoctrller: number;
    belongtomcno: number;
    belongtomidno: number;
    icollecteddata: number;
}
