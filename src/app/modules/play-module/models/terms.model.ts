import * as BN from 'bn.js';

import { BlockChainSchemaType } from '../../../types';

export class TermsModel implements ITermsModel {
    isInit: number;
    newDemandBN: BN;
    oldDemandBN: BN;
    applyAfterT: number;
    newHostFeeBN: BN;
    oldHostFeeBN: BN;
    applyAfterH: number;
    newMinersFeeBN: BN;
    oldMinersFeeBN: BN;
    applyAfter: number;
    drawTicketAmountBN: BN;
    rentBN: BN;
    airdropTokensPerGameBN: BN;

    get drawTicketAmount(): number {
        return this.drawTicketAmountBN.toNumber();
    }

    get totalPrice(): number {
        return (this.newDemandBN.toNumber() + this.newHostFeeBN.toNumber() + this.newMinersFeeBN.toNumber()) / 1000000000;
    }

    get deposit(): number {
        return this.rentBN.toNumber() / 1000000000;
    }

    constructor(obj: ITermsModel) {
        this.isInit = obj.isInit;
        this.newDemandBN = obj.newDemandBN;
        this.oldDemandBN = obj.oldDemandBN;
        this.applyAfterT = obj.applyAfterT;
        this.newHostFeeBN = obj.newHostFeeBN;
        this.oldHostFeeBN = obj.oldHostFeeBN;
        this.applyAfterH = obj.applyAfterH;
        this.newMinersFeeBN = obj.newMinersFeeBN;
        this.oldMinersFeeBN = obj.oldMinersFeeBN;
        this.applyAfter = obj.applyAfter;
        this.drawTicketAmountBN = obj.drawTicketAmountBN;
        this.rentBN = obj.rentBN;
        this.airdropTokensPerGameBN = obj.airdropTokensPerGameBN;
    }

    static getSchema(): BlockChainSchemaType<typeof TermsModel> {
        return new Map([
            [
                TermsModel,
                {
                    kind: "struct",
                    fields: [
                        ["isInit", "u8"],
                        ["newDemandBN", "u64"],
                        ["oldDemandBN", "u64"],
                        ["applyAfterT", "u16"],
                        ["newHostFeeBN", "u64"],
                        ["oldHostFeeBN", "u64"],
                        ["applyAfterH", "u16"],
                        ["newMinersFeeBN", "u64"],
                        ["oldMinersFeeBN", "u64"],
                        ["applyAfter", "u16"],
                        ["drawTicketAmountBN", "u64"],
                        ["rentBN", "u64"],
                        ["airDropTokensPerGame", "u64"],
                    ],
                },
            ],
        ])
    }
}

export interface ITermsModel {
    isInit: number;
    newDemandBN: BN;
    oldDemandBN: BN;
    applyAfterT: number;
    newHostFeeBN: BN;
    oldHostFeeBN: BN;
    applyAfterH: number;
    newMinersFeeBN: BN;
    oldMinersFeeBN: BN;
    applyAfter: number;
    drawTicketAmountBN: BN;
    rentBN: BN;
    airdropTokensPerGameBN: BN;
}
