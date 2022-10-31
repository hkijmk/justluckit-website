import { Injectable } from '@angular/core';

import { MainScreenInfoModel, RecordModel } from '../models';

@Injectable()
export class AppStateService {
    private _record?: RecordModel;
    private _mainScreenInfo?: MainScreenInfoModel;

    get record(): RecordModel {
        return this._record!;
    }

    set record(value: RecordModel | undefined) {
        this._mainScreenInfo = undefined;
        this._record = value;
    }

    get mainScreenInfo(): MainScreenInfoModel {
        return this._mainScreenInfo!;
    }

    constructor() {
    }

    initMainScreenInfo(value: MainScreenInfoModel): void {
        this._mainScreenInfo = value;
    }
}
