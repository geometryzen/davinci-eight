import isDefined from '../checks/isDefined';
import isUndefined from '../checks/isUndefined';
import mustSatisfy from '../checks/mustSatisfy';

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
 *
 */
export class VectorN<T> {
    /**
     *
     */
    private _size: number;

    /**
     *
     */
    protected _coords: T[];

    /**
     *
     */
    public modified: boolean;

    /**
     *
     * @param data
     * @param modified
     * @param size
     */
    constructor(data: T[], modified = false, size?: number) {
        this.modified = modified;
        if (isDefined(size)) {
            this._size = size;
            this._coords = data;
            mustSatisfy('data.length', data.length === size, () => { return `${size}`; });
        }
        else {
            this._size = void 0;
            this._coords = data;
        }
    }

    /**
     *
     */
    get coords(): T[] {
        return this._coords;
    }
    set coords(data: T[]) {
        this._coords = data;
        this.modified = true;
    }

    /**
     *
     */
    get length(): number {
        return this.coords.length;
    }

    /**
     *
     */
    clone(): VectorN<T> {
        return new VectorN<T>(this._coords, this.modified, this._size);
    }

    /**
     * @param index
     */
    getComponent(index: number): T {
        return this.coords[index];
    }

    /**
     *
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
     * @param value
     * @returns
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
     * @param index
     * @param value
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
     * @param array
     * @param offset
     * @returns
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
     * @returns
     */
    toLocaleString(): string {
        return this.coords.toLocaleString();
    }

    /**
     * @returns
     */
    toString(): string {
        return this.coords.toString();
    }
}

export default VectorN;
