import { Component, EventEmitter, Output } from '@angular/core';

import { BlockChainService } from '../../../../../../services/block-chain.service';
import { REFERRAL_LINK_QUERY_PARAM } from '../../../../../../constants';

@Component({
    selector: 'referral-link-modal',
    templateUrl: './referral-link-modal.component.html',
    styleUrls: ['./referral-link-modal.component.scss']
})
export class ReferralLinkModalComponent {
    @Output() close = new EventEmitter<void>();

    private readonly _referralLink: string = '';
    private _isCopied: boolean = false;

    get isCopied(): boolean {
        return this._isCopied;
    }

    get referralLink(): string {
        return this._referralLink;
    }

    constructor(private _blockChainService: BlockChainService) {
        if (this._blockChainService.walletPublicKey !== null) {
            this._referralLink = `https://justluckit.com/referral-link-redirect?${REFERRAL_LINK_QUERY_PARAM}=${this._blockChainService.walletPublicKey.toString()}`;
        }
    }

    async copyReferralLinkToClipboard(): Promise<void> {
        if (!this._referralLink) {
            return;
        }

        await navigator.clipboard.writeText(this._referralLink);
        this._isCopied = true;
    }
}
