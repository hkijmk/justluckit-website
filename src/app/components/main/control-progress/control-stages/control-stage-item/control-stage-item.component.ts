import { Component, Input } from '@angular/core';

@Component({
    selector: 'control-stage-item',
    templateUrl: './control-stage-item.component.html',
    styleUrls: ['./control-stage-item.component.scss']
})
export class ControlStageItemComponent {
    @Input() currentStageNumber!: number;
    @Input() stageNumber!: number;

    constructor() {
    }
}
