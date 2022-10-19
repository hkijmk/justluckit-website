import { Injectable } from '@angular/core';

import { TermsModel } from '../models';

@Injectable()
export class PlayService {
    private _selectedNumbersMap: Set<number> = new Set<number>();

    terms?: TermsModel;

    get selectedNumbers(): number[] {
        return Array.from(this._selectedNumbersMap).sort((number1, number2) => number1 - number2);
    }

    constructor() {
    }

    isNumberSelected(selectedNumber: number): boolean {
        return this._selectedNumbersMap.has(selectedNumber);
    }

    toggleSelectedNumber(selectedNumber: number): void {
        if (this.isNumberSelected(selectedNumber)) {
            this._selectedNumbersMap.delete(selectedNumber);
            return;
        }

        if (this._selectedNumbersMap.size === 6) {
            return;
        }

        this._selectedNumbersMap.add(selectedNumber)
    }

    clear(): void {
        this._selectedNumbersMap.clear();
    }
}
