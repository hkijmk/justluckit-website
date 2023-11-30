import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicKey } from '@solana/web3.js';

import { BlockChainService } from '../../services/block-chain.service';

import { LOCAL_STORAGE_KEYS, REFERRAL_LINK_QUERY_PARAM } from '../../constants';

@Component({
    templateUrl: './referral-link-redirect.component.html',
})
export class ReferralLinkRedirectComponent implements OnInit {
    constructor(
        private _blockChainService: BlockChainService,
        private _route: ActivatedRoute,
        private _router: Router,
    ) {
    }

    ngOnInit() {
        this._route.queryParams
            .subscribe(async (params) => {
                if ((REFERRAL_LINK_QUERY_PARAM in params)) {
                    const hostKeyString = params[REFERRAL_LINK_QUERY_PARAM];
                    try {
                        const hostKey = new PublicKey(hostKeyString);

                        const balance = await this._blockChainService.connection.getBalance(hostKey)
                        if (balance !== 0) {
                            localStorage.setItem(LOCAL_STORAGE_KEYS.hostKeyString, hostKeyString);
                            this._blockChainService.hostKey = hostKey;
                        }
                    } catch (_) {
                    }

                    this._router.navigate(['/'])
                }
            });
    }
}
