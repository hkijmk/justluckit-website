import { Injectable } from '@angular/core';

@Injectable()
export class PlayService {
    private _selectedNumbersMap: Set<number> = new Set<number>();
    private _totalPrice: number = 0.001;

    get selectedNumbers(): number[] {
        return Array.from(this._selectedNumbersMap).sort((number1, number2) => number1 - number2);
    }

    get totalPrice(): number {
        return this._totalPrice;
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
