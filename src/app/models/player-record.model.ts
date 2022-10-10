import { BlockChainSchemaType } from '../types';

export class PlayerRecordModel implements IPlayerRecordModel {
    playerKey: string;
    pl43: number;
    tokenAmountBN: number;
    drawTicketWeek: number;
    totalGamesPlayed: number;

    constructor(obj: IPlayerRecordModel) {
        this.playerKey = obj.playerKey ?? '4YbLBRXwseG1NuyJbteSD5u81Q2QjFqJBp6JmxwYBK';
        this.pl43 = obj.pl43;
        this.tokenAmountBN = obj.tokenAmountBN;
        this.drawTicketWeek = obj.drawTicketWeek;
        this.totalGamesPlayed = obj.totalGamesPlayed;
    }

    static getSchema(): BlockChainSchemaType<typeof PlayerRecordModel> {
        return new Map([
            [
                PlayerRecordModel,
                {
                    kind: "struct",
                    fields: [
                        ["playerKey", "String"],
                        ["pl43", "u8"],
                        ["tokenAmountBN", "u64"],
                        ["drawTicketWeek", "u16"],
                        ["totalGamesPlayed", "u16"],
                    ],
                },
            ],
        ]);
    }
}

export interface IPlayerRecordModel {
    playerKey: string;
    pl43: number;
    tokenAmountBN: number;
    drawTicketWeek: number;
    totalGamesPlayed: number;
}
