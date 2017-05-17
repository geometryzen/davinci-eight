import { mustBeGE } from '../checks/mustBeGE';
import { mustBeInteger } from '../checks/mustBeInteger';

/**
 * Modulo Arithmetic (Experimental).
 */
export class Modulo {
    private _value = 0;
    private _size = 0;
    get size() {
        return this._size;
    }
    set size(size: number) {
        mustBeInteger('size', size);
        mustBeGE('size', size, 0);
        this._size = size;
        this.value = this._value;
    }
    get value(): number {
        return this._value;
    }
    set value(value: number) {
        this._value = value % this._size;
    }
    inc(): number {
        this._value++;
        if (this._value === this._size) {
            this._value = 0;
        }
        return this._value;
    }
}
