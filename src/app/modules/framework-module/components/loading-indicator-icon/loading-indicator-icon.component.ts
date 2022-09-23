import { Component, Input } from '@angular/core';

import { ICON_SVGS } from '../../../../constants';

@Component({
    selector: 'app-loading-indicator-icon',
    templateUrl: './loading-indicator-icon.component.html',
    styleUrls: ['./loading-indicator-icon.component.scss']
})
export class LoadingIndicatorIconComponent {
    @Input() size?: number;

    ICON_SVGS = ICON_SVGS;

    constructor() {
    }
}
