import { Component } from '@angular/core';

import { AppStateService } from '../../services/app-state.service';

import { MainScreenInfoModel, RecordModel } from '../../models';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent {
    private _isLoading: boolean = false;

    get record(): RecordModel {
        return this._appStateService.record;
    }

    get mainScreenInfo(): MainScreenInfoModel | undefined {
        return this._appStateService.mainScreenInfo;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    constructor(private _appStateService: AppStateService) {
    }
}
