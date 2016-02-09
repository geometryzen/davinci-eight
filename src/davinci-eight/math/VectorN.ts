import Mutable from '../math/Mutable';
import isDefined from '../checks/isDefined';
import isUndefined from '../checks/isUndefined';

function pushString(T: string): string {
    return "push(value: " + T + "): number";
}

function popString(T: string): string {
    return "pop(): " + T;
}

function verboten(operation: string): string {
    return operation + " is not allowed for a fixed size vector";
}

function verbotenPush(): string {
    return verboten(pushString('T'));
}

function verbotenPop(): string {
    return verboten(popString('T'));
}

/**
 * @class VectorN
 */
export default class VectorN<T> implements Mutable<T[]> {
    /**
     * @property _size
     * @type number
     * @private
     */
    private _size: number;
    private _data: T[];
    private _callback: () => T[];
    /**
     * @property modified
     * @type {boolean}
     */
    public modified: boolean;

    /**
     * @class VectorN
     * @constructor
     * @param data {T[]}
     * @param modified [boolean = false]
     * @param [size]
     */
    constructor(data: T[], modified = false, size?: number) {
        this.modified = modified;
        if (isDefined(size)) {
            this._size = size;
            this._data = data;
        }
        else {
            this._size = void 0;
            this._data = data;
        }
    }

    /**
     * @property data
     * @type {T[]}
     */
    get coords(): T[] {
        if (this._data) {
            return this._data;
        }
        else if (this._callback) {
            return this._callback();
        }
        else {
            throw new Error("Vector" + this._size + " is undefined.");
        }
    }
    set coords(data: T[]) {
        this._data = data;
        this._callback = void 0;
        this.modified = true;
    }

    /**
     * @property callback
     * @type {() => T[]}
     */
    get callback(): () => T[] {
        return this._callback;
    }
    set callback(reactTo: () => T[]) {
        this._callback = reactTo;
        this._data = void 0;
        this.modified = true;
    }

    /**
     * @property length
     * @type {number}
     * @readOnly
     */
    get length(): number {
        return this.coords.length;
    }

    /**
     * @method clone
     * @return {VectorN}
     */
    clone(): VectorN<T> {
        return new VectorN<T>(this._data, this.modified, this._size);
    }

    /**
     * @method getComponent
     * @param index {number}
     * @return {T}
     */
    getComponent(index: number): T {
        return this.coords[index];
    }

    /**
     * @method pop
     * @return {T}
     */
    pop(): T {
        if (isUndefined(this._size)) {
            return this.coords.pop();
        }
        else {
            throw new Error(verbotenPop());
        }
    }

    /**
     * @method push
     * @param value {T}
     * @return {number}
     */
    push(value: T): number {
        if (isUndefined(this._size)) {
            let data = this.coords;
            let newLength = data.push(value);
            this.coords = data;
            return newLength;
        }
        else {
            throw new Error(verbotenPush());
        }
    }

    /**
     * @method setComponent
     * @param index {number}
     * @param value {T}
     * @return {void}
     */
    setComponent(index: number, value: T): void {
        const coords: T[] = this.coords;
        const previous = coords[index];
        if (value !== previous) {
            coords[index] = value;
            this.coords = coords;
            this.modified = true;
        }
    }

    /**
     * @method toArray
     * @param [array = []] {T[]}
     * @param [offset = 0] {number}
     * @return {T[]}
     */
    toArray(array: T[] = [], offset = 0): T[] {
        let data = this.coords;
        let length = data.length;
        for (var i = 0; i < length; i++) {
            array[offset + i] = data[i];
        }
        return array;
    }

    /**
     * @method toLocaleString
     * @return {string}
     */
    toLocaleString(): string {
        return this.coords.toLocaleString();
    }

    /**
     * @method toString
     * @return {string}
     */
    toString(): string {
        return this.coords.toString();
    }
}
