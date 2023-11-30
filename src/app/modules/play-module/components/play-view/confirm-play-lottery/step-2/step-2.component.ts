import { Component, EventEmitter, Input, Output } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { BlockChainService } from '../../../../../../services/block-chain.service';
import { PlayService } from '../../../../services/play.service';
import { SnickerDoodleService } from '../../../../../../services/snicker-doodle.service';

@Component({
    selector: 'confirm-play-lottery-step-2',
    templateUrl: './step-2.component.html',
    styleUrls: ['./step-2.component.scss', '../confirm-play-lottery.component.scss']
})
export class ConfirmPlayLotteryStep2Component {
    @Input() confirmationCode!: string;

    @Output() onClose = new EventEmitter();

    get selectedNumbers(): number[] {
        return this._playService.selectedNumbers;
    }

    constructor(private _blockChainService: BlockChainService,
                private _playService: PlayService,
                private _snickerDoodleService: SnickerDoodleService,
    ) {
    }

    finalize(): void {
        this._playService.clear();
        this.onClose.emit();
        this._connectSnickerDoodle();
    }

    private async _connectSnickerDoodle(): Promise<void> {
        if (this._blockChainService.walletPublicKey === null) {
            return;
        }

        const signedMessage = this._blockChainService.signMessage(`Hey there! We're using analytics to improve our Dapp, mind if we collect some usage data?`);
        if (!signedMessage) {
            return;
        }

        const signature = await firstValueFrom(signedMessage)
        if (!signature) {
            return;
        }

        await this._snickerDoodleService.initialize(this._blockChainService.walletPublicKey, signature)
    }
}
