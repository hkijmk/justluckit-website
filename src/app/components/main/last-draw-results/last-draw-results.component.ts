import { Component } from '@angular/core';

import { AppStateService } from '../../../services/app-state.service';
import { BlockChainService } from '../../../services/block-chain.service';

import { LastDrawResultsModel } from '../../../models';

@Component({
    selector: 'last-draw-results',
    templateUrl: './last-draw-results.component.html',
    styleUrls: ['./last-draw-results.component.scss']
})
export class LastDrawResultsComponent {
    maxDrawWeekNumber: number;
    drawWeekNumber: number;
    drawResults: LastDrawResultsModel;
    isLoadingDrawResults: boolean = false;

    constructor(private _appStateService: AppStateService,
                private _blockChainService: BlockChainService) {
        this.drawWeekNumber = this._appStateService.record.weekNumber - 1;
        this.maxDrawWeekNumber = this.drawWeekNumber;
        this.drawResults = this._appStateService.getDrawResultPerWeek(this.drawWeekNumber)!;
    }

    async onDrawingNumberChange(drawingNumber: string): Promise<void> {
        const drawWeekNumber = parseInt(drawingNumber) ?? this.maxDrawWeekNumber;
        let drawResults = this._appStateService.getDrawResultPerWeek(drawWeekNumber);

        if (!drawResults) {
            drawResults = await this._getDrawingResults(drawWeekNumber);
        }

        if (drawResults) {
            this.drawResults = drawResults;
            this.drawWeekNumber = drawWeekNumber;
        }
    }

    private async _getDrawingResults(drawingNumber: number): Promise<LastDrawResultsModel | undefined> {
        this.isLoadingDrawResults = true;
        const mainScreenInfo = await this._appStateService.getMainScreenInfo(this._blockChainService.connection, drawingNumber);

        this.isLoadingDrawResults = false;
        return mainScreenInfo?.lastDrawResults;

    }
}
