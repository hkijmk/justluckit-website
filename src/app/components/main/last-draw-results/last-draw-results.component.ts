import { Component } from '@angular/core';

import { AppStateService } from '../../../services/app-state.service';

import { LastDrawResultsModel } from '../../../models';

@Component({
    selector: 'last-draw-results',
    templateUrl: './last-draw-results.component.html',
    styleUrls: ['./last-draw-results.component.scss']
})
export class LastDrawResultsComponent {
    get lastDrawResults(): LastDrawResultsModel {
        return this._appStateService.mainScreenInfo.lastDrawResults;
    }

    constructor(private _appStateService: AppStateService) {
    }
}
