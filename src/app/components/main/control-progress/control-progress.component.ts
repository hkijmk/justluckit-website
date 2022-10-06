import { Component, Input } from '@angular/core';


import { MainScreenInfoModel } from '../../../models';

@Component({
    selector: 'control-progress',
    templateUrl: './control-progress.component.html',
    styleUrls: ['./control-progress.component.scss']
})
export class ControlProgressComponent {
    @Input() mainScreenInfo!: MainScreenInfoModel;
    @Input() drawDate!: Date;

    private _isLoadingDrawDate: boolean = false;

    get isLoadingDrawDate(): boolean {
        return this._isLoadingDrawDate;
    }

    constructor() {
    }
}
