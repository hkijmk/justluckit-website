import { Component, Input } from '@angular/core';

@Component({
    selector: 'control-stages',
    templateUrl: './control-stages.component.html',
    styleUrls: ['./control-stages.component.scss']
})
export class ControlStagesComponent {
    @Input() currentStageNumber!: number;

    constructor() {
    }
}
