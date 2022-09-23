import { Component, Input } from '@angular/core';

@Component({
    selector: 'lottery-numbers',
    templateUrl: './lottery-numbers.component.html',
    styleUrls: ['./lottery-numbers.component.scss']
})
export class LotteryNumbersComponent {
    @Input() numbers!: number[];
    @Input() columnCountMd: number = 6;
    @Input() columnCountSm: number = this.columnCountMd;

    constructor() {
    }
}
