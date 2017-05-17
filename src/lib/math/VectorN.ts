import { isDefined } from '../checks/isDefined';
import { isUndefined } from '../checks/isUndefined';
import { Lockable, lockable, TargetLockedError } from '../core/Lockable';
import { mustSatisfy } from '../checks/mustSatisfy';

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
export class VectorN<T> implements Lockable {
    /**
     * 
     */
    private readonly lock_ = lockable();
    /**
     *
     */
    private size_: number;

    /**
     *
     */
    private data_: T[];

    /**
     *
     */
    private modified_: boolean;

    /**
     *
     * @param data
     * @param modified
     * @param size
     */
    constructor(data: T[], modified = false, size?: number) {
        this.modified_ = modified;
        if (isDefined(size)) {
            this.size_ = size;
            this.data_ = data;
            mustSatisfy('data.length', data.length === size, () => { return `${size}`; });
        }
        else {
            this.size_ = void 0;
            this.data_ = data;
        }
    }

    isLocked(): boolean {
        return this.lock_.isLocked();
    }

    lock(): number {
        return this.lock_.lock();
    }

    unlock(token: number): void {
        return this.lock_.unlock(token);
    }

    /**
     *
     */
    get coords(): T[] {
        return this.data_;
    }
    set coords(data: T[]) {
        if (this.isLocked()) {
            throw new TargetLockedError('coords');
        }
        this.data_ = data;
        this.modified_ = true;
    }

    get modified(): boolean {
        return this.modified_;
    }
    set modified(modified: boolean) {
        this.modified_ = modified;
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
        return new VectorN<T>(this.data_, this.modified_, this.size_);
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
        if (this.isLocked()) {
            throw new TargetLockedError('pop');
        }
        if (isUndefined(this.size_)) {
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
        if (this.isLocked()) {
            throw new TargetLockedError('push');
        }
        if (isUndefined(this.size_)) {
            const data = this.coords;
            const newLength = data.push(value);
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
        if (this.isLocked()) {
            throw new TargetLockedError('setComponent');
        }
        const coords: T[] = this.coords;
        const previous = coords[index];
        if (value !== previous) {
            coords[index] = value;
            this.coords = coords;
            this.modified_ = true;
        }
    }

    /**
     * @param array
     * @param offset
     * @returns
     */
    toArray(array: T[] = [], offset = 0): T[] {
        const data = this.coords;
        const length = data.length;
        for (let i = 0; i < length; i++) {
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
