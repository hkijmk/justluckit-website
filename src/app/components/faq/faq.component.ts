import { Component } from '@angular/core';

import { FAQ } from '../../constants';

@Component({
    selector: 'faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
    FAQ = FAQ;

    constructor() {
    }
}
