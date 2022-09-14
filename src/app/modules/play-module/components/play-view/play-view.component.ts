import { Component } from '@angular/core';

@Component({
    selector: 'play-view',
    templateUrl: './play-view.component.html',
    styleUrls: ['./play-view.component.scss']
})
export class PlayViewComponent {
    isConnectingWallet: boolean = false;
    isConfirmingPlay: boolean = false;

    constructor() {
    }
}
