import Mutable = require('../math/Mutable');
/**
 * @class VectorN<T>
 * @extends Mutable<T[]>
 */
declare class VectorN<T> implements Mutable<T[]> {
    private _size;
    private _data;
    private _callback;
    modified: boolean;
    /**
     * @class VectorN
     * @constructor
     * @param data {T[]}
     * @param modified [boolean = false]
     * @param [size]
     */
    constructor(data: T[], modified?: boolean, size?: number);
    data: T[];
    callback: () => T[];
    length: number;
    clone(): VectorN<T>;
    getComponent(index: number): T;
    pop(): T;
    push(value: T): number;
    setComponent(index: number, value: T): void;
    toArray(array?: T[], offset?: number): T[];
    toLocaleString(): string;
    toString(): string;
}
export = VectorN;
