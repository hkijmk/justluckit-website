import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';

@Component({
    selector: 'app-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss']
})
export class IconComponent implements AfterViewInit {
    @Input() icon!: string;
    @Input() color?: string;
    @Input() size?: number;
    @Input() shouldSpin?: boolean;

    constructor(private _elementRef: ElementRef) {
    }

    ngAfterViewInit(): void {
        this._setStyles();
    }

    private _setStyles(): void {
        const svgElement: SVGElement = this._elementRef.nativeElement.firstChild.firstChild;

        if (this.size !== undefined) {
            svgElement.setAttribute('width', this.size.toString());
            svgElement.setAttribute('height', this.size.toString());
        }

        if (this.color !== undefined) {
            const pathElements: SVGPathElement[] = Array.from(svgElement.querySelectorAll<SVGPathElement>('path'));
            const pathElementsToColorize = pathElements.filter(pathElement => pathElement.getAttribute('fill') !== null);
            pathElementsToColorize.forEach(pathElement => pathElement.setAttribute('fill', this.color!))
        }
    }
}
