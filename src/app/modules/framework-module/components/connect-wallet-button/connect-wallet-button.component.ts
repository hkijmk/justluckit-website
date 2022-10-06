import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { BlockChainService } from '../../../../services/block-chain.service';

@Component({
    selector: 'connect-wallet-button',
    templateUrl: './connect-wallet-button.component.html',
    styleUrls: ['./connect-wallet-button.component.scss']
})
export class ConnectWalletButtonComponent {
    isConnectWalletModalVisible: boolean = false;

    get isWalletConnected$(): Observable<boolean> {
        return this._blockChainService.isWalletConnected$;
    }

    constructor(private _blockChainService: BlockChainService) {
    }
}
