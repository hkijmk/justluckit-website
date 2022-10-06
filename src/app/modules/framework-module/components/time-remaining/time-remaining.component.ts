import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { BroadcastService } from '../../../../services/broadcast.service';

@Component({
    selector: 'time-remaining',
    templateUrl: './time-remaining.component.html',
    styleUrls: ['./time-remaining.component.scss']
})
export class TimeRemainingComponent implements OnInit, OnDestroy {
    @Input() set date(date: Date | undefined) {
        this._date = date;
        this._setRemainingTimeParams();
    }

    private _date?: Date;
    private _timer!: Subscription;
    private _daysLeft: number = 0;
    private _hoursLeft: number = 0;
    private _minutesLeft: number = 0;
    private _secondsLeft: number = 0;

    get daysLeft(): number {
        return this._daysLeft;
    }

    get hoursLeft(): number {
        return this._hoursLeft;
    }

    get minutesLeft(): number {
        return this._minutesLeft;
    }

    get secondsLeft(): number {
        return this._secondsLeft;
    }

    constructor(private _broadcastService: BroadcastService) {
    }

    ngOnInit(): void {
        this._setTimer$();
    }

    ngOnDestroy(): void {
        this._clearTimer$();
    }

    private _setTimer$(): void {
        this._timer = this._broadcastService.timer.subscribe(() => {
            this._setRemainingTimeParams();
        });
    }

    private _setRemainingTimeParams(): void {
        let timeRemaining = (this._date ?? new Date()).getTime() - new Date().getTime();

        this._daysLeft = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        timeRemaining -= this._daysLeft * (1000 * 60 * 60 * 24);

        this._hoursLeft = Math.floor(timeRemaining / (1000 * 60 * 60));
        timeRemaining -= this._hoursLeft * (1000 * 60 * 60);

        this._minutesLeft = Math.floor(timeRemaining / (1000 * 60));
        timeRemaining -= this._minutesLeft * (1000 * 60);

        this._secondsLeft = Math.floor(timeRemaining / (1000));
    }

    private _clearTimer$(): void {
        this._timer?.unsubscribe();
    }
}
