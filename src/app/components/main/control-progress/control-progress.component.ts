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

    get isTimeZero(): boolean {
        return this.drawDate.getTime() === 0;
    }

    get drawDateForTimeRemaining(): Date | undefined {
        const now = new Date().getTime();
        return (now > this.drawDate.getTime()) ? undefined : this.drawDate;
    }

    constructor() {
    }
}
