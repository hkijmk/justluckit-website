import { Injectable } from '@angular/core';

import { MainScreenInfoModel, RecordModel } from '../models';

@Injectable()
export class AppStateService {
    private _record?: RecordModel;
    private _mainScreenInfo?: MainScreenInfoModel;

    get record(): RecordModel {
        return this._record!;
    }

    get mainScreenInfo(): MainScreenInfoModel | undefined {
        return this._mainScreenInfo;
    }

    constructor() {
    }

    initRecord(value: RecordModel): void {
        this._record = value;
    }

    initMainScreenInfo(value: MainScreenInfoModel): void {
        this._mainScreenInfo = value;
    }
}
