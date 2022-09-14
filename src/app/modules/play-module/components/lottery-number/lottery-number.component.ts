import { Component, Input } from '@angular/core';

@Component({
    selector: 'lottery-number',
    templateUrl: './lottery-number.component.html',
    styleUrls: ['./lottery-number.component.scss']
})
export class LotteryNumberComponent {
    @Input() selected: boolean = false;

    constructor() {
    }
}
