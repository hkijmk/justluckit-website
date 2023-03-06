import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, Subject, Subscription } from 'rxjs';

import { AppStateService } from '../../../services/app-state.service';
import { BlockChainService } from '../../../services/block-chain.service';

import { LastDrawResultsModel } from '../../../models';

@Component({
    selector: 'last-draw-results',
    templateUrl: './last-draw-results.component.html',
    styleUrls: ['./last-draw-results.component.scss']
})
export class LastDrawResultsComponent implements OnInit, OnDestroy {
    private readonly _drawingNumberChanged$: Subject<number> = new Subject();
    private _drawingNumberChangedListener?: Subscription;

    maxDrawWeekNumber: number;
    drawWeekNumber: number;
    drawResults: LastDrawResultsModel;
    isLoadingDrawResults: boolean = false;

    constructor(private _appStateService: AppStateService,
                private _blockChainService: BlockChainService) {
        this.drawWeekNumber = this._appStateService.record.weekNumber - 2;
        this.maxDrawWeekNumber = this.drawWeekNumber;
        this.drawResults = this._appStateService.getDrawResultPerWeek(this.drawWeekNumber)!;
    }

    ngOnInit(): void {
        this._setOnDrawingNumberChangeListener();
    }

    ngOnDestroy(): void {
        this._drawingNumberChangedListener?.unsubscribe();
    }

    async onDrawingNumberChange(drawingNumberAsString: string): Promise<void> {
        const drawingNumber = parseInt(drawingNumberAsString) ?? this.maxDrawWeekNumber;
        this._drawingNumberChanged$.next(drawingNumber);
    }

    private _setOnDrawingNumberChangeListener() {
        this._drawingNumberChangedListener = this._drawingNumberChanged$
            .pipe(debounceTime(300))
            .subscribe(async (drawingNumber: number) => {
                let drawResults = this._appStateService.getDrawResultPerWeek(drawingNumber);
                if (!drawResults) {
                    drawResults = await this._getDrawingResults(drawingNumber);
                }

                if (drawResults) {
                    this.drawResults = drawResults;
                    this.drawWeekNumber = drawingNumber;
                }
            });
    }

    private async _getDrawingResults(drawingNumber: number): Promise<LastDrawResultsModel | undefined> {
        this.isLoadingDrawResults = true;
        const mainScreenInfo = await this._appStateService.getMainScreenInfo(this._blockChainService.connection, drawingNumber + 1);

        this.isLoadingDrawResults = false;
        return mainScreenInfo?.lastDrawResults;

    }
}
