import { Component, Input, OnInit } from '@angular/core';
import { deserialize } from 'borsh';

import { BlockChainService } from '../../../services/block-chain.service';

import { BLOCK_CHAIN_KEYS } from '../../../constants';
import { DateOfDrawModel, MainScreenInfoModel } from '../../../models';

@Component({
    selector: 'control-progress',
    templateUrl: './control-progress.component.html',
    styleUrls: ['./control-progress.component.scss']
})
export class ControlProgressComponent implements OnInit {
    @Input() mainScreenInfo!: MainScreenInfoModel;

    private _isLoadingDrawDate: boolean = false;
    private _drawDate?: Date;

    get isLoadingDrawDate(): boolean {
        return this._isLoadingDrawDate;
    }

    get drawDate(): Date | undefined {
        return this._drawDate;
    }

    constructor(private _blockChainService: BlockChainService) {
    }

    ngOnInit(): void {
        this._setNextDrawDate();
    }

    private async _setNextDrawDate(): Promise<void> {
        const dateOfDrawBuffer = await this._blockChainService.connection.getAccountInfo(BLOCK_CHAIN_KEYS.dateOfDraw);
        const dateOfDraw = deserialize(DateOfDrawModel.getSchema(), DateOfDrawModel, dateOfDrawBuffer!.data);
        this._drawDate = dateOfDraw.drawDate;
    }
}
