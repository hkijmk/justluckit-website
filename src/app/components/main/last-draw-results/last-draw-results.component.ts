import { Component, Input } from '@angular/core';

import { LastDrawResultsModel } from '../../../models';

@Component({
    selector: 'last-draw-results',
    templateUrl: './last-draw-results.component.html',
    styleUrls: ['./last-draw-results.component.scss']
})
export class LastDrawResultsComponent {
    @Input() lastDrawResults!: LastDrawResultsModel;

    constructor() {
    }
}
