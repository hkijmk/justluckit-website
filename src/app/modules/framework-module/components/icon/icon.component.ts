import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss']
})
export class IconComponent {
    @Input() svg!: string;
    @Input() color?: string;
    @Input() size?: number;

    constructor() {
    }
}
