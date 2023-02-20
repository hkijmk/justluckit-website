import { BlockChainSchemaType } from '../types';

export class PoolInfo implements IPoolInfo {
    solToUsd: number;
    totalSolInPool: number;

    constructor(obj: IPoolInfo) {
        this.solToUsd = obj.solToUsd;
        this.totalSolInPool = obj.totalSolInPool;
    }

    static getSchema(): BlockChainSchemaType<typeof PoolInfo> {
        return new Map([
            [
                PoolInfo,
                {
                    kind: "struct",
                    fields: [
                        ["solToUsd", "u64"],
                        ["totalSolInPool", "u64"],

                    ],
                },
            ],
        ]);
    }
}

interface IPoolInfo {
    solToUsd: number;
    totalSolInPool: number;
}
