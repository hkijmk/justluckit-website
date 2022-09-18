import { Injectable } from '@angular/core';
import { timer } from 'rxjs';

@Injectable()
export class BroadcastService {
    timer = timer(0, 1000);

    constructor() {
    }
}
