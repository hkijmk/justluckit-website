import { Component, EventEmitter, Output } from '@angular/core';

import { WalletService } from '../../../services/wallet.service';

import { WALLET_TYPE } from '../../../enums';

@Component({
    selector: 'connect-wallet',
    templateUrl: './connect-wallet.component.html',
    styleUrls: ['./connect-wallet.component.scss']
})
export class ConnectWalletComponent {
    @Output() close = new EventEmitter<void>();

    WALLET_TYPE = WALLET_TYPE;

    constructor(private _walletService: WalletService) {
    }

    onSelectWallet(wallet: WALLET_TYPE) {
        this._walletService.selectWallet(wallet);
        this.close.emit();
    }
}
