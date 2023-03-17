import { Component } from '@angular/core';

import { AppStateService } from '../../../services/app-state.service';

import { DirectorModel, PoolInfo } from '../../../models';

@Component({
    selector: 'control-progress',
    templateUrl: './control-progress.component.html',
    styleUrls: ['./control-progress.component.scss']
})
export class ControlProgressComponent {
    get drawDate(): Date {
        return this._appStateService.record.drawDate;
    }

    get director(): DirectorModel | undefined {
        return this._appStateService.mainScreenInfo?.director;
    }

    get isDrawing(): boolean {
        return new Date().getTime() > this.drawDate.getTime();
    }

    get drawWeekNumber(): number {
        if (!this._appStateService.mainScreenInfo) {
            return 0;
        }

        return this._appStateService.mainScreenInfo.weekNumber - 1;
    }

    get poolInfo(): PoolInfo | undefined {
        return this._appStateService.poolInfo;
    }

    constructor(private _appStateService: AppStateService) {
    }
}
