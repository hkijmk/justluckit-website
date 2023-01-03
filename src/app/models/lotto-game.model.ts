import { encode } from '@faustbrian/node-base58';

import { BlockChainSchemaType } from '../types';

export class LottoGameModel implements ILottoGameModel {
    week: number;
    number1: number;
    number2: number;
    number3: number;
    number4: number;
    number5: number;
    number6: number;
    player: string;
    pl43: number;
    wins: number;
    bump: number;
    scno: number;
    serialno: number;
    midcno: number;
    mc: number;
    gameno: number;
    alreadyparticipated: number;
    winno: string;

    constructor(obj?: ILottoGameModel) {
        this.week = obj?.week ?? 0;
        this.number1 = obj?.number1 ?? 0;
        this.number2 = obj?.number2 ?? 0;
        this.number3 = obj?.number3 ?? 0;
        this.number4 = obj?.number4 ?? 0;
        this.number5 = obj?.number5 ?? 0;
        this.number6 = obj?.number6 ?? 0;
        this.player = obj?.player ?? '4YbLBRXwseG1NuyJbteSD5u81Q2QjFqJBp6JmxwYBK';
        this.pl43 = obj?.pl43 ?? 0;
        this.bump = obj?.bump ?? 0;
        this.wins = obj?.wins ?? 0;
        this.scno = obj?.scno ?? 0;
        this.serialno = obj?.serialno ?? 0;
        this.midcno = obj?.midcno ?? 0;
        this.mc = obj?.mc ?? 0;
        this.gameno = obj?.gameno ?? 0;
        this.alreadyparticipated = obj?.alreadyparticipated ?? 0;
        this.winno = obj?.winno ?? 'wwwwmmmmssssrrrraaaaa';
    }

    static getSchema(): BlockChainSchemaType<typeof LottoGameModel> {
        return new Map([
            [
                LottoGameModel,
                {
                    kind: "struct",
                    fields: [
                        ["week", "u16"],
                        ["number1", "u8"],
                        ["number2", "u8"],
                        ["number3", "u8"],
                        ["number4", "u8"],
                        ["number5", "u8"],
                        ["number6", "u8"],
                        ["player", "String"],
                        ["pl43", "u8"],
                        ["wins", "u8"],
                        ["bump", "u8"],
                        ["scno", "u8"],
                        ["serialno", "u8"],
                        ["midcno", "u8"],
                        ["mc", "u8"],
                        ["gameno", "u16"],
                        ["alreadyparticipated", "u8"],
                        ["winno", "String"],
                    ],
                },
            ],
        ]);
    }

    getNumbers(): number[] {
        return [this.number1, this.number2, this.number3, this.number4, this.number5, this.number6];
    }

    getSeed(): string {
        const sp1 = 'w';
        const s1 = this.week.toString();
        const sp2 = "m";
        const s2 = this.mc.toString();
        const sp3 = "md";
        const s3 = this.midcno.toString();
        const sp4 = "sc";
        const s4 = this.scno.toString();
        const sp5 = "sr";
        const s5 = this.serialno.toString();
        const sp6 = "x";
        const s6 = this.gameno.toString();

        return sp1 + s1 + sp2 + s2 + sp3 + s3 + sp4 + s4 + sp5 + s5 + sp6 + s6;
    }

    getEncodedSeed(): string {
        return encode(this.getSeed());
    }
}

export interface ILottoGameModel {
    week: number;
    number1: number;
    number2: number;
    number3: number;
    number4: number;
    number5: number;
    number6: number;
    player: string;
    pl43: number;
    wins: number;
    bump: number;
    scno: number;
    serialno: number;
    midcno: number;
    mc: number;
    gameno: number;
    alreadyparticipated: number;
    winno: string;
}
