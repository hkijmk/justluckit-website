import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';

@Injectable()
export class BroadcastService {
    timer = timer(0, 1000);
    recordChanged$ = new Subject();

    constructor() {
    }
}
