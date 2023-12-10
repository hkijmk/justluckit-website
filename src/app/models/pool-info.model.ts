import { BlockChainSchemaType } from '../types';

export class PoolInfo implements IPoolInfo {
    solToUsd: number;
    totalSolInPoolLamports: number;

    get totalSolInPool(): number {
        return this.totalSolInPoolLamports / 1000000000;
    }

    constructor(obj: IPoolInfo) {
        this.solToUsd = obj.solToUsd;
        this.totalSolInPoolLamports = obj.totalSolInPoolLamports;
    }

    static getSchema(): BlockChainSchemaType<typeof PoolInfo> {
        return new Map([
            [
                PoolInfo,
                {
                    kind: "struct",
                    fields: [
                        ["solToUsd", "u64"],
                        ["totalSolInPoolLamports", "u64"],
                    ],
                },
            ],
        ]);
    }
}

interface IPoolInfo {
    solToUsd: number;
    totalSolInPoolLamports: number;
}
