import { Component, Input } from '@angular/core';

import { DirectorModel } from '../../../models';

@Component({
    selector: 'control-progress',
    templateUrl: './control-progress.component.html',
    styleUrls: ['./control-progress.component.scss']
})
export class ControlProgressComponent {
    @Input() director!: DirectorModel;
    @Input() drawDate!: Date;

    private _isLoadingDrawDate: boolean = false;

    get isLoadingDrawDate(): boolean {
        return this._isLoadingDrawDate;
    }

    get isDrawing(): boolean {
        return new Date().getTime() > this.drawDate.getTime();
    }

    constructor() {
    }
}
