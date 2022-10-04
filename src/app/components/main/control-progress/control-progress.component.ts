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

    constructor() {
    }
}
