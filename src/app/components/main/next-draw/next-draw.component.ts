import { Component, OnInit } from '@angular/core';
import { Connection } from '@solana/web3.js';
import { deserialize } from 'borsh';
import { addDays } from 'date-fns';
import { firstValueFrom } from 'rxjs';

import { BLOCK_CHAIN_KEYS } from '../../../constants';
import { DateOfDrawModel } from '../../../models';
import { WalletService } from '../../../services/wallet.service';

@Component({
    selector: 'next-draw',
    templateUrl: './next-draw.component.html',
    styleUrls: ['./next-draw.component.scss']
})
export class NextDrawComponent implements OnInit {
    private _drawDate?: Date;

    get drawDate(): Date | undefined {
        return this._drawDate;
    }

    constructor(private _walletService: WalletService) {
    }

    ngOnInit(): void {
        this._getDateOfDraw();
    }

    private async _getDateOfDraw(): Promise<void> {
        const connection: Connection | null = await firstValueFrom(this._walletService.connection$);
        if (connection === null) {
            return;
        }

        const dateOfDrawBuffer = await connection.getAccountInfo(BLOCK_CHAIN_KEYS.dateOfDraw);
        const dateOfDraw = deserialize(DateOfDrawModel.getSchema(), DateOfDrawModel, dateOfDrawBuffer!.data);

        const currentTime = new Date().getTime();
        if (dateOfDraw.getDate().getTime() < currentTime) {
            this._drawDate = addDays(new Date(), 2);
        } else {
            this._drawDate = new Date(dateOfDraw.getDate().getTime());
        }
    }
}
