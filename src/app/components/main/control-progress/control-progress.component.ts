import { Component } from '@angular/core';

import { AppStateService } from '../../../services/app-state.service';

import { DirectorModel } from '../../../models';

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

    get drawWeekNumber(): number | undefined {
        return this._appStateService.mainScreenInfo?.weekNumber;
    }

    constructor(private _appStateService: AppStateService) {
    }
}
