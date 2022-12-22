import { Component, Input } from '@angular/core';

@Component({
    selector: 'action-step',
    templateUrl: './action-step.component.html',
    styleUrls: ['./action-step.component.scss']
})
export class ActionStepComponent {
    @Input() stepNumber!: number;
    @Input() fixedSize?: boolean
    @Input() completed?: boolean
    @Input() disabled?: boolean

    constructor() {
    }
}
