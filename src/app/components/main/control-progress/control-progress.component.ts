import { Component, OnInit } from '@angular/core';
import { Connection, PublicKey } from '@solana/web3.js';
import { deserialize } from 'borsh';
import { addDays } from 'date-fns';
import { firstValueFrom } from 'rxjs';

import { BlockChainService } from '../../../services/block-chain.service';

import { BLOCK_CHAIN_KEYS } from '../../../constants';
import { DateOfDrawModel, DirectorModel, RecordModel } from '../../../models';

@Component({
    selector: 'control-progress',
    templateUrl: './control-progress.component.html',
    styleUrls: ['./control-progress.component.scss']
})
export class ControlProgressComponent implements OnInit {
    private _director?: DirectorModel;
    private _drawDate?: Date;

    get director(): DirectorModel | undefined {
        return this._director;
    }

    get drawDate(): Date | undefined {
        return this._drawDate;
    }

    constructor(private _blockChainService: BlockChainService) {
    }

    ngOnInit(): void {
        this._init();
    }

    private async _init(): Promise<void> {
        const connection: Connection | null = await firstValueFrom(this._blockChainService.connection$);
        if (connection === null) {
            return;
        }

        this._getControlStages(connection);
        this._getDateOfDraw(connection);
    }


    private async _getControlStages(connection: Connection): Promise<void> {
        const recordBuffer = await connection.getAccountInfo(BLOCK_CHAIN_KEYS.record);
        const record = deserialize(RecordModel.getSchema(), RecordModel, recordBuffer!.data);

        const directorAddress = await PublicKey.findProgramAddress([
                Buffer.from("director"),
                Buffer.from((record.weekNumber - 1).toString()),
            ],
            BLOCK_CHAIN_KEYS.programId,
        );

        const directorBuffer = await connection.getAccountInfo(directorAddress[0]);
        this._director = deserialize(DirectorModel.getSchema(), DirectorModel, directorBuffer!.data);
    }

    private async _getDateOfDraw(connection: Connection): Promise<void> {
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
