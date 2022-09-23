import { Component, OnInit } from '@angular/core';
import { Connection } from '@solana/web3.js';
import { deserialize } from 'borsh';
import { addSeconds } from 'date-fns';
import { firstValueFrom } from 'rxjs';

import { BlockChainService } from '../../../services/block-chain.service';

import { BLOCK_CHAIN_KEYS } from '../../../constants';
import { DateOfDrawModel, HowOftenModel } from '../../../models';

@Component({
    selector: 'next-draw',
    templateUrl: './next-draw.component.html',
    styleUrls: ['./next-draw.component.scss']
})
export class NextDrawComponent implements OnInit {
    private _nextDrawDate?: Date;

    get nextDrawDate(): Date | undefined {
        return this._nextDrawDate;
    }

    constructor(private _blockChainService: BlockChainService) {
    }

    ngOnInit(): void {
        this._getNextDrawDate();
    }

    private async _getNextDrawDate(): Promise<void> {
        const connection: Connection | null = await firstValueFrom(this._blockChainService.connection$);
        if (connection === null) {
            return;
        }

        const dateOfDrawBuffer = await connection.getAccountInfo(BLOCK_CHAIN_KEYS.dateOfDraw);
        const dateOfDraw = deserialize(DateOfDrawModel.getSchema(), DateOfDrawModel, dateOfDrawBuffer!.data);

        const howOftenBuffer = await connection.getAccountInfo(BLOCK_CHAIN_KEYS.howOften);
        const howOften = deserialize(HowOftenModel.getSchema(), HowOftenModel, howOftenBuffer!.data);

        this._nextDrawDate = addSeconds(dateOfDraw.getDate(), howOften.howOften);
    }
}
