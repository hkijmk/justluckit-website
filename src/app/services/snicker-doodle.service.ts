import { Injectable } from '@angular/core';
import { SnickerdoodleWebIntegration } from '@snickerdoodlelabs/web-integration';
import { PublicKey } from '@solana/web3.js';

import { SNICKER_DOODLE_CONFIG } from '../constants';

import { SolanaAccountAddress, Signature, EChain } from "@snickerdoodlelabs/objects";

@Injectable()
export class SnickerDoodleService {
    constructor() {
    }

    async initialize(walletKey: PublicKey, signatureData: Uint8Array): Promise<boolean> {
        const webIntegration = new SnickerdoodleWebIntegration(SNICKER_DOODLE_CONFIG);
        const result = await webIntegration.initialize().andThen((proxy) => {
            return proxy.account.addAccountWithExternalSignature(
                SolanaAccountAddress(walletKey.toBase58()),
                'JustLuckIt',
                Signature(Buffer.from(signatureData).toString('hex')),
                EChain.Solana,
            );
        }).mapErr((err) => {
            console.log(err);
        });

        return result.isOk();
    }
}
