import { BlockChainSchemaType } from '../../../types';

export class SubControllerModel implements ISubControllerModel {
    numberofthreewinners: number;
    numberoffourwinners: number;
    numberoffivewinners: number;
    numberofsixwinners: number;
    number_of_series: number;
    counterno: number;
    belongtomcno: number;
    belongtomidno: number;
    icollecteddata: number;
    randomness: string;
    r43: number;

    constructor(obj?: ISubControllerModel) {
        this.numberofthreewinners = obj?.numberofthreewinners ?? 0;
        this.numberoffourwinners = obj?.numberoffourwinners ?? 0;
        this.numberoffivewinners = obj?.numberoffivewinners ?? 0;
        this.numberofsixwinners = obj?.numberofsixwinners ?? 0;
        this.number_of_series = obj?.number_of_series ?? 0;
        this.counterno = obj?.counterno ?? 0;
        this.belongtomcno = obj?.belongtomcno ?? 0;
        this.belongtomidno = obj?.belongtomidno ?? 0;
        this.icollecteddata = obj?.icollecteddata ?? 0;
        this.randomness = obj?.randomness ?? "4YbLBRXwseG1NuyJbteSD5u81Q2QjFqJBp6JmxwYBKYm";
        this.r43 = obj?.r43 ?? 0;
    }

    static getSchema(): BlockChainSchemaType<typeof SubControllerModel> {
        return new Map([
            [
                SubControllerModel,
                {
                    kind: "struct",
                    fields: [
                        ["numberofthreewinners", "u64"],
                        ["numberoffourwinners", "u64"],
                        ["numberoffivewinners", "u64"],
                        ["numberofsixwinners", "u16"],
                        ["number_of_series", "u8"],
                        ["counterno", "u8"],
                        ["belongtomcno", "u8"],
                        ["belongtomidno", "u8"],
                        ["icollecteddata", "u8"],
                        ["randomness", "String"],
                        ["r43", "u8"],
                    ],
                },
            ],
        ]);
    }
}

export interface ISubControllerModel {
    numberofthreewinners: number;
    numberoffourwinners: number;
    numberoffivewinners: number;
    numberofsixwinners: number;
    number_of_series: number;
    counterno: number;
    belongtomcno: number;
    belongtomidno: number;
    icollecteddata: number;
    randomness: string;
    r43: number;
}
